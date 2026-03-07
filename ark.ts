#!/usr/bin/env bun
import config from "./ark.json";
import { type CliConfig, runCli } from "./components/Cli.ts";

runCli(config as CliConfig, import.meta.path);

// unused var to test pre-commit hook
let unusedVar = 42;
