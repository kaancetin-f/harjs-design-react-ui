import type { ReactNode } from "react";
import { IChildrenProps } from "../../../libs/infrastructure/types/IGlobalProps";

export const PAPER_ELEVATIONS = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24] as const;

export type PaperElevation = (typeof PAPER_ELEVATIONS)[number];

interface IProps extends IChildrenProps {
  title?: string;
  action?: ReactNode;
  elevation?: PaperElevation;
}

export default IProps;
