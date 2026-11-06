#!/usr/bin/env node
// Builds the public preview of the site (scope feature 5b) into apps/web/out.
// Usage: PREVIEW_BASE_PATH=/tlf-website pnpm preview:build
//
// 1. Runs the normal web build with PREVIEW_EXPORT=1, which turns on the static export,
//    the base path from PREVIEW_BASE_PATH, trailing slashes and the noindex robots tag
//    (apps/web/src/lib/preview.ts). Every other variable passes through unchanged, so
//    CALENDLY_URL is used if you set it and the buttons link to "#" if you do not.
// 2. Adds robots.txt (disallow everything) and .nojekyll to the output.
// 3. Removes any source maps, then fails if anything other than the built site is there:
//    no env files, no docs, no other hidden files.
import { spawnSync } from "node:child_process";
import { readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "apps", "web", "out");

const build = spawnSync("pnpm", ["--filter", "web", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, PREVIEW_EXPORT: "1" },
});
if (build.status !== 0) {
  console.error("preview build: next build failed");
  process.exit(build.status ?? 1);
}

writeFileSync(join(out, "robots.txt"), "User-agent: *\nDisallow: /\n");
writeFileSync(join(out, ".nojekyll"), "");

// Files the built site is made of. Anything else stops the build.
const ALLOWED = new Set([
  ".html",
  ".txt",
  ".js",
  ".css",
  ".woff2",
  ".woff",
  ".svg",
  ".png",
  ".ico",
  ".webp",
]);
const HIDDEN_ALLOWED = new Set([".nojekyll"]);

const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(out);

const problems = [];
let removedMaps = 0;
let bytes = 0;
for (const path of files) {
  const name = basename(path);
  const rel = relative(out, path);
  if (name.endsWith(".map")) {
    rmSync(path);
    removedMaps += 1;
    continue;
  }
  bytes += statSync(path).size;
  if (name.startsWith(".")) {
    if (!HIDDEN_ALLOWED.has(name)) problems.push(`hidden file: ${rel}`);
    continue;
  }
  const dot = name.lastIndexOf(".");
  const ext = dot === -1 ? "" : name.slice(dot).toLowerCase();
  if (!ALLOWED.has(ext)) problems.push(`unexpected file type: ${rel}`);
  if (/\.env|\.md$/i.test(name)) problems.push(`env or doc file: ${rel}`);
}

if (problems.length > 0) {
  console.error("preview build: the output holds files that are not part of the site:");
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

const base = process.env.PREVIEW_BASE_PATH?.trim() || "(site root)";
console.log(
  `preview build: ${files.length - removedMaps} files, ${(bytes / 1024).toFixed(0)} KB in apps/web/out, base path ${base}, ${removedMaps} source maps removed`,
);
