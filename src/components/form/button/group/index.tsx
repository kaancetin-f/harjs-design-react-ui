"use client";

import React, { useEffect, useState } from "react";
import "../../../../assets/css/components/form/button-group/styles.css";
import Alert from "../../../feedback/alert";
import Props from "./Props";
import IButtonProps from "../IProps";

const ButtonGroup: React.FC<Props> = ({ children, ...groupProps }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  // methods
  const renderChildren = () => {
    if (error) return <Alert status="danger" message={error} />;

    return React.Children.map(children, (child) => {
      if (React.isValidElement<IButtonProps>(child)) {
        return React.cloneElement(child, {
          ...groupProps,
          ...child.props,
        });
      }

      return child;
    });
  };

  // useEffects
  useEffect(() => {
    try {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
          throw new Error("Button.Group can only have Button elements as children.");
        }

        const displayName = (child.type as { displayName?: string }).displayName;

        if (displayName !== "Button") {
          throw new Error("Button.Group can only have Button elements as children.");
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

ButtonGroup.displayName = "Button.Group";
export default ButtonGroup;
