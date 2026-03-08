import { z } from "zod";
import { registry } from "../../pkg/schema/registry.ts";
import { serve } from "../serve.ts";
import type { Tool } from "../types.ts";

type SchemaCheckParams = { args?: string[] };
type SchemaCheckResult = {
	total: number;
	passed: number;
	failed: number;
	errors: { name: string; error: string }[];
};

const schemaCheck: Tool<SchemaCheckParams, SchemaCheckResult> = {
	name: "schema-check",
	description: "Verify all schema definitions are valid and parseable",
	run: async () => {
		const errors: { name: string; error: string }[] = [];
		let passed = 0;

		for (const [name, schema] of Object.entries(registry)) {
			try {
				// Verify the schema instance is a valid ZodType
				if (!(schema instanceof z.ZodType)) {
					throw new Error("Not a valid ZodType instance");
				}

				// Attempt safeParse with undefined to exercise the schema tree.
				// We don't care about the result — only that it doesn't throw.
				schema.safeParse(undefined);

				process.stderr.write(`✓ ${name}\n`);
				passed++;
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				process.stderr.write(`✗ ${name}: ${msg}\n`);
				errors.push({ name, error: msg });
			}
		}

		const total = Object.keys(registry).length;
		const failed = errors.length;
		process.stderr.write(`\n${passed}/${total} passed`);
		if (failed > 0) {
			process.stderr.write(`, ${failed} failed`);
		}
		process.stderr.write("\n");

		return {
			ok: failed === 0,
			result: { total, passed, failed, errors },
		};
	},
};

serve(schemaCheck);
