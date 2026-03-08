export interface ListItem {
	name: string;
	description: string;
}

export function printList(items: ListItem[], title?: string): void {
	if (title) console.log(`\n${title}\n`);
	for (const item of items) {
		console.log(`- ${item.name}: ${item.description}`);
	}
	console.log();
}
