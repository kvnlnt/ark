import { Box, render, Text } from "ink";
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

interface CliProps {
  config: CliConfig;
  views?: Record<string, React.ReactNode>;
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

export function runCli(config: CliConfig, views?: Record<string, React.ReactNode>) {
  const command = process.argv[2];

  const builtinViews: Record<string, React.ReactNode> = {
    help: <Help config={config} />,
    desc: <Desc config={config} />,
    tools: <Tools config={config} />,
  };

  const allViews = { ...builtinViews, ...views };

  render(command && allViews[command] ? allViews[command] : <Help config={config} />);
}
