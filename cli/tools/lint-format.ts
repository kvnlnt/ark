import { exec } from "../exec.ts";
import { serve } from "../serve.ts";
import type { Tool, ToolRequest } from "../types.ts";

type LintFormatParams = { args?: string[] };
type LintFormatResult = { exitCode: number };

const lintFormat: Tool<LintFormatParams, LintFormatResult> = {
	name: "lint-format",
	description: "Format files with Biome",
	run: async (request: ToolRequest<LintFormatParams>) => {
		const files = request.params.args ?? [];
		const args = ["--bun", "@biomejs/biome", "format", "--write", ...files];
		const result = await exec("bunx", args, process.cwd());
		return {
			ok: result.exitCode === 0,
			result: { exitCode: result.exitCode },
		};
	},
};

serve(lintFormat);
