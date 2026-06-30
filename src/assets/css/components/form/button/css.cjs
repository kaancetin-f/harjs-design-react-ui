const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

let colorCSSContent = `.har-button {`;
let borderCSSContent = `.har-button {`;
let sizeCSSContent = `.har-button {`;

const colorFile = path.join(__dirname, "color.css");
fs.writeFileSync(colorFile, "");
//-------
const borderFile = path.join(__dirname, "border.css");
fs.writeFileSync(borderFile, "");
//-------
const sizeFile = path.join(__dirname, "size.css");
fs.writeFileSync(sizeFile, "");

const variants = ["filled", "surface", "surface-borderless", "outlined", "dashed", "borderless"];
const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
const borders = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", height: "2rem", fontSize: "0.75rem" },
  { name: "sm", height: "2.25rem", fontSize: "0.875rem" },
  { name: "md", height: "2.5rem", fontSize: "0.875rem" },
  { name: "lg", height: "2.75rem", fontSize: "1rem" },
  { name: "xl", height: "3rem", fontSize: "1rem" },
  { name: "xxl", height: "3.25rem", fontSize: "1.25rem" },
];

colors.map((color) => {
  const styles = {
    filled: `
      border: solid var(--stroke-1) var(--${color}-500);

      &:hover { background-color: var(--${color}-400); border: solid var(--stroke-1) var(--${color}-400); }
      &:active { background-color: var(--${color}-600); border: solid var(--stroke-1) var(--${color}-600); }`,
    surface: `
      background-color: var(--${color}-100);
      border: solid var(--stroke-1) var(--${color}-200);
      color: var(--${color}-700);

      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    "surface-borderless": `
      background-color: var(--${color}-100);
      border: solid var(--stroke-1) transparent;
      color: var(--${color}-700);

      &:hover { background-color: var(--${color}-200); }
      &:active { background-color: var(--${color}-300); border: solid var(--stroke-1) var(--${color}-300); }`,
    outlined: `
      background-color: transparent;
      border: solid var(--stroke-1) var(--${color}-500);
      color: var(--${color}-700);

      &:hover { background-color: var(--${color}-100); }
      &:active { background-color: var(--${color}-200); }`,
    dashed: `
      background-color: transparent;
      border: dashed var(--stroke-1) var(--${color}-500);
      color: var(--${color}-700);

      &:hover { border: dashed var(--stroke-1) var(--${color}-300); color: var(--${color}-300); }
      &:active { border: dashed var(--stroke-1) var(--${color}-500); color: var(--${color}-700); }`,
    borderless: `
      background-color: transparent;
      border: solid var(--stroke-1) transparent;
      color: var(--${color}-700);

      &:hover { color: var(--${color}-300); }
      &:active { color: var(--${color}-700); }`,
  };

  colorCSSContent += `&.${color} {`;

  variants.map((variant) => {
    colorCSSContent += `&.${variant} {
      background-color: var(--${color}-500);
      color: var(--white-pure);

      ${styles[variant]}
    }`;
  });

  colorCSSContent += `}`;
});

borders.map((border) => {
  borderCSSContent += `&.radius-${border} { border-radius: var(--radius-${border}); }`;
});

sizeCSSContent += `
                --btn-size: var(--input-height);
                
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: var(--btn-size);
                box-sizing: border-box;
`;

sizes.map((size) => {
  sizeCSSContent += `
                    &.${size.name} {
                      --btn-size: ${size.height};
                      font-size: ${size.fontSize};

                      &.shape { width: var(--btn-size); aspect-ratio: 1; padding: 0; }
                    }
  `;
});

colorCSSContent += `}`;
borderCSSContent += `}`;
sizeCSSContent += `}`;

fs.appendFileSync(colorFile, colorCSSContent);
fs.appendFileSync(borderFile, borderCSSContent);
fs.appendFileSync(sizeFile, sizeCSSContent);

try {
  execSync(`npx prettier --write "${colorFile}"`, { stdio: "inherit" });
  execSync(`npx prettier --write "${borderFile}"`, { stdio: "inherit" });
  execSync(`npx prettier --write "${sizeFile}"`, { stdio: "inherit" });

  execSync("npm run no-css-build", { stdio: "inherit" });
} catch (err) {
  console.error("⚠️ Prettier çalıştırılamadı:", err.message);
}
