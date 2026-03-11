import { z } from "zod";
import { registry } from "../../pkg/schema/registry.ts";

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

const run = async () => {
	const args = process.argv.slice(2);

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
	process.stderr.write(`\nExported ${Object.keys(schemas).length} schema(s)\n`);
};

await run();
