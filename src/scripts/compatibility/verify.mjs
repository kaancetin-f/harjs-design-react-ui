import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const temporaryRoot = join(repositoryRoot, ".compat-tmp");

const commonApp = `
import { Button } from "@harjs/react-ui";

export default function App() {
  return <Button color="blue">Compatibility smoke test</Button>;
}
`;

const fixtures = {
  "next-pages": {
    package: {
      scripts: { build: "next build --webpack" },
      dependencies: {
        next: "16.3.1",
        react: "19.2.0",
        "react-dom": "19.2.0",
      },
    },
    files: {
      "pages/_app.jsx": `
import "@harjs/react-ui/styles.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
`,
      "pages/index.jsx": commonApp,
    },
  },
  vite: {
    package: {
      scripts: { build: "vite build" },
      dependencies: {
        "@vitejs/plugin-react": "4.4.1",
        vite: "6.1.0",
        react: "18.3.1",
        "react-dom": "18.3.1",
      },
      devDependencies: {},
    },
    files: {
      "index.html": '<div id="root"></div><script type="module" src="/src.jsx"></script>',
      "src.jsx": `
import React from "react";
import { createRoot } from "react-dom/client";
import "@harjs/react-ui/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
`,
      "App.jsx": commonApp,
      "vite.config.js": `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({ plugins: [react()] });
`,
    },
  },
  cra5: {
    package: {
      scripts: { build: "react-scripts build" },
      dependencies: {
        ajv: "8.17.1",
        react: "18.3.1",
        "react-dom": "18.3.1",
        "react-scripts": "5.0.1",
      },
    },
    files: {
      "public/index.html": '<div id="root"></div>',
      "src/index.js": `
import React from "react";
import { createRoot } from "react-dom/client";
import "@harjs/react-ui/styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
`,
      "src/App.js": commonApp,
    },
  },
  remix: {
    package: {
      type: "module",
      scripts: { build: "remix vite:build" },
      dependencies: {
        "@remix-run/dev": "2.17.5",
        "@remix-run/node": "2.17.5",
        "@remix-run/react": "2.17.5",
        react: "18.3.1",
        "react-dom": "18.3.1",
        vite: "6.1.0",
      },
    },
    files: {
      "app/root.jsx": `
import { Button } from "@harjs/react-ui";
import "@harjs/react-ui/styles.css";

export default function App() {
  return (
    <html lang="en">
      <body>
        <Button color="blue">Compatibility smoke test</Button>
      </body>
    </html>
  );
}
`,
      "vite.config.js": `
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [remix()] });
`,
    },
  },
  blitz: {
    package: {
      scripts: { build: "blitz build" },
      dependencies: {
        "@blitzjs/next": "3.0.2",
        blitz: "3.0.2",
        next: "15.5.9",
        react: "19.2.0",
        "react-dom": "19.2.0",
        tslog: "4.9.0",
      },
    },
    files: {
      "blitz.config.js": `
const { withBlitz } = require("@blitzjs/next");

module.exports = withBlitz({});
`,
      "pages/_app.jsx": `
import "@harjs/react-ui/styles.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
`,
      "pages/index.jsx": commonApp,
    },
  },
};

function run(command, args, cwd = repositoryRoot, capture = false) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
}

function writeFixture(name, fixture, packageTarball) {
  const fixtureRoot = join(temporaryRoot, name);
  const packageJson = {
    name: `compat-${name}`,
    private: true,
    ...fixture.package,
    dependencies: {
      ...fixture.package.dependencies,
      "@harjs/react-ui": `file:${packageTarball}`,
    },
  };

  mkdirSync(fixtureRoot, { recursive: true });
  writeFileSync(join(fixtureRoot, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);

  for (const [path, content] of Object.entries(fixture.files)) {
    const outputPath = join(fixtureRoot, path);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content.trimStart());
  }

  return fixtureRoot;
}

const requested = process.argv.slice(2);
const targets = requested.length > 0 ? requested : Object.keys(fixtures);
const unknown = targets.filter((target) => !fixtures[target]);

if (unknown.length > 0) {
  throw new Error(`Unknown compatibility target(s): ${unknown.join(", ")}`);
}

rmSync(temporaryRoot, { recursive: true, force: true });
mkdirSync(temporaryRoot, { recursive: true });

try {
  run("npm", ["run", "build"]);
  const packResult = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", temporaryRoot], repositoryRoot, true),
  );
  const packageTarball = join(temporaryRoot, packResult[0].filename);

  for (const target of targets) {
    const fixtureRoot = writeFixture(target, fixtures[target], packageTarball);
    console.log(`\nVerifying ${target}...`);
    run("npm", ["install", "--no-package-lock", "--legacy-peer-deps"], fixtureRoot);
    run("npm", ["run", "build"], fixtureRoot);
  }

  console.log(`\nVerified: ${targets.join(", ")}`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
