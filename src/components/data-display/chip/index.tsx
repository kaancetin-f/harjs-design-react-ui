"use client";

import React from "react";
import "../../../assets/css/components/data-display/chip/styles.css";
import IProps, { ChipImage } from "./IProps";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Icon } from "../../icons";

// Tekil görseli diziye çevir; yoksa boş dizi dön.
const toImageList = (image?: ChipImage | ChipImage[]) => (image ? (Array.isArray(image) ? image : [image]) : []);

const ChipAvatar = ({ image }: { image: ChipImage }) => (
  <span className="image">
    <img src={image.src} alt={image.alt ?? ""} style={{ objectFit: image.fit ?? "cover" }} loading="lazy" />
  </span>
);

const Chip: React.FC<IProps> = ({
  variant = "outlined",
  color = "gray",
  customColor,
  text,
  border = { radius: "4" },
  size = "lg",
  icon,
  image,
  upperCase,
  fontWeight,
  onDelete,
}) => {
  // refs
  const _chipClassName: string[] = ["har-chip"];

  // variables
  const images = toImageList(image);
  const startImage = images.find((item) => (item.position ?? "start") === "start");
  const endImage = images.find((item) => item.position === "end");
  const iconPosition = icon?.position ?? "start";

  _chipClassName.push(...Utils.GetClassName(variant, undefined, color, border, size, undefined, undefined));
  if (fontWeight) _chipClassName.push(`font-weight-${fontWeight}`);
  if (onDelete) _chipClassName.push("deletable");
  if (startImage) _chipClassName.push("has-image-start");
  if (endImage) _chipClassName.push("has-image-end");

  return (
    <div
      className={_chipClassName.map((c) => c).join(" ")}
      {...(customColor && {
        style: {
          backgroundColor: customColor,
          color: "var(--black)",
        },
      })}
    >
      {startImage ? <ChipAvatar image={startImage} /> : null}
      {icon?.element && iconPosition === "start" ? <span className="icon">{icon.element}</span> : null}
      <span className="label">{upperCase ? text.toLocaleUpperCase() : text}</span>
      {icon?.element && iconPosition === "end" ? <span className="icon">{icon.element}</span> : null}
      {endImage ? <ChipAvatar image={endImage} /> : null}

      {onDelete && (
        <button
          type="button"
          className="har-chip-delete"
          aria-label="Delete"
          onClick={(event) => {
            // Silme, chip'in kendi tıklamasını tetiklemesin.
            event.stopPropagation();
            onDelete(event);
          }}
        >
          <Icon icon="X" size={12} />
        </button>
      )}
    </div>
  );
};

Chip.displayName = "Chip";
export default Chip;
