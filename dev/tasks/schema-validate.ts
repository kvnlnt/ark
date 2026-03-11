import { registry } from "../../pkg/schema/registry.ts";

const run = async () => {
	const args = process.argv.slice(2);
	const schemaName = args[0];
	const jsonInput = args.slice(1).join(" ");

	if (!schemaName) {
		process.stderr.write("Usage: schema-validate <schema-name> <json>\n");
		process.exit(1);
	}

	const schema = registry[schemaName];
	if (!schema) {
		const available = Object.keys(registry).join(", ");
		process.stderr.write(
			`Unknown schema "${schemaName}". Available: ${available}\n`,
		);
		process.exit(1);
	}

	let data: unknown;
	try {
		data = JSON.parse(jsonInput);
	} catch {
		process.stderr.write(`Invalid JSON: ${jsonInput}\n`);
		process.exit(1);
	}

	const result = schema.safeParse(data);

	if (result.success) {
		process.stderr.write(`✓ Valid against ${schemaName}\n`);
		process.exit(0);
	}

	const errors = result.error.issues.map(
		(issue) => `${issue.path.join(".")}: ${issue.message}`,
	);
	for (const err of errors) {
		process.stderr.write(`✗ ${err}\n`);
	}
	process.stderr.write(`\n${errors.length} error(s) in ${schemaName}\n`);
	process.exit(1);
};

await run();
