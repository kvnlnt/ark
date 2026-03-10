import { exec } from "../exec.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type LintCheckParams = { args?: string[] };
type LintCheckResult = { exitCode: number };

const lintCheck: Tool<LintCheckParams, LintCheckResult> = {
	name: "lint-check",
	description: "Format, lint, and organize imports with Biome (all-in-one)",
	run: async (request: ToolRequest<LintCheckParams>) => {
		const files = request.params.args ?? [];
		const args = ["--bun", "@biomejs/biome", "check", "--write", ...files];
		const result = await exec("bunx", args, process.cwd());
		return {
			ok: result.exitCode === 0,
			result: { exitCode: result.exitCode },
		};
	},
};

serve(lintCheck);
