#!/usr/bin/env bun
import { type CliConfig, runCli } from "@ark/components/Cli";
import config from "./schema.json";

runCli(config as CliConfig, import.meta.path);
