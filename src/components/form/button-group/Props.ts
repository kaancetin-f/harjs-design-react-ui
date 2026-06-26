import { ComponentProps, ReactElement } from "react";
import Button from "../button";

type Props = {
  children: ReactElement<typeof Button> | ReactElement<typeof Button>[];
} & Omit<ComponentProps<typeof Button>, "children">;

export default Props;
