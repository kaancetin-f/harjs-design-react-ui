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
const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const colorWhiteTemplate = fs.readFileSync("templates/color.white.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");

const renderColor = (color) => (color === "white" ? colorWhiteTemplate : colorTemplate.replace(/__COLOR__/g, color));

let colorOutput = `.har-text-editor-wrapper {${colors.map(renderColor).join("\n")}}`;
let radiusOutput = `.har-text-editor-wrapper {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;

fs.writeFileSync("color.css", colorOutput);
fs.writeFileSync("radius.css", radiusOutput);

finalizeGeneratedCss(["color.css", "radius.css"]);
