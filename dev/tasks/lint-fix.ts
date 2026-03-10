import { exec } from "../exec.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type LintFixParams = { args?: string[] };
type LintFixResult = { exitCode: number };

const lintFix: Tool<LintFixParams, LintFixResult> = {
	name: "lint-fix",
	description: "Lint files and apply safe fixes with Biome",
	run: async (request: ToolRequest<LintFixParams>) => {
		const files = request.params.args ?? [];
		const args = ["--bun", "@biomejs/biome", "lint", "--write", ...files];
		const result = await exec("bunx", args, process.cwd());
		return {
			ok: result.exitCode === 0,
			result: { exitCode: result.exitCode },
		};
	},
};

serve(lintFix);
