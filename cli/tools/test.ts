import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { serve } from "../serve.ts";
import { run, type TestResult } from "../test.ts";
import type { Tool } from "../types.ts";

type TestParams = { args?: string[] };
type TestResultPayload = {
	total: number;
	passed: number;
	failed: number;
	logFile: string;
	results: TestResult[];
};

const test: Tool<TestParams, TestResultPayload> = {
	name: "test",
	description: "Run *.test.ts files in cli/tools",
	run: async (request) => {
		const toolsDir = join(import.meta.dir);
		const rootDir = join(import.meta.dir, "..", "..");
		const logFile = join(rootDir, "test-results.log");
		const filter = request.params.args?.[0];

		// Discover test files
		const entries = await readdir(toolsDir);
		let testFiles = entries.filter((f) => f.endsWith(".test.ts"));

		if (filter) {
			testFiles = testFiles.filter((f) => f.includes(filter));
		}

		if (testFiles.length === 0) {
			process.stderr.write("No test files found\n");
			return {
				ok: true,
				result: { total: 0, passed: 0, failed: 0, logFile, results: [] },
			};
		}

		// Import each test file to register suites
		for (const file of testFiles) {
			await import(join(toolsDir, file));
		}

		// Run all registered suites (tool output captured in quiet mode)
		const results = await run();

		// Build log and report
		const log: string[] = [];
		let passed = 0;
		let failed = 0;

		log.push(`Test run: ${new Date().toISOString()}`);
		log.push(`Files:    ${testFiles.join(", ")}`);
		log.push("");

		for (const r of results) {
			if (r.passed) {
				passed++;
				const line = `✓ ${r.suite} › ${r.test}`;
				process.stderr.write(`  ${line}\n`);
				log.push(line);
			} else {
				failed++;
				const line = `✗ ${r.suite} › ${r.test}`;
				process.stderr.write(`  ${line}\n`);
				process.stderr.write(`    ${r.error}\n`);
				log.push(line);
				log.push(`  error: ${r.error}`);
				if (r.stderr) {
					process.stderr.write(`    --- tool output ---\n${r.stderr}`);
					log.push("  --- tool output ---");
					log.push(r.stderr);
				}
			}

			// Always write tool output to the log
			if (r.stderr) {
				log.push(`  [output] ${r.stderr.trimEnd()}`);
			}
		}

		const total = results.length;
		const summary = `\n${passed} passed, ${failed} failed, ${total} total`;
		process.stderr.write(`${summary}\n`);
		log.push(summary);

		// Write full log to file
		await writeFile(logFile, `${log.join("\n")}\n`);
		process.stderr.write(`log: test-results.log\n`);

		return {
			ok: failed === 0,
			result: { total, passed, failed, logFile, results },
		};
	},
};

serve(test);
