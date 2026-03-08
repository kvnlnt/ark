import type { Tool, ToolResponse } from "./types.ts";

/**
 * Wire up a Tool to communicate over STDIO.
 *
 * - Reads a JSON ToolRequest from stdin (skipped when stdin is a TTY).
 * - Calls tool.run() with the parsed request.
 * - Writes the JSON ToolResponse to stdout.
 * - Human-readable output should go to stderr (process.stderr.write).
 */
export async function serve<P, R>(tool: Tool<P, R>): Promise<void> {
	let request: { params: P };

	try {
		const input = process.stdin.isTTY ? "" : await Bun.stdin.text();
		request = input.trim() ? JSON.parse(input) : { params: {} as P };
	} catch {
		request = { params: {} as P };
	}

	try {
		const response = await tool.run(request);
		process.stdout.write(`${JSON.stringify(response)}\n`);
	} catch (err) {
		const response: ToolResponse<R> = {
			ok: false,
			error: err instanceof Error ? err.message : String(err),
		};
		process.stdout.write(`${JSON.stringify(response)}\n`);
		process.exit(1);
	}
}
