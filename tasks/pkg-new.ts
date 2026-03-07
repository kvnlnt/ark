import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const name = process.argv[2];

if (!name) {
  console.error("Usage: bun ark.ts pkg-create <name>");
  process.exit(1);
}

const pkgDir = join(import.meta.dir, "..", "pkg", name);
const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

await mkdir(join(pkgDir, "tasks"), { recursive: true });

const cliConfig = {
  name: capitalized,
  description: `The ${capitalized} CLI.`,
  usage: `bun ${name}.ts <command>`,
  commands: [],
};

const packageJson = {
  name,
  module: `${name}.ts`,
  type: "module",
  private: true,
  workspaces: ["pkg/*"],
  devDependencies: { "@types/bun": "latest" },
  peerDependencies: {},
  dependencies: {},
};

const tsconfig = `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
`;

const entrypoint = `import { runCli, type CliConfig } from "@ark/components/Cli";
import config from "./${name}.json";

runCli(config as CliConfig, import.meta.path);
`;

await Promise.all([
  writeFile(join(pkgDir, `${name}.json`), JSON.stringify(cliConfig, null, 2) + "\n"),
  writeFile(join(pkgDir, "package.json"), JSON.stringify(packageJson, null, 2) + "\n"),
  writeFile(join(pkgDir, "tsconfig.json"), tsconfig),
  writeFile(join(pkgDir, `${name}.ts`), entrypoint),
]);

console.log(`created pkg/${name}`);
