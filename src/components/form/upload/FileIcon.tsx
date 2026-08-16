import React from "react";
import { Icons, MimeTypes } from "../../../libs/infrastructure/types";
import Utils from "../../../libs/infrastructure/shared/Utils";
import { Icon } from "../../icons";

type IconProps = {
  size?: number;
  fill?: string;
};

type FileIconProps = IconProps & {
  mimeType?: MimeTypes;
};

const MIME_ICON: Record<string, Icons> = {
  image: "FileImage",
  document: "FileTypeDoc",
  spreadsheet: "FileTypeXls",
  presentation: "FileTypePptx",
  archive: "FileTypeZip",
  text: "FileTypeTxt",
  json: "FileTypeJson",
  xml: "FileCode",
  video: "FileVideo",
  audio: "FileAudio",
};

// MIME türünden görüntülenecek dosya ikonunu belirler.
const resolveIcon = (mimeType?: MimeTypes): Icons => {
  if (!mimeType) return "File";

  // Kategori eşlemesinden önce bilinen özel türler.
  if (mimeType === "image/svg+xml") return "FileSvg";
  if (mimeType === "application/pdf") return "FileTypePdf";
  if (mimeType === "text/csv") return "FileTypeCsv";
  if (mimeType === "text/html") return "FileTypeHtml";

  const { category } = Utils.GetFileTypeInformation(mimeType);
  return MIME_ICON[category] ?? "File";
};

// Dosyanın MIME türüne göre ikon gösterir.
export const FileIcon = ({ mimeType, size = 18, fill = "currentColor" }: FileIconProps) => (
  <Icon icon={resolveIcon(mimeType)} size={size} fill={fill} />
);

// Validasyon uyarısı için ikon.
export const WarningDiamondIcon = ({ size = 16, fill = "currentColor" }: IconProps) => (
  <Icon icon="ExclamationDiamond-Fill" size={size} fill={fill} />
);
