"use client";

import React, { useEffect, useState } from "react";
import Props from "./Props";
import CheckboxProps from "../Props";
import Alert from "../../../feedback/alert";
import Title from "../../../data-display/typography/title/Title";
import GridSystem from "../../../layout/grid-system";

const { Flex } = GridSystem;

const CheckboxGroup: React.FC<Props> = ({ children, title, columns, orientation, validation, ...groupProps }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  // methods
  const renderChildren = () => {
    if (error) return <Alert status="danger" message={error} />;

    return React.Children.map(children, (child) => {
      if (React.isValidElement<CheckboxProps>(child)) {
        const clonedChild = React.cloneElement(child, {
          ...groupProps,
          ...child.props,
          color: validation?.text ? "red" : child.props.color || groupProps.color,
        });

        if (columns) {
          return <Flex flex={`0 0 calc(${100 / columns}% - var(--space-16))`}>{clonedChild}</Flex>;
        }

        return clonedChild;
      }

      return child;
    });
  };

  // useEffects
  useEffect(() => {
    try {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
          throw new Error("Checkbox.Group can only have Checkbox or Checkbox.Card elements as children.");
        }

        const displayName = (child.type as { displayName?: string }).displayName;

        if (displayName !== "Checkbox" && displayName !== "Checkbox.Card") {
          throw new Error("Checkbox.Group can only have Checkbox or Checkbox.Card elements as children.");
        }
      });

      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err.message);
      }
    }
  }, [children]);

  return (
    <Flex flexDirection={"column"} gap={"var(--space-16)"}>
      {title && <Title size="md">{title}</Title>}

      <Flex
        flexWrap={columns ? "wrap" : "nowrap"}
        flexDirection={orientation == "horizontal" ? "row" : "column"}
        gap={"var(--space-12)"}
      >
        {renderChildren()}
      </Flex>

      {validation?.text && <div className="har-validation-text">{validation.text}</div>}
    </Flex>
  );
};

CheckboxGroup.displayName = "Checkbox.Group";
export default CheckboxGroup;
