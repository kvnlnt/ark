import { z } from "zod";
import { registry } from "../../pkg/schema/registry.ts";

const run = async () => {
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

	process.exit(failed > 0 ? 1 : 0);
};

await run();
