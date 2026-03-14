/**
 * Zero-dependency test harness.
 *
 * Provides describe/it/assert primitives and a runner that discovers
 * and executes *.test.ts files via `spawnTool("test", ...)`.
 */

type TestFn = () => Promise<void> | void;

type TestCase = { name: string; fn: TestFn };
type Suite = {
	name: string;
	tests: TestCase[];
	before?: TestFn;
	after?: TestFn;
};

const suites: Suite[] = [];
let currentSuite: Suite | null = null;

/** Group related tests */
export function describe(name: string, fn: () => void): void {
	const suite: Suite = { name, tests: [] };
	currentSuite = suite;
	fn();
	suites.push(suite);
	currentSuite = null;
}

/** Register a test case inside a describe block */
export function it(name: string, fn: TestFn): void {
	if (!currentSuite) throw new Error(`it("${name}") must be inside describe()`);
	currentSuite.tests.push({ name, fn });
}

/** Optional before/after hooks for a suite */
export function beforeAll(fn: TestFn): void {
	if (!currentSuite) throw new Error("beforeAll must be inside describe()");
	currentSuite.before = fn;
}
export function afterAll(fn: TestFn): void {
	if (!currentSuite) throw new Error("afterAll must be inside describe()");
	currentSuite.after = fn;
}

/** Assertion helpers */
export const assert = {
	ok(value: unknown, msg?: string): void {
		if (!value)
			throw new Error(msg ?? `Expected truthy, got ${JSON.stringify(value)}`);
	},

	equal<T>(actual: T, expected: T, msg?: string): void {
		if (actual !== expected)
			throw new Error(
				msg ??
					`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
			);
	},

	deepEqual(actual: unknown, expected: unknown, msg?: string): void {
		const a = JSON.stringify(actual);
		const b = JSON.stringify(expected);
		if (a !== b) throw new Error(msg ?? `Expected ${b}, got ${a}`);
	},

	throws(fn: () => void, msg?: string): void {
		try {
			fn();
		} catch {
			return;
		}
		throw new Error(msg ?? "Expected function to throw");
	},

	includes(haystack: string, needle: string, msg?: string): void {
		if (!haystack.includes(needle))
			throw new Error(msg ?? `Expected "${haystack}" to include "${needle}"`);
	},

	greaterThan(actual: number, expected: number, msg?: string): void {
		if (!(actual > expected))
			throw new Error(msg ?? `Expected ${actual} > ${expected}`);
	},
};

export type TestResult = {
	suite: string;
	test: string;
	passed: boolean;
	error?: string;
	stderr?: string;
};

/** Collected stderr fragments for the currently-running test */
let stderrBuffer: string[] = [];

/** Append captured tool stderr for the current test */
export function collectStderr(output: string): void {
	stderrBuffer.push(output);
}

/** Run all registered suites and return results */
export async function run(): Promise<TestResult[]> {
	const results: TestResult[] = [];

	for (const suite of suites) {
		if (suite.before) await suite.before();

		for (const test of suite.tests) {
			stderrBuffer = [];
			try {
				await test.fn();
				results.push({
					suite: suite.name,
					test: test.name,
					passed: true,
					stderr: stderrBuffer.join("") || undefined,
				});
			} catch (err) {
				const error = err instanceof Error ? err.message : String(err);
				results.push({
					suite: suite.name,
					test: test.name,
					passed: false,
					error,
					stderr: stderrBuffer.join("") || undefined,
				});
			}
		}

		if (suite.after) await suite.after();
	}

	return results;
}
