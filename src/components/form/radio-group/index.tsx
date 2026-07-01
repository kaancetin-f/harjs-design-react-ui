"use client";

import React, { useEffect, useState } from "react";
import Alert from "../../feedback/alert";
import Props from "./Props";
import Radio from "../radio";
import Title from "../../data-display/typography/title/Title";
import Flex from "../../data-display/grid-system/flex/Flex";

const RadioGroup: React.FC<Props> = ({ children, title, orientation, validation, ...groupProps }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  // methods
  const renderChildren = () => {
    if (error) return <Alert status="danger" message={error} />;

    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as Record<string, any>;

        return React.cloneElement<any>(child, {
          ...groupProps,
          ...child.props,
          name: groupProps.name,
          color: validation?.text ? "red" : childProps.color || (groupProps as any).color,
        });
      }

      return child;
    });
  };

  // useEffects
  useEffect(() => {
    try {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child) || child.type !== Radio) {
          throw new Error("It can only have Radio elements as children.");
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

  return (
    <Flex flexDirection={"column"} gap={"var(--space-16)"}>
      {title && <Title Level="h4">{title}</Title>}

      <Flex flexDirection={orientation == "horizontal" ? "row" : "column"} gap={"var(--space-6)"}>
        {renderChildren()}
      </Flex>

      {validation?.text && <div className="har-validation-text">{validation.text}</div>}
    </Flex>
  );
};

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
