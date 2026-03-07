import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { type ListItem, printList } from "../components/List.ts";

const pkgDir = join(import.meta.dir, "..", "pkg");
const entries = await readdir(pkgDir, { withFileTypes: true });
const pkgs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

const items: ListItem[] = [];

for (const pkg of pkgs) {
	const configPath = join(pkgDir, pkg, `${pkg}.json`);
	try {
		const config = await Bun.file(configPath).json();
		items.push({ name: config.name, description: config.description });
	} catch {
		items.push({ name: pkg, description: "(no config found)" });
	}
}

printList(items, "Packages:");
