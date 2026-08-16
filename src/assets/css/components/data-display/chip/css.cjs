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

const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", height: "1.5rem", fontSize: "0.75rem", padding: "0.375rem", inset: "2px" },
  { name: "sm", height: "1.75rem", fontSize: "0.75rem", padding: "0.5rem", inset: "2px" },
  { name: "md", height: "2rem", fontSize: "0.875rem", padding: "0.5rem", inset: "3px" },
  { name: "lg", height: "2.25rem", fontSize: "0.875rem", padding: "0.625rem", inset: "3px" },
  { name: "xl", height: "2.5rem", fontSize: "1rem", padding: "0.75rem", inset: "3px" },
  { name: "2xl", height: "3rem", fontSize: "1.125rem", padding: "0.875rem", inset: "4px" },
];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

let colorOutput = `.har-chip {${colors.map((color) => colorTemplate.replace(/__COLOR__/g, color)).join("\n")}}`;
let radiusOutput = `.har-chip {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-chip {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, `size-${size.name}`)
      .replace(/__SIZE_NUMBER__/g, size.height)
      .replace(/__FONT_SIZE__/g, size.fontSize)
      .replace(/__PAD__/g, size.padding)
      .replace(/__INSET__/g, size.inset),
  )
  .join("\n")}}`;

fs.writeFileSync("color.css", colorOutput);
fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["color.css", "radius.css", "size.css"]);
