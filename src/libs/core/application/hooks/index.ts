"use client";

import { useContext } from "react";
import { ConfigContext } from "../contexts/Config";
import { LoadingContext } from "../contexts/Loading";
import useNotification from "./useNotification";
import useValidation from "./useValidation";

const useLayout = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("useLayout must be used within a LayoutProvider");

  return context;
};
const useLoading = () => useContext(LoadingContext);

export { useLayout, useLoading, useNotification, useValidation };
