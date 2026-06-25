"use client";

import React, { ComponentProps, ReactElement, useEffect, useState } from "react";
import "../../../assets/css/components/form/button-group/styles.css";
import Button from "../button";
import Alert from "../../feedback/alert";

const ButtonGroup: React.FC<
  {
    children: ReactElement<typeof Button> | ReactElement<typeof Button>[];
  } & Omit<ComponentProps<typeof Button>, "children">
> = ({ children, ...groupProps }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  // methods
  const renderChildren = () => {
    if (error) {
      return <Alert status="danger" message={error} />;
    }

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...groupProps, // Üstten gelen tüm proplar butonlara dağılır.
          ...child.props, // Eğer butonun kendi üstünde ezmek istediği bir prop varsa o korunur.
        });
      }

      return child;
    });
  };

  // useEffects
  useEffect(() => {
    try {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Button) {
          throw new Error("ButtonGroup can only have Button elements as children.");
        }
      });

      // Hata yoksa, error'u temizle.
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        // Hata varsa error state'e yaz.
        setError(err.message);
        console.error(err.message);
      }
    }
  }, [children]);

  return <div className="har-button-group">{renderChildren()}</div>;
};

ButtonGroup.displayName = "ButtonGroup";
export default ButtonGroup;
