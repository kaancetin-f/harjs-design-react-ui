"use client";

import React, { ReactElement, useEffect, useState } from "react";
import "../../../assets/css/components/form/button-group/styles.css";
import Button from "../button";
import Alert from "../../feedback/alert";

const ButtonGroup: React.FC<{
  children: ReactElement<typeof Button> | ReactElement<typeof Button>[];
}> = ({ children }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Çocuk elemanların sadece `Button` bileşenleri olduğundan emin olun
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Button) {
          throw new Error("ButtonGroup can only have Button elements as children.");
        }
      });

      // Hata yoksa, error'u temizle
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        // Hata varsa error state'e yaz
        setError(err.message);
        console.error(err.message);
      }
    }
  }, [children]); // children değişirse kontrolü tekrar yap

  return <div className="ar-button-group">{error ? <Alert status="danger" message={error} /> : children}</div>;
};

ButtonGroup.displayName = "ButtonGroup";
export default ButtonGroup;
