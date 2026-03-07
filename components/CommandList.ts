import type { ListItem } from "./List.ts";

export type Command = ListItem;

export function printCommandList(commands: Command[]): void {
	const maxLen = Math.max(...commands.map((c) => c.name.length));
	for (const cmd of commands) {
		console.log(`${cmd.name.padEnd(maxLen)}   ${cmd.description}`);
	}
}
