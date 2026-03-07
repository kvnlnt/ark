#!/usr/bin/env bun
import config from "./ark.json";
import { type CliConfig, runCli } from "./components/Cli.ts";

runCli(config as CliConfig, import.meta.path);

let unusedVar = 42;

function greet(name) {
	console.log("Hello " + name);
}

greet("World");
