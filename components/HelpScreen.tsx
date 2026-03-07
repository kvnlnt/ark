import { Box, Text } from "ink";
import { CommandList, type Command } from "./CommandList.js";
import { Header } from "./Header.js";

interface HelpScreenProps {
  name: string;
  version?: string;
  description?: string;
  usage?: string;
  commands: Command[];
}

export function HelpScreen({ name, version, description, usage, commands }: HelpScreenProps) {
  return (
    <Box flexDirection="column" padding={1} gap={1}>
      <Header name={name} version={version} />
      {description && <Text>{description}</Text>}
      {usage && (
        <Box flexDirection="column">
          <Text bold>Usage:</Text>
          <Box marginLeft={2}>
            <Text dimColor>{usage}</Text>
          </Box>
        </Box>
      )}
      <CommandList commands={commands} />
    </Box>
  );
}
