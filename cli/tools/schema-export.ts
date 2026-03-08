import { z } from "zod";
import { registry } from "../../pkg/schema/registry.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type SchemaExportParams = { args?: string[] };
type SchemaExportResult = { schemas: Record<string, unknown> };

/**
 * Convert a Zod schema to a JSON-Schema-like representation.
 * Zod v4 has toJSONSchema() — use it if available, otherwise fall back to
 * a simple introspection.
 */
function toJsonSchema(schema: z.ZodType): unknown {
	try {
		// Zod v4 built-in JSON Schema conversion
		return z.toJSONSchema(schema);
	} catch {
		return { description: "Could not convert to JSON Schema" };
	}
}

const schemaExport: Tool<SchemaExportParams, SchemaExportResult> = {
	name: "schema-export",
	description: "Export schema(s) as JSON Schema",
	run: async (request: ToolRequest<SchemaExportParams>) => {
		const args = request.params.args ?? [];

		// If specific names given, export only those; otherwise export all.
		const names = args.length > 0 ? args : Object.keys(registry);

		const schemas: Record<string, unknown> = {};

		for (const name of names) {
			const schema = registry[name];
			if (!schema) {
				process.stderr.write(`⚠ Unknown schema: ${name}\n`);
				continue;
			}
			schemas[name] = toJsonSchema(schema);
		}

		const output = JSON.stringify(schemas, null, 2);
		process.stderr.write(`${output}\n`);
		process.stderr.write(
			`\nExported ${Object.keys(schemas).length} schema(s)\n`,
		);

		return { ok: true, result: { schemas } };
	},
};

serve(schemaExport);
