import { type Command, printCommandList } from "./CommandList.ts";
import { printHeader } from "./Header.ts";

export function printHelpScreen(
	name: string,
	usage: string,
	commands: Command[],
	version?: string,
): void {
	printHeader(name, version);
	console.log(`\nUsage: ${usage}\n`);
	printCommandList(commands);
	console.log();
}
