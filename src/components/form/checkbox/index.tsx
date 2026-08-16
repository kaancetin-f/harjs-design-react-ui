"use client";

import CheckboxBase from "./Checkbox";
import CheckboxCard from "./card";
import CheckboxGroup from "./group";

type CheckboxComponent = typeof CheckboxBase & {
  Card: typeof CheckboxCard;
  Group: typeof CheckboxGroup;
};

const Checkbox = CheckboxBase as CheckboxComponent;
Checkbox.Card = CheckboxCard;
Checkbox.Group = CheckboxGroup;

export default Checkbox;
