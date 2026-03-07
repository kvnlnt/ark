import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..");
const hooksSource = join(rootDir, "hooks");
const hooksDest = join(rootDir, ".git", "hooks");

await mkdir(hooksDest, { recursive: true });

const hooks = ["pre-commit"];

for (const hook of hooks) {
	const src = join(hooksSource, hook);
	const dest = join(hooksDest, hook);
	await copyFile(src, dest);
	// Make executable (owner rwx, group rx, other rx)
	const { chmod } = await import("node:fs/promises");
	await chmod(dest, 0o755);
	console.log(`installed hook: ${hook}`);
}

console.log("setup complete");
