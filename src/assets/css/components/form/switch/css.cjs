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
const sizes = [
  { name: "xs", "w/h": "1rem", fontSize: "0.75rem" },
  { name: "sm", "w/h": "1.25rem", fontSize: "1rem" },
  { name: "md", "w/h": "1.5rem", fontSize: "1.25rem" },
];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const colorWhiteTemplate = fs.readFileSync("templates/color.white.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

const renderColor = (color) => (color === "white" ? colorWhiteTemplate : colorTemplate.replace(/__COLOR__/g, color));

let colorOutput = `.har-switch {${colors.map(renderColor).join("\n")}}`;
let radiusOutput = `.har-switch, .har-switch > .handle {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-switch {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, `size-${size.name}`)
      .replace(/__SIZE_NUMBER__/g, size["w/h"])
      .replace(/__FONT_SIZE__/g, size.fontSize),
  )
  .join("\n")}}`;

fs.writeFileSync("color.css", colorOutput);
fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["color.css", "radius.css", "size.css"]);
