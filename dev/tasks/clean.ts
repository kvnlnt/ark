import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { serve } from "../serve.ts";
import type { Tool } from "../types.ts";

type CleanParams = { args?: string[] };
type CleanResult = { removed: string[] };

const clean: Tool<CleanParams, CleanResult> = {
	name: "clean",
	description: "Remove generated files and node_modules from all packages",
	run: async () => {
		const pkgDir = join(import.meta.dir, "..", "..", "pkg");
		const entries = await readdir(pkgDir, { withFileTypes: true });
		const pkgs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
		const targets = ["node_modules"];
		const removed: string[] = [];

		for (const pkg of pkgs) {
			for (const target of targets) {
				const path = join(pkgDir, pkg, target);
				await rm(path, { recursive: true, force: true }).then(
					() => {
						const label = `pkg/${pkg}/${target}`;
						process.stderr.write(`removed ${label}\n`);
						removed.push(label);
					},
					() => {},
				);
			}
		}

		process.stderr.write("clean complete\n");
		return { ok: true, result: { removed } };
	},
};

serve(clean);
