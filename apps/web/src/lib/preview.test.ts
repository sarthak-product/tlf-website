import { describe, expect, it } from "vitest";
import { isPreviewExport, previewBasePath, previewRobots } from "./preview";

describe("isPreviewExport", () => {
  it("is on only for PREVIEW_EXPORT=1", () => {
    expect(isPreviewExport({ PREVIEW_EXPORT: "1" })).toBe(true);
    expect(isPreviewExport({ PREVIEW_EXPORT: " 1 " })).toBe(true);
  });

  it("is off when unset or set to anything else", () => {
    expect(isPreviewExport({})).toBe(false);
    expect(isPreviewExport({ PREVIEW_EXPORT: "" })).toBe(false);
    expect(isPreviewExport({ PREVIEW_EXPORT: "0" })).toBe(false);
    expect(isPreviewExport({ PREVIEW_EXPORT: "true" })).toBe(false);
  });
});

describe("previewBasePath", () => {
  it("is empty when unset, empty or only a slash", () => {
    expect(previewBasePath({})).toBe("");
    expect(previewBasePath({ PREVIEW_BASE_PATH: "" })).toBe("");
    expect(previewBasePath({ PREVIEW_BASE_PATH: "/" })).toBe("");
  });

  it("adds the leading slash and drops trailing ones", () => {
    expect(previewBasePath({ PREVIEW_BASE_PATH: "/tlf-website" })).toBe("/tlf-website");
    expect(previewBasePath({ PREVIEW_BASE_PATH: "tlf-website/" })).toBe("/tlf-website");
    expect(previewBasePath({ PREVIEW_BASE_PATH: " /a/b// " })).toBe("/a/b");
  });

  it("refuses values that are not a plain path", () => {
    expect(() => previewBasePath({ PREVIEW_BASE_PATH: "https://example.com/x" })).toThrow();
    expect(() => previewBasePath({ PREVIEW_BASE_PATH: "/a/../b" })).toThrow();
    expect(() => previewBasePath({ PREVIEW_BASE_PATH: "/a b" })).toThrow();
  });
});

describe("previewRobots", () => {
  it("says noindex, nofollow in a preview build", () => {
    expect(previewRobots({ PREVIEW_EXPORT: "1" })).toEqual({ index: false, follow: false });
  });

  it("adds nothing to a normal build", () => {
    expect(previewRobots({})).toBeUndefined();
  });
});
