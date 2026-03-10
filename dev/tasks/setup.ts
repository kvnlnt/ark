import { chmod, copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const rootDir = join(import.meta.dir, "..", "..");

// install git hooks
const preCommitSource = join(rootDir, "dev", "templates", "pre-commit");
const hooksDest = join(rootDir, ".git", "hooks");
await mkdir(hooksDest, { recursive: true });
const preCommitDest = join(hooksDest, "pre-commit");
await copyFile(preCommitSource, preCommitDest);
await chmod(preCommitDest, 0o755);
process.stderr.write(`installed hook: pre-commit\n`);

// potentially more setup tasks in the future...
process.stderr.write("setup complete\n");
