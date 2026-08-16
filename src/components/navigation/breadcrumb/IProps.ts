import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

export type BreadcrumbItem = {
  /**
   * Stable identity for React keys. Do not reuse a label as the key —
   * two crumbs can share the same copy.
   */
  key?: string | number;
  /**
   * Visible crumb. Keep it short. Icons or a chip are fine when they stay readable.
   */
  label: ReactNode;
  /**
   * Native `href`. Renders an `<a>`. Router-agnostic — wrap with your own Link if needed.
   * Ignored on the last item (current page) and on disabled items.
   */
  href?: string;
  /**
   * Called when the crumb is activated. Without `href`, renders a button.
   * Ignored on the last item (current page) and on disabled items.
   */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /**
   * Non-interactive crumb. Stays in the trail, cannot be activated.
   */
  disabled?: boolean;
  /**
   * Related pages shown in a dropdown next to this crumb.
   * Use it for siblings or shortcuts. One level only — nested `menu` is ignored.
   */
  menu?: BreadcrumbItem[];
};

interface IProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Hierarchical trail. The last item is the current page.
   */
  items: BreadcrumbItem[];
  /**
   * Decorative divider between crumbs.
   * @default "/"
   */
  separator?: ReactNode;
  /**
   * Collapse the middle of long trails. Shows the first crumb, an overflow menu,
   * and the last `maxItems - 1` crumbs. Ignored when `maxItems < 2`.
   */
  maxItems?: number;
}

export default IProps;
