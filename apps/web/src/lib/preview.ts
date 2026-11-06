// The public preview build (scope feature 5b). It is switched on by environment variables
// only, so a normal `pnpm build` is unchanged:
//   PREVIEW_EXPORT=1     static export to apps/web/out, trailing slashes, noindex everywhere
//   PREVIEW_BASE_PATH    the folder the site is served from, for example /tlf-website
// `pnpm preview:build` (scripts/preview-build.mjs) sets PREVIEW_EXPORT for you.
// next.config.ts and the root layout both read these helpers, so the two never disagree.

type Env = Record<string, string | undefined>;

// True only for the exact value "1", so a stray "0" or "false" never turns it on.
export function isPreviewExport(env: Env = process.env): boolean {
  return env.PREVIEW_EXPORT?.trim() === "1";
}

// Next.js wants a base path that starts with a slash and does not end with one, or an
// empty string for the site root. This accepts "tlf-website", "/tlf-website/" and the
// like, and refuses anything that is not a plain path, so a typo fails the build loudly.
export function previewBasePath(env: Env = process.env): string {
  const raw = env.PREVIEW_BASE_PATH?.trim() ?? "";
  const parts = raw.split("/").filter((part) => part.length > 0);
  if (parts.length === 0) return "";
  for (const part of parts) {
    if (!/^[A-Za-z0-9._~-]+$/.test(part) || part === "." || part === "..") {
      throw new Error(`PREVIEW_BASE_PATH must be a plain path such as /tlf-website. Got "${raw}".`);
    }
  }
  return `/${parts.join("/")}`;
}

// The robots rule for the page metadata. The preview tells every crawler to stay out.
// A normal build adds nothing, so its HTML is unchanged.
export function previewRobots(env: Env = process.env): { index: false; follow: false } | undefined {
  return isPreviewExport(env) ? { index: false, follow: false } : undefined;
}
