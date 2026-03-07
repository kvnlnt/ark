import { Box, Text } from "ink";
import { type ListItem } from "./List.tsx";

export type Command = ListItem;

interface CommandListProps {
  commands: Command[];
}

export function CommandList({ commands }: CommandListProps) {
  const maxLen = Math.max(...commands.map((i) => i.name.length));

  return (
    <Box flexDirection="column">
      {commands.map((item) => (
        <Box key={item.name} flexDirection="row" gap={2}>
          <Text color="green">{item.name.padEnd(maxLen)}</Text>
          <Text>{item.description}</Text>
        </Box>
      ))}
    </Box>
  );
}
