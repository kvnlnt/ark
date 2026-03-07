import config from "./ark.json";
import { runCli, type CliConfig } from "./components/Cli.tsx";

runCli(config as CliConfig);
