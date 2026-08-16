import React from "react";
import { Icon } from "../../icons";

type Props = {
  size?: number;
  fill?: string;
};

// Yükleme tetikleyicisinde kullanılan varsayılan ikon.
const UploadIcon = ({ size = 16, fill = "#eb0028" }: Props) => (
  <Icon icon="Upload" size={size} fill={fill} />
);

export default UploadIcon;
