import { runCli, type CliConfig } from "@ark/components/Cli.tsx";
import config from "./schema.json";

runCli(config as CliConfig);
