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

const colors = [
  { name: "blue", scales: [] },
  { name: "purple", scales: [] },
  { name: "pink", scales: [] },
  { name: "red", scales: [] },
  { name: "orange", scales: [] },
  { name: "yellow", scales: [] },
  { name: "green", scales: [] },
  { name: "teal", scales: [] },
  { name: "cyan", scales: [] },
  { name: "gray", scales: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
];
const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];

const statusTemplate = fs.readFileSync("templates/status.template.css", "utf-8");
const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");

let statusOutput = `.har-card {
${colors
  .flatMap((color) => {
    if (color.scales.length === 0) {
      return statusTemplate.replace(/__COLOR__/g, color.name).replace(/__COLOR_SCALE__/g, "500");
    }

    return color.scales.map((scale) =>
      statusTemplate.replace(/__COLOR__/g, `${color.name}-${scale}`).replace(/-__COLOR_SCALE__/g, ""),
    );
  })
  .join("\n")}
}`;
let radiusOutput = `.har-card {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}`;

fs.writeFileSync("status.css", statusOutput);
fs.writeFileSync("radius.css", radiusOutput);

finalizeGeneratedCss(["status.css", "radius.css"]);
