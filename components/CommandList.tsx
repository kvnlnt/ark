import { Box, Text } from "ink";

export interface Command {
  name: string;
  description: string;
}

interface CommandListProps {
  commands: Command[];
}

export function CommandList({ commands }: CommandListProps) {
  const maxLen = Math.max(...commands.map((c) => c.name.length));

  return (
    <Box flexDirection="column">
      <Text bold>Commands:</Text>
      {commands.map((cmd) => (
        <Box key={cmd.name} gap={3} marginLeft={2}>
          <Text color="green">{cmd.name.padEnd(maxLen)}</Text>
          <Text>{cmd.description}</Text>
        </Box>
      ))}
    </Box>
  );
}
