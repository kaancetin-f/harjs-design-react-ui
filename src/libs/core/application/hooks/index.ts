"use client";

import { useContext } from "react";
import { ConfigContext } from "../contexts/Config";
import { LanguageContext } from "../contexts/Language";
import { LoadingContext } from "../contexts/Loading";
import useNotification from "./useNotification";
import useValidation from "./useValidation";
import useTranslation from "./useTranslation";

const useLayout = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("useLayout must be used within a LayoutProvider");

  return context;
};
const useLoading = () => useContext(LoadingContext);
const useLanguage = () => useContext(LanguageContext);

export { useLayout, useLoading, useLanguage, useTranslation, useNotification, useValidation };
