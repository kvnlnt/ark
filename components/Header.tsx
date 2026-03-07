import { Box, Text } from "ink";

interface HeaderProps {
  name: string;
  version?: string;
}

export function Header({ name, version }: HeaderProps) {
  return (
    <Box flexDirection="row" gap={1}>
      <Text bold color="cyan">
        {name}
      </Text>
      {version && <Text dimColor>v{version}</Text>}
    </Box>
  );
}
