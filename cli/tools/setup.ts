import { chmod, copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { serve } from "../serve.ts";
import type { Tool } from "../types.ts";

type SetupParams = { args?: string[] };
type SetupResult = { installed: string[] };

const setup: Tool<SetupParams, SetupResult> = {
	name: "setup",
	description: "Set up the dev environment (install git hooks, etc.)",
	run: async () => {
		const rootDir = join(import.meta.dir, "..", "..");
		const hooksSource = join(rootDir, "hooks");
		const hooksDest = join(rootDir, ".git", "hooks");
		await mkdir(hooksDest, { recursive: true });
		const hooks = ["pre-commit"];
		const installed: string[] = [];

		for (const hook of hooks) {
			const src = join(hooksSource, hook);
			const dest = join(hooksDest, hook);
			await copyFile(src, dest);
			await chmod(dest, 0o755);
			process.stderr.write(`installed hook: ${hook}\n`);
			installed.push(hook);
		}

		process.stderr.write("setup complete\n");
		return { ok: true, result: { installed } };
	},
};

serve(setup);
