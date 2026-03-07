import { spawn } from "node:child_process";

const files = process.argv.slice(2);
const args = ["--bun", "@biomejs/biome", "format", "--write", ...files];

const child = spawn("bunx", args, { stdio: "inherit", cwd: process.cwd() });
child.on("close", (code) => process.exit(code ?? 0));
