const fs = require("fs");
const path = require("path");

const borderTypes = ["sm", "lg", "xl", "xxl", "pill"];
const statuses = [
  "primary",
  "primary-light",
  "secondary",
  "success",
  "warning",
  "danger",
  "information",
  "dark",
  "light",
];
const colors = ["blue", "purple", "pink", "red", "orange", "yellow", "green", "teal", "cyan", "gray", "light"];
const columnsSizes = ["large", "medium", "small", "x-large", "x-small"];
let background = "";
let borderColor = "";
let boxShadow = "";
let fontColor = "";
let focusColor = "";

const WriteCssFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, "");
    fs.appendFileSync(filePath, content);
    console.log("\x1b[32m%s\x1b[0m", `[${path.basename(filePath)}] -> Oluşturuldu.`);
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", `[${path.basename(filePath)}] -> Oluşturulamadı!`);
  }
};

const _Input_BorderCss = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "form", "input", "core", "border.css");

  const content = borderTypes
    .map(
      (borderType) => `/* #region Border Radius -> ${borderType.toUpperCase()} */
.ar-input-wrapper.addon > span.addon-before.border-radius-${borderType} {
  border-radius: var(--border-radius-${borderType}) 0 0 var(--border-radius-${borderType}) !important;
}
.ar-input-wrapper.addon > span.addon-after.border-radius-${borderType} {
  border-radius: 0 var(--border-radius-${borderType}) var(--border-radius-${borderType}) 0 !important;
}

.ar-input-wrapper.addon:has(> .addon-before) > .ar-input > input.border-radius-${borderType} {
  border-radius: 0 var(--border-radius-${borderType}) var(--border-radius-${borderType}) 0 !important;
}
.ar-input-wrapper.addon:has(> .addon-after) > .ar-input > input.border-radius-${borderType},
.ar-input-wrapper:has(> .ar-button) > .ar-input > input.border-radius-${borderType} {
  border-radius: var(--border-radius-${borderType}) 0 0 var(--border-radius-${borderType}) !important;
}
.ar-input-wrapper.addon:has(> .addon-before):has(> .addon-after)
  > .ar-input
  > input.border-radius-${borderType} {
  border-radius: 0 !important;
}
/* #endregion */
/* Border Radius -> ${borderType.toUpperCase()} */`,
    )
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Input_ButtonCss = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "form", "input", "core", "button.css");

  const content = borderTypes
    .map(
      (borderType) => `/* #region Border Radius -> ${borderType.toUpperCase()} */
.ar-input-wrapper > .ar-button.border-radius-${borderType} {
  border-radius: 0 var(--border-radius-${borderType}) var(--border-radius-${borderType}) 0;
}
/* #endregion */
/* Border Radius -> ${borderType.toUpperCase()} */`,
    )
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Input_CheckboxCss = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "form", "checkbox", "core", "border.css");

  const content = colors
    .map((color) => {
      return `/* #region Border Color -> ${color.toUpperCase()} */
.ar-checkbox-wrapper {
  > label {
    > input[type="checkbox"] {
      &:checked {
        + span {
          > .ar-checkbox.filled.${color}::before {
            border-right-color: var(--white);
            border-bottom-color: var(--white);
          }

          > .ar-checkbox.filled.${color} {
            background-color: var(--${color}-500);
            box-shadow: 0 0 0 3.5px var(--${color}-100);
          }
        }
      }
    }
  }
}
/* #endregion */
/* Border Color -> ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Input_RadioCss = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "form", "radio", "core", "border.css");

  const content = colors
    .map((color) => {
      return `/* #region Border Color -> ${color.toUpperCase()} */
.ar-radio-wrapper {
  > label {
    > input[type="radio"] {
      &:checked {
        + span {
          > .ar-radio.filled.${color}::before {
            border-right-color: var(--white);
            border-bottom-color: var(--white);
          }

          > .ar-radio.filled.${color} {
            background-color: var(--${color}-500);
            box-shadow: 0 0 0 3.5px var(--${color}-100);
          }
        }
      }
    }
  }
}
/* #endregion */
/* Border Color -> ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Input_SwitchCss = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "form", "switch", "core", "border.css");

  const content = colors
    .map((color) => {
      return `/* #region Border Color -> ${color.toUpperCase()} */
.ar-switch-wrapper {
  > label {
    > input[type="checkbox"] {
      + span.${color} {
        background-color: var(--${color}-500);
      }

      &.checked {
        + .span.${color} {
          background-color: var(--${color}-500);
        }
      }
    }
  }
}
/* #endregion */
/* Border Color -> ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Variant_FilledCss = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "filled.css");

  const content = colors
    .map((color) => {
      switch (color) {
        case "yellow":
        case "gray":
          fontColor = "black";
          break;
        case "light":
          fontColor = "gray-500";
          break;
        default:
          fontColor = "white";
          break;
      }

      return `/* #region ${color.toUpperCase()} */
.filled:not(.disabled) {
  &.${color} {
    background-color: var(--${color}-500) !important;
    color: var(--${fontColor}) !important;
    
    &.active {
      animation: clicked-${color} ease-in-out 750ms 0s 1 normal both;
    }
  }
}

input.filled:not(.disabled) {
  &.${color} { 
    background-color: var(--${color}-500);

    &:hover {
      background-color: var(--${color}-300);
    }
    &:focus,&.focused {
      background-color: transparent;
      border-color: var(--${color}-300);
      box-shadow: 0 0 0 3.5px var(--${color}-100);
    }
  }
}

button.filled:not(.disabled) {
  &.${color} { 
    background-color: var(--${color}-500);

    &:hover {
      background-color: var(--${color}-300);
    }
  }
}
/* #endregion */
/* ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Variant_SurfaceCss = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "surface.css");

  const content = colors
    .map((color) => {
      return `/* #region ${color.toUpperCase()} */
.surface:not(.disabled) {
  &.${color} {
    background-color: var(--${color}-100);
    border: solid 1px var(--${color}-300);
    color: var(--${color}-500);
    
    &.active {
      animation: clicked-${color} ease-in-out 750ms 0s 1 normal both;
    }
  }
}
      
button.surface:not(.disabled) {
  &.${color} { 
    &:hover {
      background-color: var(--${color}-300);
    }
  }
}
/* #endregion */
/* ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Variant_OutlinedCss = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "outlined.css");

  const content = colors
    .map((color) => {
      switch (color) {
        case "light":
          fontColor = "black";
          borderColor = "gray-400";
          boxShadow = "gray-100";
          break;
        default:
          fontColor = `${color}-500`;
          borderColor = `${color}-300`;
          boxShadow = `${color}-100`;
          break;
      }

      return `/* #region ${color.toUpperCase()} */
.outlined:not(.disabled) {
  &.${color} {
    border: solid 1px var(--${color}-500);
    color: var(--black);

    &.active {
      animation: clicked-${color} ease-in-out 750ms 0s 1 normal both;
    }
  }
}

input.outlined:not(.disabled),
iframe.outlined:not(.disabled),
.ar-select > .selections.outlined:not(.disabled) {
  &.${color} {
    border: solid 1px var(--${color}-500);
    color: var(--${fontColor});

    &:focus,
    &.focused {
      border-color: var(--${borderColor});
      box-shadow: 0 0 0 3.5px var(--${boxShadow});
    }
  }
}

button.outlined:not(.disabled) {
  &.${color} { 
    border-color: var(--${color}-500);
    color: var(--${color}-500);

    &:hover {
      background-color: var(--${color}-100);
    }
  }
}
/* #endregion */
/* ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Variant_DashedCss = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "dashed.css");

  const content = colors
    .map((color) => {
      return `/* #region ${color.toUpperCase()} */
.dashed:not(.disabled) {
  &.${color} {
    border: dashed 1px var(--${color}-500);
    color: var(--${color}-500);

    &.active {
      animation: clicked-${color} ease-in-out 750ms 0s 1 normal both;
    }
  }
}

input.dashed:not(.disabled),
iframe.dashed:not(.disabled) {
  &.${color} {
    &:focus,
    &.focused {
      border-color: var(--${focusColor});
      box-shadow: 0 0 0 3.5px rgba(var(--${focusColor}-rgb), 0.25);
    }
  }
}

button.dashed:not(.disabled) {
  &.${color} { 
    &:hover {
      background-color: var(--${color}-100);
    }
  }
}
/* #endregion */
/* ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Variant_BorderlessCss = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "borderless.css");

  const content = colors
    .map((color) => {
      switch (color) {
        case "light":
          fontColor = "gray-700";
          focusColor = "gray-700";
          break;
        default:
          fontColor = color;
          focusColor = "white";
          break;
      }

      return `/* #region ${color.toUpperCase()} */
.borderless:not(.disabled) {
  &.${color} {
    color: var(--${fontColor}-500);

    &.active {
      animation: clicked-${color} ease-in-out 750ms 0s 1 normal both;
    }
  }
}

input.borderless:not(.disabled),
iframe.borderless:not(.disabled) {
  &.${color} {
    &:focus,
    &.focused {
      border-color: var(--${focusColor});
      box-shadow: 0 0 0 3.5px rgba(var(--${focusColor}-rgb), 0.25);
    }
  }
}

button.borderless:not(.disabled) {
  &.${color} { 
    &:hover {
      background-color: var(--${color}-500);
      color: var(--${focusColor})
    }
  }
}
/* #endregion */
/* ${color.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const AlertStatuses = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "feedback", "alert", "statuses.css");

  const content = statuses
    .map((status) => {
      switch (status) {
        case "primary":
          background = "blue-100";
          borderColor = "blue-300";
          fontColor = "blue-700";
          break;
        case "success":
          background = "green-100";
          borderColor = "green-300";
          fontColor = "green-700";
          break;
        case "warning":
          background = "orange-100";
          borderColor = "orange-300";
          fontColor = "orange-700";
          break;
        case "danger":
          background = "red-100";
          borderColor = "red-300";
          fontColor = "red-700";
          break;
        default:
          break;
      }

      return `/* #region ${status.toUpperCase()} */
.ar-alert {
  &.filled {
    &.${status} {
      background-color: var(--${background});
      color: var(--${fontColor});
    }
  }
  &.surface {
    &.${status} {
      background-color: var(--${background});
      border: solid 1px var(--${borderColor});
      color: var(--${fontColor});
    }
  }
  &.dashed {
    &.${status} {
      border: dashed 1px var(--${borderColor});
      color: var(--${fontColor});
    }
  }
}
/* #endregion */
/* ${status.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const CardStatuses = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "data-display", "card", "statuses.css");

  const content = statuses
    .map((status) => {
      switch (status) {
        case "primary":
          background = "blue";
          fontColor = "white";
          break;
        case "success":
          background = "green";
          fontColor = "white";
          break;
        case "warning":
          background = "orange";
          fontColor = "orange-700";
          break;
        case "danger":
          background = "red";
          fontColor = "white";
          break;
        default:
          background = "light";
          fontColor = "gray-700";
          break;
      }

      return `/* #region ${status.toUpperCase()} */
.ar-card {
  &.filled {
    &.${status} {
      background-color: var(--${background}-400);
      border: solid 1px var(--${background}-500) !important;
      color: var(--${fontColor});

      > .title {
        border-bottom: solid 1px var(--${background}-500) !important;
      }
    }
  }
  &.surface {
    &.${status} {
      background-color: var(--white);
      border: solid 1px var(--${background}-500) !important;
      color: var(--gray-700);

      > .title {
        background-color: var(--${background}-100);
        border-bottom: solid 1px var(--${background}-200) !important;
        color: var(--${background}-500) !important;
      }
    }
  }
  &.outlined {
    &.${status} {
      background-color: transparent;
      border: solid 1px var(--${background}-500);
      color: var(--${background}-500);

      > .title {
        background-color: var(--gray-100);
        border-bottom: solid 1px var(--${background}-100) !important;
      }
    }
  }
}
/* #endregion */
/* ${status.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const ProgressStatuses = () => {
  const file = path.join(__dirname, "../assets", "css", "components", "feedback", "progress", "statuses.css");

  const content = statuses
    .map((status) => {
      switch (status) {
        case "primary":
          background = "blue";
          break;
        case "success":
          background = "green";
          break;
        case "warning":
          background = "orange";
          break;
        case "danger":
          background = "red";
          break;
        default:
          break;
      }

      return `/* #region ${status.toUpperCase()} */
.ar-progress {
  > .ar-progress-bar {
    &.filled {
      &.${status} {
        background-color: var(--${background}-500);
      }
    }
  }

  > .ar-progress-value {
    &.filled {
      &.${status} {
        background-color: var(--${background}-400);
      }
    }
  }
}
/* #endregion */
/* ${status.toUpperCase()} */`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

const _Animation_Css = () => {
  const file = path.join(__dirname, "../assets", "css", "core", "variants", "animation.css");

  const content = colors
    .map(
      (color) => `/* #region Animation -> ${color.toUpperCase()} */
@keyframes clicked-${color} {
  0% {
    box-shadow: 0 0 0 0px var(--${color}-500);
  }
  50% {
    box-shadow: 0 0 0 5px var(--${color}-100);
  }
  100% {
    box-shadow: 0 0 0 7.5px transparent;
  }
}
/* #endregion */
/* Animation -> ${color.toUpperCase()} */`,
    )
    .join("\n\n");

  WriteCssFile(file, content);
};

// Columns
const Columns = () => {
  const file = path.join(
    __dirname,
    "../assets",
    "css",
    "components",
    "data-display",
    "grid-system",
    "column",
    "styles.css",
  );
  const breakpoints = {
    "x-small": { max: 575 },
    small: { min: 576, max: 767 },
    medium: { min: 768, max: 991 },
    large: { min: 992, max: 1199 },
    "x-large": { min: 1200 },
  };
  const prefixMap = {
    "x-small": "xs",
    small: "sm",
    medium: "md",
    large: "lg",
    "x-large": "xl",
  };

  const content = columnsSizes
    .map((size) => {
      const { min, max } = breakpoints[size];
      const prefix = prefixMap[size];
      let query = "";

      if (min && max) query = `@media (${min}px <= width <= ${max}px)`;
      else if (min) query = `@media (width >= ${min}px)`;
      else if (max) query = `@media (width <= ${max}px)`;

      const columns = Array.from({ length: 12 }, (_, i) => {
        const number = i + 1;
        return `
    > .col-${prefix}-${number} {
      flex: 0 0 calc(100% * ${number} / 12);
      max-width: calc(100% * ${number} / 12);
      -webkit-box-flex: 0;
      -ms-flex: 0 0 calc(100% * ${number} / 12);
    }`;
      }).join("");

      return `${query} {
  .row {${columns}}
}`;
    })
    .join("\n\n");

  WriteCssFile(file, content);
};

_Input_BorderCss();
_Input_ButtonCss();
_Input_CheckboxCss();
_Input_RadioCss();
_Input_SwitchCss();

_Variant_FilledCss();
_Variant_SurfaceCss();
_Variant_OutlinedCss();
_Variant_DashedCss();
_Variant_BorderlessCss();

AlertStatuses();
CardStatuses();
ProgressStatuses();

_Animation_Css();

Columns();
