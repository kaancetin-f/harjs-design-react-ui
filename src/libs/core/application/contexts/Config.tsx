"use client";

import React, { createContext, useState } from "react";

type ConfigOptions = {
  layout: {
    sider: {
      left: { element: React.ReactNode | null; active: boolean };
      right: { element: React.ReactNode | null; active: boolean };
    };
  };
  perPage: number;
};

const defaultOptions: ConfigOptions = {
  layout: {
    sider: {
      left: { element: null, active: true },
      right: { element: null, active: true },
    },
  },
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
  const [config, setConfig] = useState<ConfigOptions>(defaultOptions);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
};

export { ConfigProvider };
