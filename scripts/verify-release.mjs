import { spawnSync } from "node:child_process";

// A reserved test origin for local production-rendering checks only.
// Never deploy this build: rebuild with the owner's real SITE_URL.
const env = { ...process.env, SITE_MODE: "production", SITE_URL: process.env.SITE_URL || "https://fieldplan.test", CI: "1" };
const commands = [
  ["node_modules/eslint/bin/eslint.js", ".", "--max-warnings=0"],
  ["node_modules/next/dist/bin/next", "typegen"],
  ["node_modules/typescript/bin/tsc", "--noEmit"],
  ["node_modules/next/dist/bin/next", "build"],
  ["node_modules/@playwright/test/cli.js", "test"],
];
for (const args of commands) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
