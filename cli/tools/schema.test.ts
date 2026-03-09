import { spawnTool } from "../spawn.ts";
import { assert, collectStderr, describe, it } from "../test.ts";
import type { ToolRequest } from "../types.ts";

/** Spawn a tool in quiet mode, collecting stderr for the test log */
async function spawn<P, R>(name: string, request: ToolRequest<P>) {
	const result = await spawnTool<P, R>(name, request, { quiet: true });
	if (result.stderr) collectStderr(result.stderr);
	return result;
}

// ── schema-list ────────────────────────────────────

describe("schema-list", () => {
	it("returns ok with a list of schemas", async () => {
		const { response, exitCode } = await spawn<
			{ args?: string[] },
			{ schemas: { name: string; type: string }[] }
		>("schema-list", { params: {} });

		assert.equal(exitCode, 0);
		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as {
			schemas: { name: string; type: string }[];
		};
		assert.greaterThan(result.schemas.length, 0);
	});

	it("includes known schemas", async () => {
		const { response } = await spawn<
			{ args?: string[] },
			{ schemas: { name: string; type: string }[] }
		>("schema-list", { params: {} });

		assert.ok(response.result);
		const result = response.result as {
			schemas: { name: string; type: string }[];
		};
		const names = result.schemas.map((s) => s.name);
		assert.ok(names.includes("db.UserRecord"), "missing db.UserRecord");
		assert.ok(
			names.includes("api.CreateUserRequest"),
			"missing api.CreateUserRequest",
		);
		assert.ok(names.includes("common.Id"), "missing common.Id");
	});
});

// ── schema-check ───────────────────────────────────

describe("schema-check", () => {
	it("all schemas pass health check", async () => {
		const { response, exitCode } = await spawn<
			{ args?: string[] },
			{ total: number; passed: number; failed: number; errors: unknown[] }
		>("schema-check", { params: {} });

		assert.equal(exitCode, 0);
		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as {
			total: number;
			passed: number;
			failed: number;
			errors: unknown[];
		};
		assert.equal(result.failed, 0);
		assert.greaterThan(result.total, 0);
		assert.equal(result.passed, result.total);
	});
});

// ── schema-validate ────────────────────────────────

describe("schema-validate", () => {
	it("validates good data successfully", async () => {
		const { response } = await spawn<
			{ args: string[] },
			{ valid: boolean; schemaName: string }
		>("schema-validate", {
			params: {
				args: ["api.CreateUserRequest", '{"email":"a@b.com","name":"Test"}'],
			},
		});

		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as { valid: boolean; schemaName: string };
		assert.ok(result.valid);
		assert.equal(result.schemaName, "api.CreateUserRequest");
	});

	it("rejects invalid data with errors", async () => {
		const { response } = await spawn<
			{ args: string[] },
			{ valid: boolean; schemaName: string; errors?: string[] }
		>("schema-validate", {
			params: { args: ["api.CreateUserRequest", '{"email":"bad","name":""}'] },
		});

		assert.ok(!response.ok);
		assert.ok(response.result);
		const result = response.result as {
			valid: boolean;
			schemaName: string;
			errors?: string[];
		};
		assert.equal(result.valid, false);
		assert.ok(result.errors);
		const errors = result.errors as string[];
		assert.greaterThan(errors.length, 0);
	});

	it("errors when schema name is missing", async () => {
		const { response } = await spawn<{ args: string[] }, unknown>(
			"schema-validate",
			{ params: { args: [] } },
		);

		assert.ok(!response.ok);
		assert.ok(response.error);
		assert.includes(response.error as string, "Usage");
	});

	it("errors for unknown schema", async () => {
		const { response } = await spawn<{ args: string[] }, unknown>(
			"schema-validate",
			{ params: { args: ["fake.Schema", "{}"] } },
		);

		assert.ok(!response.ok);
		assert.ok(response.error);
		assert.includes(response.error as string, "Unknown schema");
	});

	it("errors for invalid JSON input", async () => {
		const { response } = await spawn<{ args: string[] }, unknown>(
			"schema-validate",
			{ params: { args: ["common.Id", "not-json"] } },
		);

		assert.ok(!response.ok);
		assert.includes(response.error as string, "Invalid JSON");
	});
});

// ── schema-export ──────────────────────────────────

describe("schema-export", () => {
	it("exports all schemas when no args given", async () => {
		const { response, exitCode } = await spawn<
			{ args?: string[] },
			{ schemas: Record<string, unknown> }
		>("schema-export", { params: {} });

		assert.equal(exitCode, 0);
		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as { schemas: Record<string, unknown> };
		assert.greaterThan(Object.keys(result.schemas).length, 0);
	});

	it("exports specific schemas by name", async () => {
		const { response } = await spawn<
			{ args: string[] },
			{ schemas: Record<string, unknown> }
		>("schema-export", {
			params: { args: ["api.CreateUserRequest"] },
		});

		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as { schemas: Record<string, unknown> };
		const keys = Object.keys(result.schemas);
		assert.equal(keys.length, 1);
		assert.equal(keys[0], "api.CreateUserRequest");
	});

	it("exported JSON Schema has expected structure", async () => {
		const { response } = await spawn<
			{ args: string[] },
			{ schemas: Record<string, Record<string, unknown>> }
		>("schema-export", {
			params: { args: ["api.CreateUserRequest"] },
		});

		assert.ok(response.result);
		const result = response.result as {
			schemas: Record<string, Record<string, unknown>>;
		};
		const exported = result.schemas["api.CreateUserRequest"];
		assert.ok(exported, "exported schema should exist");
		const schema = exported as Record<string, unknown>;
		assert.equal(schema.type, "object");
		assert.ok(schema.properties);
		assert.ok(schema.required);
	});

	it("silently skips unknown schema names", async () => {
		const { response } = await spawn<
			{ args: string[] },
			{ schemas: Record<string, unknown> }
		>("schema-export", {
			params: { args: ["fake.Nope", "api.CreateUserRequest"] },
		});

		assert.ok(response.ok);
		assert.ok(response.result);
		const result = response.result as { schemas: Record<string, unknown> };
		assert.equal(Object.keys(result.schemas).length, 1);
	});
});
