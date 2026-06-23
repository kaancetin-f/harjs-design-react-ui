import React from "react";

const Box: React.FC<{ children: React.ReactNode; direction?: "flex-start" | "center" | "flex-end" }> = ({
  children,
  direction = "flex-start",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: direction,
        alignItems: "center",
        gap: ".5rem",
      }}
    >
      {children}
    </div>
  );
};

Box.displayName = "Box";
export default Box;
