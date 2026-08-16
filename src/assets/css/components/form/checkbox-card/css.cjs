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
// const sizes = [
//   { name: "xs", "w/h": "1rem", fontSize: "0.75rem" },
//   { name: "sm", "w/h": "1.25rem", fontSize: "1rem" },
//   { name: "md", "w/h": "1.5rem", fontSize: "1.25rem" },
// ];

const colorUncheckedTemplate = fs.readFileSync("templates/color.unchecked.template.css", "utf-8");
const colorUncheckedWhiteTemplate = fs.readFileSync("templates/color.unchecked.white.template.css", "utf-8");
const colorCheckedTemplate = fs.readFileSync("templates/color.checked.template.css", "utf-8");
const colorCheckedWhiteTemplate = fs.readFileSync("templates/color.checked.white.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
// const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

const renderUnchecked = (color) =>
  color === "white" ? colorUncheckedWhiteTemplate : colorUncheckedTemplate.replace(/__COLOR__/g, color);
const renderChecked = (color) =>
  color === "white" ? colorCheckedWhiteTemplate : colorCheckedTemplate.replace(/__COLOR__/g, color);

let colorUncheckedOutput = `.har-checkbox-card-wrapper { > .har-checkbox-card {${colors.map(renderUnchecked).join("\n")}}}`;
let colorCheckedOutput = `.har-checkbox-card-wrapper { > .har-checkbox-card { &.checked {${colors.map(renderChecked).join("\n")}}}}`;
let radiusOutput = `.har-checkbox-card-wrapper { > .har-checkbox-card {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}}`;
// let sizeOutput = `.har-checkbox {${sizes
//   .map((size) =>
//     sizeTemplate
//       .replace(/__SIZE__/g, size.name)
//       .replace(/__SIZE_NUMBER__/g, size["w/h"])
//       .replace(/__FONT_SIZE__/g, size.fontSize),
//   )
//   .join("\n")}}`;

fs.writeFileSync("color.unchecked.css", colorUncheckedOutput);
fs.writeFileSync("color.checked.css", colorCheckedOutput);
fs.writeFileSync("radius.css", radiusOutput);
// fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["color.unchecked.css", "color.checked.css", "radius.css"]);
