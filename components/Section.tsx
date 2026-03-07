import { Box, Text } from "ink";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <Box flexDirection="column">
      {title && (
        <Text bold underline>
          {title}
        </Text>
      )}
      <Box flexDirection="column">{children}</Box>
    </Box>
  );
}
