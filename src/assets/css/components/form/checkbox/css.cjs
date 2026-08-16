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

const colorUncheckedTemplate = fs.readFileSync("templates/color.unchecked.template.css", "utf-8");
const colorUncheckedWhiteTemplate = fs.readFileSync("templates/color.unchecked.white.template.css", "utf-8");
const colorCheckedTemplate = fs.readFileSync("templates/color.checked.template.css", "utf-8");
const colorCheckedWhiteTemplate = fs.readFileSync("templates/color.checked.white.template.css", "utf-8");
const colorRadioUncheckedTemplate = fs.readFileSync("templates/color.radio-unchecked.template.css", "utf-8");
const colorRadioUncheckedWhiteTemplate = fs.readFileSync("templates/color.radio-unchecked.white.template.css", "utf-8");
const colorRadioCheckedTemplate = fs.readFileSync("templates/color.radio-checked.template.css", "utf-8");
const colorRadioCheckedWhiteTemplate = fs.readFileSync("templates/color.radio-checked.white.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

const renderUnchecked = (color) =>
  color === "white" ? colorUncheckedWhiteTemplate : colorUncheckedTemplate.replace(/__COLOR__/g, color);
const renderChecked = (color) =>
  color === "white" ? colorCheckedWhiteTemplate : colorCheckedTemplate.replace(/__COLOR__/g, color);
const renderRadioUnchecked = (color) =>
  color === "white" ? colorRadioUncheckedWhiteTemplate : colorRadioUncheckedTemplate.replace(/__COLOR__/g, color);
const renderRadioChecked = (color) =>
  color === "white" ? colorRadioCheckedWhiteTemplate : colorRadioCheckedTemplate.replace(/__COLOR__/g, color);

// Checkbox
let colorUncheckedOutput = `.har-checkbox {${colors.map(renderUnchecked).join("\n")}}`;
let colorCheckedOutput = `input[type="checkbox"] {&:checked {+ span {> .har-checkbox {${colors.map(renderChecked).join("\n")}}}}}`;
// Radio
let colorRadioUncheckedOutput = `.har-checkbox {${colors.map(renderRadioUnchecked).join("\n")}}`;
let colorRadioCheckedOutput = `input[type="radio"] {&:checked {+ span {> .har-checkbox {${colors.map(renderRadioChecked).join("\n")}}}}}`;
// ---
let radiusOutput = `.har-checkbox {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-checkbox {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, `size-${size.name}`)
      .replace(/__SIZE_NUMBER__/g, size["w/h"])
      .replace(/__FONT_SIZE__/g, size.fontSize),
  )
  .join("\n")}}`;

// Checkbox
fs.writeFileSync("color.unchecked.css", colorUncheckedOutput);
fs.writeFileSync("color.checked.css", colorCheckedOutput);
// Radio
fs.writeFileSync("color.radio-unchecked.css", colorRadioUncheckedOutput);
fs.writeFileSync("color.radio-checked.css", colorRadioCheckedOutput);
// ---
fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["color.unchecked.css", "color.checked.css", "color.radio-unchecked.css", "color.radio-checked.css", "radius.css", "size.css"]);
