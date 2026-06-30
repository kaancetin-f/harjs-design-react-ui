const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let checkboxColorCSSContent = `.har-checkbox-wrapper {`;
let checkboxCheckedColorCSSContent = `.har-checkbox-wrapper {`;
let radioColorCSSContent = `.har-checkbox-wrapper {`;
let borderCSSContent = `.har-checkbox {`;
let sizeCSSContent = `.har-checkbox {`;

const checkboxColorFile = path.join(__dirname, "checkbox-color.css");
fs.writeFileSync(checkboxColorFile, "");
const checkboxCheckedColorFile = path.join(__dirname, "checkbox-checked-color.css");
fs.writeFileSync(checkboxCheckedColorFile, "");
const radioColorFile = path.join(__dirname, "radio-color.css");
fs.writeFileSync(radioColorFile, "");
//-------
const borderFile = path.join(__dirname, "border.css");
fs.writeFileSync(borderFile, "");
//-------
const sizeFile = path.join(__dirname, "size.css");
fs.writeFileSync(sizeFile, "");

const variants = ["filled", "surface", "surface-borderless", "outlined", "dashed"];
const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
const borders = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", "box-w": "1rem", fontSize: "0.75rem" },
  { name: "sm", "box-w": "1.25rem", fontSize: "0.875rem" },
  { name: "md", "box-w": "1.5rem", fontSize: "0.875rem" },
];

checkboxColorCSSContent += `
> label {
  > input[type="checkbox"] { 
    + span {
      > .har-checkbox { background-color: transparent;
`;

checkboxCheckedColorCSSContent += `
> label {
  > input[type="checkbox"] { 
    &:checked {  
      + span {
          > .har-checkbox {`;

colors.map((color) => {
  const styles = {
    filled: `
      border: solid var(--stroke-1) var(--${color}-500);

      &:hover { background-color: var(--${color}-400); border: solid var(--stroke-1) var(--${color}-400); }
      &:active { background-color: var(--${color}-600); border: solid var(--stroke-1) var(--${color}-600); }`,
    surface: `
      border: solid var(--stroke-1) var(--${color}-200); color: var(--${color}-700);

      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    "surface-borderless": `
      background-color: var(--${color}-100); border: solid var(--stroke-1) transparent; color: var(--${color}-700);

      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    outlined: `
      border: solid var(--stroke-1) var(--${color}-500); color: var(--${color}-700);

      &:hover { background-color: var(--${color}-100); }
      &:active { background-color: var(--${color}-200); }`,
    dashed: `
      border: dashed var(--stroke-1) var(--${color}-500); color: var(--${color}-700);

      &:hover { border: dashed var(--stroke-1) var(--${color}-300); color: var(--${color}-300); }
      &:active { border: dashed var(--stroke-1) var(--${color}-500); color: var(--${color}-700); }`,
  };

  checkboxColorCSSContent += `&.${color} {`;

  variants.map((variant) => {
    checkboxColorCSSContent += `&.${variant} { ${styles[variant]} }`;
  });

  checkboxColorCSSContent += `}`;
});

colors.map((color) => {
  const styles = {
    filled: `
      background-color: var(--${color}-500); border: solid var(--stroke-1) var(--${color}-500);

      &::before { border-right-color: var(--white-pure); border-bottom-color: var(--white-pure); }
      &:hover { background-color: var(--${color}-400); border: solid var(--stroke-1) var(--${color}-400); }
      &:active { background-color: var(--${color}-600); border: solid var(--stroke-1) var(--${color}-600); }`,
    surface: `
      background-color: var(--${color}-100);
      border: solid var(--stroke-1) var(--${color}-200); color: var(--${color}-700);

      &::before { border-right-color: var(--${color}-700); border-bottom-color: var(--${color}-700); }
      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    "surface-borderless": `
      background-color: var(--${color}-100); border: solid var(--stroke-1) transparent; color: var(--${color}-700);

      &::before { border-right-color: var(--${color}-700); border-bottom-color: var(--${color}-700); }
      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    outlined: `
      background-color: transparent; border: solid var(--stroke-1) var(--${color}-500); color: var(--${color}-700);

      &::before { border-right-color: var(--${color}-700); border-bottom-color: var(--${color}-700); }
      &:hover { background-color: var(--${color}-100); }
      &:active { background-color: var(--${color}-200); }`,
    dashed: `
      background-color: transparent; border: dashed var(--stroke-1) var(--${color}-500); color: var(--${color}-700);

      &::before { border-right-color: var(--${color}-700); border-bottom-color: var(--${color}-700); }
      &:hover { border: dashed var(--stroke-1) var(--${color}-300); color: var(--${color}-300); }
      &:active { border: dashed var(--stroke-1) var(--${color}-500); color: var(--${color}-700); }`,
  };

  checkboxCheckedColorCSSContent += `&.${color} {`;

  variants.map((variant) => {
    checkboxCheckedColorCSSContent += `&.${variant} { ${styles[variant]} }`;
  });

  checkboxCheckedColorCSSContent += `}`;
});

checkboxColorCSSContent += `} } } }`;
checkboxCheckedColorCSSContent += `} } } } }`;

borders.map((border) => {
  borderCSSContent += `&.radius-${border} { border-radius: var(--radius-${border}); }`;
});

sizes.map((size) => {
  sizeCSSContent += `&.${size.name} { width: ${size["box-w"]}; height: ${size["box-w"]}; }
  `;
});

checkboxColorCSSContent += `}`;
checkboxCheckedColorCSSContent += `}`;
borderCSSContent += `}`;
sizeCSSContent += `}`;

fs.appendFileSync(checkboxColorFile, checkboxColorCSSContent);
fs.appendFileSync(checkboxCheckedColorFile, checkboxCheckedColorCSSContent);
// fs.appendFileSync(radioColorFile, radioColorCSSContent);
fs.appendFileSync(borderFile, borderCSSContent);
fs.appendFileSync(sizeFile, sizeCSSContent);

try {
  execSync(`npx prettier --write "${checkboxColorFile}"`, { stdio: "inherit" });
  execSync(`npx prettier --write "${checkboxCheckedColorFile}"`, { stdio: "inherit" });
  // execSync(`npx prettier --write "${radioColorFile}"`, { stdio: "inherit" });
  execSync(`npx prettier --write "${borderFile}"`, { stdio: "inherit" });
  execSync(`npx prettier --write "${sizeFile}"`, { stdio: "inherit" });

  execSync("npm run no-css-build", { stdio: "inherit" });
} catch (err) {
  console.error("⚠️ Prettier çalıştırılamadı:", err.message);
}
