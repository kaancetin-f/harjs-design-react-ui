const { execSync } = require("child_process");

const finalizeGeneratedCss = (files) => {
  try {
    for (const file of files) {
      execSync(`npx prettier --write ${file}`, { stdio: "inherit" });
    }

    execSync("npm run no-css-build", { stdio: "inherit" });
  } catch (err) {
    console.error("[css.cjs] formatting/build failed:", err.message);
  }
};

module.exports = {
  finalizeGeneratedCss,
};
