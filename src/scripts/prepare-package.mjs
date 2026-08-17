import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const distRoot = resolve(repositoryRoot, "dist");
const cssImports = new Set();
const cssImportPattern = /^import\s+["']([^"']+\.css)["'];?\r?\n?/gm;
const relativeImportPattern = /((?:from|import)\s*["'])(\.[^"']+)(["'])/g;

function getJavaScriptFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return getJavaScriptFiles(path);
    }

    return entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
  });
}

for (const file of getJavaScriptFiles(distRoot)) {
  const source = readFileSync(file, "utf8");
  const output = source
    .replace(cssImportPattern, (_, importPath) => {
      cssImports.add(relative(distRoot, resolve(dirname(file), importPath)).replaceAll("\\", "/"));
      return "";
    })
    .replace(relativeImportPattern, (match, prefix, importPath, suffix) => {
      if (extname(importPath)) {
        return match;
      }

      const resolvedImport = resolve(dirname(file), importPath);

      if (existsSync(`${resolvedImport}.js`)) {
        return `${prefix}${importPath}.js${suffix}`;
      }

      if (existsSync(resolve(resolvedImport, "index.js"))) {
        return `${prefix}${importPath}/index.js${suffix}`;
      }

      return match;
    });

  if (output !== source) {
    writeFileSync(file, output);
  }
}

const orderedImports = [...cssImports].sort((left, right) => {
  const leftIsCore = left.endsWith("/core/har-core.css");
  const rightIsCore = right.endsWith("/core/har-core.css");

  if (leftIsCore !== rightIsCore) {
    return leftIsCore ? -1 : 1;
  }

  return left.localeCompare(right);
});

writeFileSync(
  resolve(distRoot, "styles.css"),
  `${orderedImports.map((path) => `@import "./${path}";`).join("\n")}\n`,
);
