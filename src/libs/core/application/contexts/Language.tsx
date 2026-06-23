"use client";

import React, { createContext } from "react";

const LanguageContext = createContext<string | undefined>(undefined);

const LanguageProvider = ({ children, language }: { children: React.ReactNode; language: string | undefined }) => {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
};

export { LanguageContext, LanguageProvider };
