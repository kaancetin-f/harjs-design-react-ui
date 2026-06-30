const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", height: "2rem", fontSize: "0.75rem" },
  { name: "sm", height: "2.25rem", fontSize: "0.875rem" },
  { name: "md", height: "2.5rem", fontSize: "0.875rem" },
  { name: "lg", height: "2.75rem", fontSize: "1rem" },
  { name: "xl", height: "3rem", fontSize: "1rem" },
  { name: "xxl", height: "3.25rem", fontSize: "1.25rem" },
];

const colorTemplate = fs.readFileSync("templates/color.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

let colorOutput = `.har-input-wrapper {${colors.map((color) => colorTemplate.replace(/__COLOR__/g, color)).join("\n")}}`;
let radiusOutput = `.har-input-wrapper {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-input-wrapper {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, size.name)
      .replace(/__SIZE_NUMBER__/g, size.height)
      .replace(/__FONT_SIZE__/g, size.fontSize),
  )
  .join("\n")}}`;

fs.writeFileSync("color.css", colorOutput);
fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

try {
  execSync(`npx prettier --write color.css`, { stdio: "inherit" });
  execSync(`npx prettier --write radius.css`, { stdio: "inherit" });
  execSync(`npx prettier --write size.css`, { stdio: "inherit" });

  execSync("npm run no-css-build", { stdio: "inherit" });
} catch (err) {
  console.error("⚠️ Prettier çalıştırılamadı:", err.message);
}

// const fs = require("fs");
// const path = require("path");
// const { execSync } = require("child_process");

// let colorCSSContent = `.har-input-wrapper {`;
// let borderCSSContent = `.har-input-wrapper {`;
// let sizeCSSContent = `.har-input-wrapper {`;

// const colorFile = path.join(__dirname, "color.css");
// fs.writeFileSync(colorFile, "");
// //-------
// const borderFile = path.join(__dirname, "border.css");
// fs.writeFileSync(borderFile, "");
// //-------
// const sizeFile = path.join(__dirname, "size.css");
// fs.writeFileSync(sizeFile, "");

// const variants = ["filled", "surface-borderless", "outlined", "dashed", "borderless"];
// const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray"];
// const borders = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
// const sizes = [
//   { name: "xs", height: "2rem", fontSize: "0.75rem" },
//   { name: "sm", height: "2.25rem", fontSize: "0.875rem" },
//   { name: "md", height: "2.5rem", fontSize: "0.875rem" },
//   { name: "lg", height: "2.75rem", fontSize: "1rem" },
//   { name: "xl", height: "3rem", fontSize: "1rem" },
//   { name: "xxl", height: "3.25rem", fontSize: "1.25rem" },
// ];

// colors.map((color) => {
//   const styles = {
//     filled: `
//           background-color: var(--${color}-100);
//           border: var(--stroke-1) solid var(--${color}-300);
//           &:focus { border: var(--stroke-1) solid var(--${color}-500); }`,
//     "surface-borderless": `
//           background-color: var(--${color}-100);
//           &:focus { background-color: transparent; box-shadow: 0 0 0 2.5px var(--${color}-200); }`,
//     outlined: `
//           background-color: transparent;
//           border: var(--stroke-1) solid var(--${color}-300);
//           &:focus { box-shadow: 0 0 0 2.5px var(--${color}-200); }`,
//     dashed: `
//           background-color: transparent;
//           border: var(--stroke-1) dashed var(--${color}-300);
//           &:focus { box-shadow: 0 0 0 2.5px var(--${color}-200); }`,
//     borderless: `
//           background-color: transparent;
//           border: var(--stroke-1) solid transparent;`,
//   };

//   colorCSSContent += `&.${color} {`;

//   variants.map((variant) => {
//     colorCSSContent += `&.${variant} {
//                         > .har-input {
//                             > label { color: var(--${color}-500); }
//                             > .input {
//                                 > input {
//                                     ${styles[variant]}
//                                     &::placeholder { color: var(--${color}-400); }
//                                 }
//                             }
//                         }
//                     }
//     `;
//   });

//   colorCSSContent += `}`;
// });

// borders.map((border) => {
//   borderCSSContent += `
//                       &:has(> .addon-before),
//                       &:has(> .addon-after) {
//                         &.radius-${border} {
//                           > .addon-before {
//                             border-top-left-radius: var(--radius-${border});
//                             border-bottom-left-radius: var(--radius-${border});
//                           }

//                           > .addon-after {
//                             border-top-right-radius: var(--radius-${border});
//                             border-bottom-right-radius: var(--radius-${border});
//                           }
//                         }
//                       }

//                       &.radius-${border} {
//                         > .har-input {
//                           > .input {
//                             > input { border-radius: var(--radius-${border}); }
//                           }
//                         }
//                       }
//     `;
// });

// sizes.map((size) => {
//   sizeCSSContent += `&.${size.name} {
//                         > .addon-before,
//                         > .addon-after {
//                           height: ${size.height}; font-size: ${size.fontSize};
//                         }

//                         > .har-input {
//                           > .input {
//                               > input {
//                                   height: ${size.height}; font-size: ${size.fontSize};
//                               }
//                           }
//                         }
//                     }
//     `;
// });

// colorCSSContent += `}`;
// borderCSSContent += `}`;
// sizeCSSContent += `}`;

// fs.appendFileSync(colorFile, colorCSSContent);
// fs.appendFileSync(borderFile, borderCSSContent);
// fs.appendFileSync(sizeFile, sizeCSSContent);

// try {
//   execSync(`npx prettier --write "${colorFile}"`, { stdio: "inherit" });
//   execSync(`npx prettier --write "${borderFile}"`, { stdio: "inherit" });
//   execSync(`npx prettier --write "${sizeFile}"`, { stdio: "inherit" });

//   execSync("npm run no-css-build", { stdio: "inherit" });
// } catch (err) {
//   console.error("⚠️ Prettier çalıştırılamadı:", err.message);
// }
