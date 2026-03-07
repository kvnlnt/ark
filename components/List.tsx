import { Box, Text } from "ink";

export interface ListItem {
  name: string;
  description: string;
}

interface ListProps {
  title?: string;
  items: ListItem[];
  color?: string;
}

export function List({ title, items, color = "grey" }: ListProps) {
  const maxLen = Math.max(...items.map((i) => i.name.length));

  return (
    <Box flexDirection="column" gap={1}>
      {title && <Text bold>{title}</Text>}
      {items.map((item) => (
        <Box key={item.name} flexDirection="column">
          <Text color={color}>{item.name.padEnd(maxLen)}</Text>
          <Text>{item.description}</Text>
        </Box>
      ))}
    </Box>
  );
}
