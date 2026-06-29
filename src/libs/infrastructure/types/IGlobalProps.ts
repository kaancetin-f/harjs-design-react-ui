import { Border, Color, Icon, Sizes, Status, Variants } from ".";

export interface IChildrenProps {
  /**
   * The content to be rendered inside the component.
   * Can be a string, a single React element, or multiple elements.
   *
   * @example
   * ```jsx
   * <Component>Hello, World!</Component>
   * * <Component>
   * <span>Hello, World!</span>
   * </Component>
   * ```
   */
  children?: React.ReactNode;
}

type ExcludedVariantsMap = {
  alert: "outlined" | "borderless";
  card: "dashed" | "borderless";
  checkbox: "borderless";
  input: "surface";
};
export interface IVariantProps<T extends { component?: string } = {}> {
  /**
   * Specifies the visual style variant of the component.
   *
   * - `filled`: Solid background with contrasting text.
   * - `outlined`: Transparent background with a solid border.
   * - `dashed`: Transparent background with a dashed border.
   * - `text`: Minimalist style with text only (no background or border).
   *
   * @example
   * ```jsx
   * <Component variant="filled">Hello, World!</Component>
   * ```
   */
  // variant?: T["component"] extends "alert"
  //   ? Exclude<Variants, "outlined" | "borderless">
  //   : T["component"] extends "card"
  //     ? Exclude<Variants, "dashed" | "borderless">
  //     : Variants;
  variant?: T["component"] extends keyof ExcludedVariantsMap
    ? Exclude<Variants, ExcludedVariantsMap[T["component"]]>
    : Variants;
}

export interface IStatusProps<T extends { component?: string } = {}> {
  /**
   * Determines the semantic status and color scheme of the component.
   *
   * @example
   * ```jsx
   * <Component status="success">Success Message</Component>
   * ```
   */
  status?: T["component"] extends "alert"
    ? Exclude<Status, "primary-light" | "secondary" | "information" | "dark" | "light">
    : T["component"] extends "card"
      ? Exclude<Status, "primary-light" | "secondary" | "information" | "dark" | "light">
      : Status;
}

export interface IColorProps {
  /**
   * Sets the theme or specific color of the component.
   *
   * @example
   * ```jsx
   * <Component color="blue">Hello, World!</Component>
   * ```
   */
  color?: Color;
}

export interface IBorderProps {
  /**
   * Configures the component's border styles and corner radii.
   *
   * - `radius` (optional): Controls the corner rounding behavior.
   * - `sm`: Small radius.
   * - `lg`: Large radius.
   * - `xl`: Extra-large radius.
   * - `xxl`: Double extra-large radius.
   * - `pill`: Fully rounded capsule shape.
   * - `none`: Sharp corners (no radius).
   *
   * @example
   * ```jsx
   * <Component border={{ radius: "sm" }}>
   * Content
   * </Component>
   * ```
   */
  border?: Border;
}

export interface IIconProps {
  /**
   * Configures an icon element inside the component, including its layout and alignment.
   *
   * - `element`: The React JSX node representing the icon.
   * - `position` (optional): The position of the icon relative to the component text.
   * - `start`: Placed before the text.
   * - `end`: Placed after the text.
   *
   * @example
   * ```jsx
   * <Component
   * icon={{
   * element: <MyIcon />,
   * direction: "row",
   * position: "start"
   * }}
   * >
   * Click Me!
   * </Component>
   * ```
   */
  icon?: Icon;
}

export interface ISizeProps {
  /**
   * Defines the overall scale and sizing of the component.
   *
   * - `large`: Scaled-up layout for prominence.
   * - `normal`: Standard layout size (Default).
   * - `small`: Compact layout for tight spaces.
   *
   * @example
   * ```jsx
   * <Component size="large">
   * Large Layout
   * </Component>
   * ```
   */
  size?: Sizes;
}

export interface IUpperCaseProps {
  /**
   * If `true`, transforms all text inside the component to uppercase.
   *
   * @default false
   * @example
   * ```jsx
   * <Component upperCase>
   * this will be uppercase
   * </Component>
   * ```
   */
  upperCase?: boolean;
}

export interface IValidationProps {
  /**
   * Manages validation feedback and behavior for the component.
   *
   * - `text`: The error or warning message to display.
   * - `scrollTo` (optional): If `true`, automatically scrolls the window to this component when validation fails.
   *
   * @example
   * ```jsx
   * <Component
   * validation={{
   * text: "This field is required.",
   * scrollTo: true,
   * }}
   * />
   * ```
   */
  validation?: {
    text: string | undefined;
    scrollTo?: boolean;
  };
}

export interface IPlaceholderProps {
  /**
   * The temporary hint text displayed before a value is entered or selected.
   *
   * @example
   * ```jsx
   * <Component placeholder="Select an option...">
   * Content
   * </Component>
   * ```
   */
  placeholder?: string;
}

export interface IDisabledProps {
  /**
   * If `true`, disables all user interactions and applies a disabled visual state.
   *
   * @default false
   * @example
   * ```jsx
   * <Component disabled>
   * Disabled Content
   * </Component>
   * ```
   */
  disabled?: boolean;
}
