const fs = require("fs");
const path = require("path");

const resolveSharedScript = () => {
  let current = __dirname;

  while (true) {
    const candidate = path.join(current, "src", "scripts", "css-cjs-shared.cjs");
    if (fs.existsSync(candidate)) return candidate;

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new Error("css-cjs-shared.cjs bulunamadı");
};

const { finalizeGeneratedCss } = require(resolveSharedScript());

const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray", "white"];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const colorWhiteTemplate = fs.readFileSync("templates/color.white.template.css", "utf-8");

const renderColor = (color) => (color === "white" ? colorWhiteTemplate : colorTemplate.replace(/__COLOR__/g, color));

let colorOutput = `.har-upload {${colors.map(renderColor).join("\n")}}`;

fs.writeFileSync("color.css", colorOutput);

finalizeGeneratedCss(["color.css"]);
