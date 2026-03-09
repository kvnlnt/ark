import { spawn } from "node:child_process";
import { join } from "node:path";
import type { ToolRequest, ToolResponse } from "./types.ts";

export type SpawnOptions = {
	/** When true, capture stderr instead of inheriting it */
	quiet?: boolean;
};

export type SpawnResult<R> = {
	response: ToolResponse<R>;
	exitCode: number;
	/** Captured stderr output (only when quiet: true) */
	stderr: string;
};

/**
 * Spawn a tool as a child process and communicate via STDIO.
 *
 * - stdin  → JSON ToolRequest (piped)
 * - stdout ← JSON ToolResponse (captured)
 * - stderr → inherited (default) or captured (quiet: true)
 */
export function spawnTool<P, R>(
	toolName: string,
	request: ToolRequest<P>,
	options?: SpawnOptions,
): Promise<SpawnResult<R>> {
	return new Promise((resolve, reject) => {
		const toolPath = join(import.meta.dir, "tools", `${toolName}.ts`);
		const quiet = options?.quiet ?? false;
		const child = spawn("bun", [toolPath], {
			stdio: ["pipe", "pipe", quiet ? "pipe" : "inherit"],
		});

		const { stdin, stdout: childOut } = child;
		if (!stdin || !childOut) {
			reject(new Error("Failed to open stdio pipes"));
			return;
		}

		let stdout = "";
		let stderr = "";

		childOut.on("data", (chunk: Buffer) => {
			stdout += chunk.toString();
		});

		if (quiet && child.stderr) {
			child.stderr.on("data", (chunk: Buffer) => {
				stderr += chunk.toString();
			});
		}

		stdin.write(JSON.stringify(request));
		stdin.end();

		child.on("error", reject);
		child.on("close", (code) => {
			try {
				const response: ToolResponse<R> = JSON.parse(stdout.trim());
				resolve({ response, exitCode: code ?? 0, stderr });
			} catch {
				resolve({
					response: { ok: false, error: stdout || "No response from tool" },
					exitCode: code ?? 1,
					stderr,
				});
			}
		});
	});
}
