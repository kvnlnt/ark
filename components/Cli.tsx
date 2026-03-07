import { Box, render, Text } from "ink";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Command } from "./CommandList.tsx";
import { Header } from "./Header.tsx";
import { HelpScreen } from "./HelpScreen.tsx";
import { Section } from "./Section.tsx";

export interface CliConfig {
  name: string;
  description: string;
  usage: string;
  commands: Command[];
}

const builtinCommands: Command[] = [
  { name: "help", description: "Show this help message" },
  { name: "desc", description: "Show a full description of the CLI" },
  { name: "tools", description: "List all commands in a machine-readable format for AI tooling" },
];

function Desc({ config }: { config: CliConfig }) {
  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Header name={config.name} />
      <Section title="About">
        <Text>{config.description}</Text>
      </Section>
    </Box>
  );
}

function Tools({ config }: { config: CliConfig }) {
  const allCommands = [...builtinCommands, ...config.commands];
  const toolsOutput = {
    cli: config.name,
    usage: config.usage,
    commands: allCommands.map((cmd) => ({
      name: cmd.name,
      description: cmd.description,
      usage: `${config.usage.replace("<command>", cmd.name)}`,
    })),
  };
  return <Text>{JSON.stringify(toolsOutput, null, 2)}</Text>;
}

function Help({ config }: { config: CliConfig }) {
  const allCommands = [...builtinCommands, ...config.commands];
  return <HelpScreen name={config.name} usage={config.usage} commands={allCommands} />;
}

function runTask(taskPath: string) {
  const args = process.argv.slice(3);
  const child = spawn("bun", [taskPath, ...args], {
    stdio: "inherit",
    cwd: dirname(taskPath),
  });
  child.on("close", (code) => process.exit(code ?? 0));
}

export function runCli(config: CliConfig, callerPath: string) {
  const command = process.argv[2];
  const callerDir = dirname(callerPath);

  const builtinViews: Record<string, React.ReactNode> = {
    help: <Help config={config} />,
    desc: <Desc config={config} />,
    tools: <Tools config={config} />,
  };

  if (command && builtinViews[command]) {
    render(builtinViews[command]);
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

  render(<Help config={config} />);
}
