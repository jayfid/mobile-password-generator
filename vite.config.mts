import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vite";

const inlineCssPlugin = (): Plugin => {
  let resolvedConfig: ResolvedConfig;

  return {
    name: "inline-css-into-html",
    apply: "build",
    configResolved(config) {
      resolvedConfig = config;
    },
    closeBundle() {
      const outDir = resolvedConfig.build.outDir;
      const absoluteOutDir = path.resolve(resolvedConfig.root, outDir);
      const htmlFiles = fs
        .readdirSync(absoluteOutDir)
        .filter((fileName: string) => fileName.endsWith(".html"));

      for (const htmlFile of htmlFiles) {
        const htmlPath = path.join(absoluteOutDir, htmlFile);
        let html = fs.readFileSync(htmlPath, "utf8");
        const cssHrefs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(
          (match) => match[1],
        );

        for (const href of cssHrefs) {
          const cssPath = path.join(absoluteOutDir, href.replace(/^\//, ""));

          if (!fs.existsSync(cssPath)) {
            continue;
          }

          const css = fs.readFileSync(cssPath, "utf8");
          html = html.replace(
            new RegExp(
              `<link\\b[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`,
            ),
            `<style>${css}</style>`,
          );
          fs.rmSync(cssPath);
        }

        fs.writeFileSync(htmlPath, html);
      }
    },
  };
};

export default defineConfig({
  plugins: [inlineCssPlugin()],
  server: {
    host: "localhost",
    open: true,
  },
  preview: {
    host: "localhost",
  },
});
