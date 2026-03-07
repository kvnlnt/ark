import { runCli, type CliConfig } from "@ark/components/Cli";
import config from "./db.json";

runCli(config as CliConfig, import.meta.path);
