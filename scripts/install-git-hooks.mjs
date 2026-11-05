import fs from "node:fs";
import { execFileSync } from "node:child_process";

if (!fs.existsSync(".git")) {
  console.log("install-git-hooks: no .git here, skipped");
  process.exit(0);
}

execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
console.log("install-git-hooks: core.hooksPath=.githooks");
