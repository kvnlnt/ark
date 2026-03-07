import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const pkgName = process.argv[2];
const pkgArgs = process.argv.slice(3);

if (!pkgName) {
	console.error("Usage: bun ark.ts pkg <name> [command] [args...]");
	process.exit(1);
}

const pkgDir = join(import.meta.dir, "..", "pkg", pkgName);
const entryPoint = join(pkgDir, `${pkgName}.ts`);

if (!existsSync(entryPoint)) {
	console.error(
		`Package "${pkgName}" not found at pkg/${pkgName}/${pkgName}.ts`,
	);
	process.exit(1);
}

const child = spawn("bun", [entryPoint, ...pkgArgs], {
	stdio: "inherit",
	cwd: pkgDir,
});
child.on("close", (code) => process.exit(code ?? 0));
