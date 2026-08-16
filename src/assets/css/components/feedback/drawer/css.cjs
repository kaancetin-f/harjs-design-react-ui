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

const radiuses = ["0", "2", "4", "6", "8", "12", "16", "20", "40"];
const sizes = [
  { name: "xs", width: "320px" },
  { name: "sm", width: "384px" },
  { name: "md", width: "512px" },
  { name: "lg", width: "640px" },
  { name: "xl", width: "896px" },
  { name: "2xl", width: "1200px" },
  { name: "3xl", width: "80%" },
  { name: "4xl", width: "85%" },
  { name: "5xl", width: "90%" },
  { name: "6xl", width: "95%" },
  { name: "full", width: "100%" },
];

const radiusTemplate = fs.readFileSync("templates/radius.template.css", "utf-8");
const sizeTemplate = fs.readFileSync("templates/size.template.css", "utf-8");

let radiusOutput = `.har-drawer-wrapper { > .har-drawer {${radiuses.map((radius) => radiusTemplate.replace(/__RADIUS__/g, radius)).join("\n")}}}`;
let sizeOutput = `.har-drawer-wrapper { > .har-drawer {${sizes
  .map((size) =>
    sizeTemplate
      .replace(/__SIZE__/g, `size-${size.name}`)
      .replace(/__SIZE_NUMBER__/g, size.width)
      .replace(/__FONT_SIZE__/g, size.fontSize),
  )
  .join("\n")}}}`;

fs.writeFileSync("radius.css", radiusOutput);
fs.writeFileSync("size.css", sizeOutput);

finalizeGeneratedCss(["radius.css", "size.css"]);
