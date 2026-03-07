import { runCli, type CliConfig } from "@ark/components/Cli";
import config from "./api.json";

runCli(config as CliConfig, import.meta.path);
