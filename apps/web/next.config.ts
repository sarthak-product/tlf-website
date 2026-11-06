import type { NextConfig } from "next";
import { isPreviewExport, previewBasePath } from "./src/lib/preview";

// The public preview (scope feature 5b) is a static export served from a sub folder.
// It turns on only with PREVIEW_EXPORT=1, so a normal build keeps the server output.
const preview: NextConfig = isPreviewExport()
  ? {
      output: "export",
      basePath: previewBasePath(),
      trailingSlash: true,
      productionBrowserSourceMaps: false,
    }
  : {};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  ...preview,
};

export default nextConfig;
