import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const pkgDir = join(import.meta.dir, "..", "pkg");
const entries = await readdir(pkgDir, { withFileTypes: true });
const pkgs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

const targets = ["node_modules"];

for (const pkg of pkgs) {
  for (const target of targets) {
    const path = join(pkgDir, pkg, target);
    await rm(path, { recursive: true, force: true }).then(
      () => console.log(`removed pkg/${pkg}/${target}`),
      () => {},
    );
  }
}

console.log("clean complete");
