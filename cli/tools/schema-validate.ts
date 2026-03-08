import { registry } from "../../pkg/schema/registry.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type SchemaValidateParams = { args?: string[] };
type SchemaValidateResult = {
	valid: boolean;
	schemaName: string;
	errors?: string[];
};

const schemaValidate: Tool<SchemaValidateParams, SchemaValidateResult> = {
	name: "schema-validate",
	description: "Validate JSON data against a named schema",
	run: async (request: ToolRequest<SchemaValidateParams>) => {
		const args = request.params.args ?? [];
		const schemaName = args[0];
		const jsonInput = args.slice(1).join(" ");

		if (!schemaName) {
			return {
				ok: false,
				error: "Usage: ark schema-validate <schema-name> <json>",
			};
		}

		const schema = registry[schemaName];
		if (!schema) {
			const available = Object.keys(registry).join(", ");
			return {
				ok: false,
				error: `Unknown schema "${schemaName}". Available: ${available}`,
			};
		}

		let data: unknown;
		try {
			data = JSON.parse(jsonInput);
		} catch {
			return {
				ok: false,
				error: `Invalid JSON: ${jsonInput}`,
			};
		}

		const result = schema.safeParse(data);

		if (result.success) {
			process.stderr.write(`✓ Valid against ${schemaName}\n`);
			return {
				ok: true,
				result: { valid: true, schemaName },
			};
		}

		const errors = result.error.issues.map(
			(issue) => `${issue.path.join(".")}: ${issue.message}`,
		);
		for (const err of errors) {
			process.stderr.write(`✗ ${err}\n`);
		}
		process.stderr.write(`\n${errors.length} error(s) in ${schemaName}\n`);

		return {
			ok: false,
			result: { valid: false, schemaName, errors },
		};
	},
};

serve(schemaValidate);
