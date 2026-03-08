#!/usr/bin/env bun
import config from "./ark.json";
import { printHelpScreen } from "./cli/components/HelpScreen.ts";
import { spawnTool } from "./cli/spawn.ts";
import type { ToolRequest } from "./cli/types.ts";

const command = process.argv[2];
const args = process.argv.slice(3);

const builtinCommands = [
	{ name: "help", description: "Show this help message" },
];

if (!command || command === "help") {
	printHelpScreen(config.name, config.usage, [
		...builtinCommands,
		...config.commands,
	]);
	process.exit(0);
}

const toolCmd = config.commands.find((c) => c.name === command);
if (!toolCmd) {
	console.error(`Unknown command: ${command}`);
	process.exit(1);
}

const request: ToolRequest<{ args: string[] }> = { params: { args } };
const { response, exitCode } = await spawnTool(command, request);

if (!response.ok) {
	console.error(response.error ?? "Tool failed");
}

process.exit(exitCode);
