import { registry } from "../../pkg/schema/registry.ts";
import { serve } from "../serve.ts";
import type { Tool } from "../types.ts";

type SchemaListParams = { args?: string[] };
type SchemaListResult = { schemas: { name: string; type: string }[] };

const schemaList: Tool<SchemaListParams, SchemaListResult> = {
	name: "schema-list",
	description: "List all registered schemas",
	run: async () => {
		const schemas = Object.entries(registry).map(([name, schema]) => ({
			name,
			type: schema._zpiType ?? schema.constructor.name ?? "unknown",
		}));

		const maxLen = Math.max(...schemas.map((s) => s.name.length));
		for (const s of schemas) {
			process.stderr.write(`${s.name.padEnd(maxLen)}   ${s.type}\n`);
		}
		process.stderr.write(`\n${schemas.length} schema(s) registered\n`);

		return { ok: true, result: { schemas } };
	},
};

serve(schemaList);
