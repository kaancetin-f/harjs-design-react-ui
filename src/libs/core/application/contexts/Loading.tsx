"use client";

import React, { createContext, useState } from "react";
import ReactDOM from "react-dom";
import Loading from "../../../../components/feedback/loading";

type LoadingContextProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoadingProviderProps = { children: React.ReactNode };

const LoadingContext = createContext<LoadingContextProps>({ isLoading: false, setIsLoading: () => {} });

const LoadingProvider = ({ children }: LoadingProviderProps) => {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}

      {isLoading && ReactDOM.createPortal(<Loading />, document.body)}
    </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
