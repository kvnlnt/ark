const run = async () => {
	const files = process.argv.slice(2);
	const args = ["--bun", "@biomejs/biome", "check", "--write", ...files];
	const proc = Bun.spawn(["bunx", ...args], {
		stdout: "inherit",
		stderr: "inherit",
		cwd: process.cwd(),
	});
	const exitCode = await proc.exited;
	process.exit(exitCode);
};

await run();
