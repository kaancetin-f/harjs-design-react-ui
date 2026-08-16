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
  {
    name: "xs",
    height: "1.5rem",
    fontSize: "0.75rem",
    chipHeight: "1rem",
    chipPadding: "0.35rem",
    chipFontSize: "0.6875rem",
    chipDeleteSize: "0.75rem",
    chipSvgSize: "8px",
  },
  {
    name: "sm",
    height: "1.75rem",
    fontSize: "0.75rem",
    chipHeight: "1.125rem",
    chipPadding: "0.4rem",
    chipFontSize: "0.75rem",
    chipDeleteSize: "0.8rem",
    chipSvgSize: "9px",
  },
  {
    name: "md",
    height: "2rem",
    fontSize: "0.875rem",
    chipHeight: "1.25rem",
    chipPadding: "0.4rem",
    chipFontSize: "0.75rem",
    chipDeleteSize: "0.875rem",
    chipSvgSize: "10px",
  },
  {
    name: "lg",
    height: "2.25rem",
    fontSize: "0.875rem",
    chipHeight: "1.375rem",
    chipPadding: "0.45rem",
    chipFontSize: "0.8125rem",
    chipDeleteSize: "0.9rem",
    chipSvgSize: "11px",
  },
  {
    name: "xl",
    height: "2.5rem",
    fontSize: "1rem",
    chipHeight: "1.5rem",
    chipPadding: "0.5rem",
    chipFontSize: "0.875rem",
    chipDeleteSize: "1rem",
    chipSvgSize: "12px",
  },
  {
    name: "2xl",
    height: "3rem",
    fontSize: "1.125rem",
    chipHeight: "1.75rem",
    chipPadding: "0.55rem",
    chipFontSize: "0.9375rem",
    chipDeleteSize: "1.125rem",
    chipSvgSize: "13px",
  },
];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const colorWhiteTemplate = fs.readFileSync("templates/color.white.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

const renderColor = (color) => (color === "white" ? colorWhiteTemplate : colorTemplate.replace(/__COLOR__/g, color));

let colorOutput = `.har-select { > .wrapper { > .selections {${colors.map(renderColor).join("\n")}}}}`;
let radiusOutput = `.har-select { > .wrapper { > .selections {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}}}`;
let sizeOutput = `.har-select { > .wrapper { > .selections {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, `size-${size.name}`)
      .replace(/__SIZE_NUMBER__/g, size.height)
      .replace(/__FONT_SIZE__/g, size.fontSize)
      .replace(/__CHIP_HEIGHT__/g, size.chipHeight)
      .replace(/__CHIP_PADDING__/g, size.chipPadding)
      .replace(/__CHIP_FONT_SIZE__/g, size.chipFontSize)
      .replace(/__CHIP_DELETE_SIZE__/g, size.chipDeleteSize)
      .replace(/__CHIP_SVG_SIZE__/g, size.chipSvgSize),
  )
  .join("\n")}}}}`;

fs.writeFileSync("color.css", colorOutput);
fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["color.css", "radius.css", "size.css"]);
