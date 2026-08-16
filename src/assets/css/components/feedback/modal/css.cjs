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

const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40", "full"];
const sizes = [
  { name: "xs", height: "var(--space-320)" },
  { name: "sm", height: "384px" },
  { name: "md", height: "512px" },
  { name: "lg", height: "640px" },
  { name: "xl", height: "896px" },
  { name: "2xl", height: "1200px" },
];

const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

let radiusOutput = `.har-modal-wrapper { > .har-modal {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}}`;
let sizeOutput = `.har-modal-wrapper { > .har-modal {${sizes
  .map((size) =>
    sizeTemplate.replace(/__SIZE__/g, `size-${size.name}`).replace(/__SIZE_NUMBER__/g, size.height),
  )
  .join("\n")}}}`;

fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["radius.css", "size.css"]);
