import { spawn } from "node:child_process";

export type ExecResult = {
	exitCode: number;
	stdout: string;
	stderr: string;
};

/**
 * Run an external command, forwarding its output to stderr so the user
 * sees it in real-time while keeping stdout reserved for the STDIO protocol.
 */
export function exec(
	cmd: string,
	args: string[],
	cwd?: string,
): Promise<ExecResult> {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { cwd });
		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (chunk: Buffer) => {
			stdout += chunk.toString();
			process.stderr.write(chunk);
		});

		child.stderr.on("data", (chunk: Buffer) => {
			stderr += chunk.toString();
			process.stderr.write(chunk);
		});

		child.on("error", reject);
		child.on("close", (exitCode) => {
			resolve({ exitCode: exitCode ?? 0, stdout, stderr });
		});
	});
}
