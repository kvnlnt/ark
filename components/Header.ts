export function printHeader(name: string, version?: string): void {
	const v = version ? ` v${version}` : "";
	console.log(`\n${name.toUpperCase()}${v}`);
}
