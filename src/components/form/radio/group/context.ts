"use client";

import { createContext, useContext } from "react";

type RadioGroupContextValue = {
  name?: string;
};

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);
