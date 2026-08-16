import React from "react";
import "../../../assets/css/components/data-display/card/styles.css";
import IProps from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";

const toCssSize = (value?: string | number) => (typeof value === "number" ? `${value}px` : value);

const Card: React.FC<IProps> = ({
  children,
  title,
  actions,
  variant = "outlined",
  color = "gray-500",
  status,
  border = { radius: "12" },
  image,
}) => {
  // variables
  const imagePosition = image?.position ?? "top";
  // Overlay'de yükseklik karta, start/end'de genişlik kutusuna, diğerlerinde yükseklik kutusuna gider.
  const imageBoxStyle: React.CSSProperties | undefined = image
    ? {
        ...(imagePosition !== "overlay" && image.height != null ? { height: toCssSize(image.height) } : {}),
        ...((imagePosition === "start" || imagePosition === "end") && image.width != null
          ? { width: toCssSize(image.width) }
          : {}),
      }
    : undefined;

  const cardStyle: React.CSSProperties | undefined =
    image && imagePosition === "overlay" && image.height != null
      ? { minHeight: toCssSize(image.height) }
      : undefined;

  // refs
  const _className: string[] = ["har-card"];

  _className.push(...Utils.GetClassName(variant, status, undefined, border, undefined, undefined, undefined));

  if (color) _className.push(color);
  if (image) _className.push(`image-${imagePosition}`);

  return (
    <div className={_className.map((c) => c).join(" ")} style={cardStyle}>
      {image ? (
        <div className="image" style={imageBoxStyle}>
          <img src={image.src} alt={image.alt ?? ""} style={{ objectFit: image.fit ?? "cover" }} loading="lazy" />
        </div>
      ) : null}

      {title && (
        <div className="title">
          <h4>{title}</h4>
          {actions ? <div className="actions">{actions}</div> : null}
        </div>
      )}
      <div className="content">{children}</div>
    </div>
  );
};

Card.displayName = "Card";
export default Card;
