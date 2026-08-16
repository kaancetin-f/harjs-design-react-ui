"use client";

import "../../../assets/css/components/layout/layout/styles.css";
import React from "react";
import {
  ILayoutContentProps,
  ILayoutFooterProps,
  ILayoutHeaderProps,
  ILayoutProps,
  ILayoutSectionProps,
  ILayoutSiderProps,
} from "./IProps";
import Header from "./Header";
import Sider from "./Sider";
import Content from "./Content";
import Section from "./Section";
import Footer from "./Footer";
import { LayoutSiderProvider, useLayoutSider } from "./context";
import {
  cssVars,
  hasDescendantSider,
  hasDirectSider,
  LAYOUT_SLOT,
  pickTheme,
  toCssSize,
} from "./helpers";

const buildThemeVars = ({
  style,
  siderWidth,
  collapsedWidth,
  headerHeight,
  stickyHeader = true,
  stickySider = true,
  theme,
}: ILayoutProps): React.CSSProperties => {
  const common = theme?.common;
  const vars = cssVars({
    "--har-layout-bg": pickTheme(theme?.layout?.background, common?.background),
    "--har-layout-border": common?.borderColor,
    "--har-layout-text": common?.textColor,
    "--har-layout-font-size": common?.fontSize,
    "--har-layout-sider-bg": pickTheme(theme?.sider?.background, common?.background),
    "--har-layout-sider-border": pickTheme(theme?.sider?.borderColor, common?.borderColor),
    "--har-layout-sider-text": pickTheme(theme?.sider?.textColor, common?.textColor),
    "--har-layout-sider-width": toCssSize(siderWidth),
    "--har-layout-sider-collapsed-width": toCssSize(collapsedWidth),
    "--har-layout-sider-lock-bg": theme?.sider?.lockButton?.background,
    "--har-layout-sider-lock-color": theme?.sider?.lockButton?.color,
    "--har-layout-sider-lock-shadow": theme?.sider?.lockButton?.shadow,
    "--har-layout-sider-logo-divider": theme?.sider?.logoDivider,
    "--har-layout-header-bg": pickTheme(theme?.header?.background, common?.background),
    "--har-layout-header-text": pickTheme(theme?.header?.textColor, common?.textColor),
    "--har-layout-header-height": toCssSize(headerHeight),
    "--har-layout-content-bg": pickTheme(theme?.content?.background, common?.background),
    "--har-layout-section-bg": pickTheme(theme?.section?.background, common?.background),
    "--har-layout-footer-bg": pickTheme(theme?.footer?.background, common?.background),
    "--har-layout-footer-text": pickTheme(theme?.footer?.textColor, common?.textColor),
    "--har-layout-header-position": stickyHeader ? "sticky" : "relative",
    "--har-layout-sider-position": stickySider ? "sticky" : "relative",
  });

  return { ...vars, ...style };
};

const SLOT_BY_DISPLAY_NAME: Partial<
  Record<string, keyof NonNullable<ILayoutProps["slots"]>>
> = {
  [LAYOUT_SLOT.Sider]: "sider",
  [LAYOUT_SLOT.Header]: "header",
  [LAYOUT_SLOT.Content]: "content",
  [LAYOUT_SLOT.Section]: "section",
  [LAYOUT_SLOT.Footer]: "footer",
};

type LayoutCompound = React.FC<ILayoutProps> & {
  Header: React.FC<ILayoutHeaderProps>;
  Sider: React.FC<ILayoutSiderProps>;
  Content: React.FC<ILayoutContentProps>;
  Section: React.FC<ILayoutSectionProps>;
  Footer: React.FC<ILayoutFooterProps>;
};

const Layout: LayoutCompound = ({ children, className, name, hasSider, ...rest }) => {
  // hooks
  const parentSider = useLayoutSider();

  // variables
  const siderDirect = hasSider ?? hasDirectSider(children);
  // İçeride sider varsa context sağlayıcıyı yalnızca en dış Layout kurar.
  const provideSider =
    !parentSider &&
    (hasSider === true || hasDirectSider(children) || hasDescendantSider(children));

  // methods
  const enhanceChildren = (nodes: React.ReactNode): React.ReactNode => {
    return React.Children.map(nodes, (child) => {
      if (!React.isValidElement(child)) return child;

      if (child.type === React.Fragment) {
        return enhanceChildren(
          (child.props as { children?: React.ReactNode }).children,
        );
      }

      const typedChild = child as React.ReactElement<{
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      }>;

      const displayName = (typedChild.type as { displayName?: string }).displayName;
      const slotKey = displayName ? SLOT_BY_DISPLAY_NAME[displayName] : undefined;
      const slot = slotKey ? rest.slots?.[slotKey] : undefined;

      const nextProps: Record<string, unknown> = {};

      if (slot?.className) {
        nextProps.className = [slot.className, typedChild.props.className].filter(Boolean).join(" ");
      }

      if (slot?.style) {
        nextProps.style = {
          ...slot.style,
          ...typedChild.props.style,
        };
      }

      if (typedChild.props.children) {
        nextProps.children = enhanceChildren(typedChild.props.children);
      }

      return React.cloneElement(typedChild, nextProps);
    });
  };

  // variables
  const layoutClassName = [
    "har-layout",
    siderDirect ? "has-sider" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shell = (
    <div className={layoutClassName} style={buildThemeVars(rest)}>
      {enhanceChildren(children)}
    </div>
  );

  if (!provideSider) return shell;

  return <LayoutSiderProvider name={name}>{shell}</LayoutSiderProvider>;
};

Layout.Header = Header;
Layout.Sider = Sider;
Layout.Content = Content;
Layout.Section = Section;
Layout.Footer = Footer;

Layout.displayName = "Layout";
export { useLayoutSider };
export default Layout;
