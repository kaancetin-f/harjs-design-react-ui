"use client";

import React, { useEffect, useState } from "react";
import Props from "./Props";
import RadioProps from "../IProps";
import { RadioGroupContext } from "./context";
import Alert from "../../../feedback/alert";
import Title from "../../../data-display/typography/title/Title";
import GridSystem from "../../../layout/grid-system";

const { Flex } = GridSystem;

const RadioGroup: React.FC<Props> = ({ children, title, columns, orientation, validation, name, ...groupProps }) => {
  // states
  const [error, setError] = useState<string | null>(null);

  // methods
  const renderChildren = () => {
    if (error) return <Alert status="danger" message={error} />;

    return React.Children.map(children, (child) => {
      if (React.isValidElement<RadioProps>(child)) {
        const clonedChild = React.cloneElement(child, {
          ...groupProps,
          color: validation?.text ? "red" : child.props.color || groupProps.color,
          name,
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
          throw new Error("Radio.Group can only have Radio or Radio.Card elements as children.");
        }

        const displayName = (child.type as { displayName?: string }).displayName;

        if (displayName !== "Radio" && displayName !== "Radio.Card") {
          throw new Error("Radio.Group can only have Radio or Radio.Card elements as children.");
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
    <RadioGroupContext.Provider value={{ name }}>
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
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = "Radio.Group";
export default RadioGroup;
