"use client";

import React, { createContext, useState } from "react";

type ConfigOptions = {
  perPage: number;
};

const defaultOptions: ConfigOptions = {
  perPage: 5,
};

type ConfigContextProps = {
  config: ConfigOptions;
  setConfig: React.Dispatch<React.SetStateAction<ConfigOptions>>;
};

type ConfigProviderProps = { children: React.ReactNode };

export const ConfigContext = createContext<ConfigContextProps>({
  config: defaultOptions,
  setConfig: () => {},
});

const ConfigProvider = ({ children }: ConfigProviderProps) => {
  // states
  const [config, setConfig] = useState<ConfigOptions>(defaultOptions);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
};

export { ConfigProvider };
