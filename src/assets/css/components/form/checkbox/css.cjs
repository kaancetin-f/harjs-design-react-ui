const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", "w/h": "1rem", fontSize: "0.75rem" },
  { name: "sm", "w/h": "1.25rem", fontSize: "1rem" },
  { name: "md", "w/h": "1.5rem", fontSize: "1.25rem" },
];

const colorUncheckedTemplate = fs.readFileSync("templates/color.unchecked.template.css", "utf-8");
const colorCheckedTemplate = fs.readFileSync("templates/color.checked.template.css", "utf-8");
const colorRadioUncheckedTemplate = fs.readFileSync("templates/color.radio-unchecked.template.css", "utf-8");
const colorRadioCheckedTemplate = fs.readFileSync("templates/color.radio-checked.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

// Checkbox
let colorUncheckedOutput = `.har-checkbox-wrapper {> label {> input[type="checkbox"] {+ span {> .har-checkbox {${colors.map((color) => colorUncheckedTemplate.replace(/__COLOR__/g, color)).join("\n")}}}}}}`;
let colorCheckedOutput = `.har-checkbox-wrapper {> label {> input[type="checkbox"] {&:checked {+ span {> .har-checkbox {${colors.map((color) => colorCheckedTemplate.replace(/__COLOR__/g, color)).join("\n")}}}}}}}`;
// Radio
let colorRadioUncheckedOutput = `.har-checkbox-wrapper {> label {> input[type="radio"] {+ span {> .har-checkbox {${colors.map((color) => colorRadioUncheckedTemplate.replace(/__COLOR__/g, color)).join("\n")}}}}}}`;
let colorRadioCheckedOutput = `.har-checkbox-wrapper {> label {> input[type="radio"] {&:checked {+ span {> .har-checkbox {${colors.map((color) => colorRadioCheckedTemplate.replace(/__COLOR__/g, color)).join("\n")}}}}}}}`;
// ---
let radiusOutput = `.har-checkbox {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-checkbox {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, size.name)
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

try {
  // Checkbox
  execSync(`npx prettier --write color.unchecked.css`, { stdio: "inherit" });
  execSync(`npx prettier --write color.checked.css`, { stdio: "inherit" });
  // Radio
  execSync(`npx prettier --write color.radio-unchecked.css`, { stdio: "inherit" });
  execSync(`npx prettier --write color.radio-checked.css`, { stdio: "inherit" });
  // ---
  execSync(`npx prettier --write radius.css`, { stdio: "inherit" });
  execSync(`npx prettier --write size.css`, { stdio: "inherit" });

  execSync("npm run no-css-build", { stdio: "inherit" });
} catch (err) {
  console.error("⚠️ Prettier çalıştırılamadı:", err.message);
}
