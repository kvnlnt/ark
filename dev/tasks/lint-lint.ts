import { exec } from "../exec.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type LintLintParams = { args?: string[] };
type LintLintResult = { exitCode: number };

const lintLint: Tool<LintLintParams, LintLintResult> = {
	name: "lint-lint",
	description: "Lint files with Biome without applying fixes",
	run: async (request: ToolRequest<LintLintParams>) => {
		const files = request.params.args ?? [];
		const args = ["--bun", "@biomejs/biome", "lint", ...files];
		const result = await exec("bunx", args, process.cwd());
		return {
			ok: result.exitCode === 0,
			result: { exitCode: result.exitCode },
		};
	},
};

serve(lintLint);
