import { registry } from "../../pkg/schema/registry.ts";

const run = async () => {
	const schemas = Object.entries(registry).map(([name, schema]) => ({
		name,
		type:
			(schema as any)._def?.typeName ?? schema.constructor.name ?? "unknown",
	}));

	const maxLen = Math.max(...schemas.map((s) => s.name.length));
	for (const s of schemas) {
		process.stderr.write(`${s.name.padEnd(maxLen)}   ${s.type}\n`);
	}
	process.stderr.write(`\n${schemas.length} schema(s) registered\n`);
};

await run();
