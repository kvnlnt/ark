import { chmod, copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..", "..");

// install git hook
const gitHook = join(rootDir, "dev", "templates", "pre-commit");
const hooksDest = join(rootDir, ".git", "hooks");
await mkdir(hooksDest, { recursive: true });
const preCommitDest = join(hooksDest, "pre-commit");
await copyFile(gitHook, preCommitDest);
await chmod(preCommitDest, 0o755);
process.stderr.write(`installed hook: pre-commit\n`);

// copy all dev/tasks/*.prompt.md files to .github/prompts
const promptsSrc = join(rootDir, "dev", "tasks");
const promptsDest = join(rootDir, ".github", "prompts");
await mkdir(promptsDest, { recursive: true });
const promptFiles = await (await import("node:fs/promises")).readdir(
	promptsSrc,
);
for (const file of promptFiles) {
	if (file.endsWith(".prompt.md")) {
		const src = join(promptsSrc, file);
		const dest = join(promptsDest, file);
		await copyFile(src, dest);
		process.stderr.write(`copied prompt: ${file}\n`);
	}
}

// potentially more setup tasks in the future...
process.stderr.write("setup complete\n");
