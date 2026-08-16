"use client";

import ButtonBase from "./Button";
import ButtonGroup from "./group";
import ButtonAction from "./action";
import ButtonSplit from "./split";

type ButtonComponent = typeof ButtonBase & {
  Group: typeof ButtonGroup;
  Action: typeof ButtonAction;
  Split: typeof ButtonSplit;
};

const Button = ButtonBase as ButtonComponent;
Button.Group = ButtonGroup;
Button.Action = ButtonAction;
Button.Split = ButtonSplit;

export default Button;
