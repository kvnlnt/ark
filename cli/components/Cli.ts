import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Command } from "./CommandList.ts";
import { printHelpScreen } from "./HelpScreen.ts";

export interface CliConfig {
	name: string;
	description: string;
	usage: string;
	commands: Command[];
}

const builtinCommands: Command[] = [
	{ name: "help", description: "Show this help message" },
];

function printHelp(config: CliConfig): void {
	const allCommands = [...builtinCommands, ...config.commands];
	printHelpScreen(config.name, config.usage, allCommands);
}

function runTask(taskPath: string): void {
	const args = process.argv.slice(3);
	const child = spawn("bun", [taskPath, ...args], {
		stdio: "inherit",
		cwd: dirname(taskPath),
	});
	child.on("close", (code) => process.exit(code ?? 0));
}

export function runCli(config: CliConfig, callerPath: string): void {
	const command = process.argv[2];
	const callerDir = dirname(callerPath);

	const builtinActions: Record<string, () => void> = {
		help: () => printHelp(config),
	};

	if (command && builtinActions[command]) {
		builtinActions[command]();
		return;
	}

	const taskCommand = config.commands.find((c) => c.name === command);
	if (taskCommand) {
		const tasksDir = join(callerDir, "tasks");
		const tsPath = join(tasksDir, `${taskCommand.name}.ts`);
		const tsxPath = join(tasksDir, `${taskCommand.name}.tsx`);
		const taskPath = existsSync(tsxPath) ? tsxPath : tsPath;
		runTask(taskPath);
		return;
	}

	printHelp(config);
}
