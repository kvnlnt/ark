import { spawn } from "node:child_process";
import { join } from "node:path";
import type { ToolRequest, ToolResponse } from "./types.ts";

/**
 * Spawn a tool as a child process and communicate via STDIO.
 *
 * - stdin  → JSON ToolRequest (piped)
 * - stdout ← JSON ToolResponse (captured)
 * - stderr → inherited (passed through to the terminal)
 */
export function spawnTool<P, R>(
	toolName: string,
	request: ToolRequest<P>,
): Promise<{ response: ToolResponse<R>; exitCode: number }> {
	return new Promise((resolve, reject) => {
		const toolPath = join(import.meta.dir, "tools", `${toolName}.ts`);
		const child = spawn("bun", [toolPath], {
			stdio: ["pipe", "pipe", "inherit"],
		});

		let stdout = "";

		child.stdout.on("data", (chunk: Buffer) => {
			stdout += chunk.toString();
		});

		child.stdin.write(JSON.stringify(request));
		child.stdin.end();

		child.on("error", reject);
		child.on("close", (code) => {
			try {
				const response: ToolResponse<R> = JSON.parse(stdout.trim());
				resolve({ response, exitCode: code ?? 0 });
			} catch {
				resolve({
					response: { ok: false, error: stdout || "No response from tool" },
					exitCode: code ?? 1,
				});
			}
		});
	});
}
