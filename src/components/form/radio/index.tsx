"use client";

import RadioBase from "./Radio";
import RadioCard from "./card";
import RadioGroup from "./group";

type RadioComponent = typeof RadioBase & {
  Card: typeof RadioCard;
  Group: typeof RadioGroup;
};

const Radio = RadioBase as RadioComponent;
Radio.Card = RadioCard;
Radio.Group = RadioGroup;

export default Radio;
