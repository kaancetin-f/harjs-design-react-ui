import { ParagraphColors } from "../../../libs/infrastructure/types";

const TOKEN_COLORS: readonly ParagraphColors[] = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "gray",
  "white",
  "gray-50",
  "gray-100",
  "gray-200",
  "gray-300",
  "gray-400",
  "gray-500",
  "gray-600",
  "gray-700",
  "gray-800",
  "gray-900",
];

export const isTokenColor = (color: string): color is ParagraphColors =>
  (TOKEN_COLORS as readonly string[]).includes(color);
