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

let colorOutput = `.har-button {${colors.map((color) => colorTemplate.replace(/__COLOR__/g, color)).join("\n")}}`;
let radiusOutput = `.har-button {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;
let sizeOutput = `.har-button {${sizes
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
