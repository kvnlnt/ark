import { join } from "node:path";

const rootDir = join(import.meta.dir, "..");
const gitHookDir = join(rootDir, ".git", "hooks");
const gitHookFile = await Bun.file(
	`${rootDir}/scripts/templates/pre-commit`,
).text();

await Bun.write(join(gitHookDir, "pre-commit"), gitHookFile, { mode: 0o755 });
process.stderr.write(`installed hook: pre-commit\n`);

// potentially more setup tasks in the future...
process.stderr.write("setup complete\n");
