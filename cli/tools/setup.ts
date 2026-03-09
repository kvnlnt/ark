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

		// install git hooks
		const preCommitSource = join(rootDir, "cli", "templates", "pre-commit");
		const hooksDest = join(rootDir, ".git", "hooks");
		await mkdir(hooksDest, { recursive: true });
		const preCommitDest = join(hooksDest, "pre-commit");
		await copyFile(preCommitSource, preCommitDest);
		await chmod(preCommitDest, 0o755);
		process.stderr.write(`installed hook: pre-commit\n`);

		// potentially more setup tasks in the future...
		process.stderr.write("setup complete\n");
		return { ok: true, result: { installed: ["pre-commit"] } };
	},
};

serve(setup);
