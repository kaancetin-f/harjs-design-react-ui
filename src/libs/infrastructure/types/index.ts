import React from "react";

// ============================================================================
// 1. GLOBAL DESIGN SYSTEM TOKENS (Shared Types)
// ============================================================================

export type Variants = "filled" | "surface" | "surface-borderless" | "outlined" | "dashed" | "borderless";

export type Status =
  "primary" | "primary-light" | "secondary" | "success" | "danger" | "warning" | "information" | "dark" | "light";

export type Color = "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "teal" | "cyan" | "gray";

export type ParagraphColors =
  "gray-100" | "gray-200" | "gray-300" | "gray-400" | "gray-500" | "gray-600" | "gray-700" | "gray-800" | "gray-900";

export type Border = { radius: BorderRadiuses };
export type BorderRadiuses = "0" | "2" | "4" | "6" | "8" | "12" | "16" | "20" | "40" | "full";

export type Sizes = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type Icon = { element: React.JSX.Element; position?: "start" | "end" };
export type Option = { value: string | number | null; text: string };

// ============================================================================
// 2. NAVIGATION & STRUCTURAL COMPONENTS (Menu, Tabs, Steps)
// ============================================================================

/**
 * Properties governing the layout, sub-tree structures, and dynamic render schemas
 * for centralized navigation panels, action dropdowns, or sidebar menus.
 */
export interface NavigationMenuProps {
  /** Unique key tracking the menu instance node. */
  key: string | number;
  /** Optional custom rendering fallback or raw text descriptor. */
  render?: string | React.JSX.Element;
  /** Structural category separating functional elements from pure layout utilities. */
  type?: "group" | "divider";
  /** Leading icon or visual asset supporting the navigation item. */
  icon?: React.ReactElement<SVGElement | HTMLImageElement>;
  /** Nested navigation nodes for expanding multi-tier child items. */
  submenu?: NavigationMenuProps[];
}

export type MenuItemVariants = "vertical" | "horizontal";

/** Holds content mapping configurations for segmented wizard or tracking interfaces. */
export interface StepProps {
  title: string;
  content: React.ReactNode;
}

/** Holds panel metrics and window toggles for dynamic horizontal navigation hubs. */
export interface TabProps {
  title: string;
  content: React.ReactNode;
  config?: { canBeClosed: boolean };
}

// ============================================================================
// 3. DATA TABLES & GRID INFRASTRUCTURE
// ============================================================================

export type FilterDataType =
  "string" | "number" | "date" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

/**
 * Blueprint layout schema defining rendering pipelines, in-line editing configurations,
 * content behavior alignments, and server/client-side data query filtering.
 */
export interface TableColumnProps<T> {
  /** The descriptive header text displayed for the specific data scope. */
  title?: string;
  /** Targets the model property key path; accepts nested field mapping accessors. */
  key?: keyof T | { field: keyof T; nestedKey: string };
  /** Predefined options populating the unique drop-down filter panel. */
  filters?: Option[];
  /** Expected scalar data type for validating query strings. */
  filterDataType?: FilterDataType;
  /** Custom presentation layer to parse and display specialized cell layouts. */
  render?: (item: T) => React.ReactNode;
  /** Dictates cell interactivity settings and direct mutation callback triggers. */
  editable?: (item: T) => {
    type:
      | "string"
      | "number"
      | "boolean"
      | "decimal"
      | "input-formatted-decimal"
      | "date-picker"
      | "single-select"
      | "multiple-select";
    options?: Option[];
    method?: () => void | Promise<void>;
    where?: boolean;
  };
  /** Geometric layout restrictions, structural alignment rules, and layer stickiness. */
  config?: {
    width?: number | "auto" | "fit-content" | "max-content" | "min-content";
    alignContent?: "left" | "center" | "right";
    sticky?: "left" | "right";
    textWrap?: "wrap" | "nowrap";
    isProperties?: boolean;
  };
}

export interface HTMLTableElementWithCustomAttributes extends HTMLTableElement {
  /** Clears all currently active filter structures on the table view layout. */
  filterCleaner: () => void;
}

// ============================================================================
// 4. APPLICATION MANAGEMENT & DATA FLOW (Validation, Board, Upload, Charts)
// ============================================================================

/** Schema configuration defining strict criteria layers for field input parsing. */
export type ValidationShape = {
  type: "required" | "minimum" | "maximum" | "email" | "phone" | "iban" | "account-number";
  value?: string | number;
  message: string;
};

/**
 * Orchestrates runtime validation bindings, form steps tracking, conditional error triggers,
 * and automatic UX viewport positioning.
 */
export interface ValidationProps<T> {
  /** Target schema key mapped for validation rule scanning. */
  key: keyof T;
  /** Sub-object identifier key if targeting multi-tier models. */
  subkey?: string;
  /** Correlating index pointer indicating multi-step layout position. */
  step?: number;
  /** List of functional shape restrictions checked chronologically. */
  shape?: ValidationShape[];
  /** Runtime gatekeeper logic; rules are evaluated only if this resolves to `true`. */
  where?: (param: T) => boolean;
  /** Optional scrolling strategy configuration to target invalid nodes. */
  scrollTo?: boolean;
}

/** Error state feedback tracking mapped dynamically across data schemas. */
export type Errors<TData> = Partial<{ [key in keyof TData]: string }>;

/**
 * Property definitions structuring stage items, layouts, visual identities,
 * and column operations in task board components.
 */
export interface KanbanBoardColumnProps<T, TColumnProperties> {
  key: string;
  title: string;
  description?: string;
  titleColor?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.JSX.Element;
  columnProperties: TColumnProperties;
}

// Data Visualization & Nodes
export type PieChartDataType = { value: number; text: string };
export type View = "Day" | "Week" | "Month" | "Year";

export type NodeData = {
  id: string | number;
  position: { x: number; y: number };
  data: React.ReactNode;
};

export type EdgeData = {
  id: string | number;
  from: { id: string | number; port: "top" | "right" | "bottom" | "left" };
  to: { id: string | number; port: "top" | "right" | "bottom" | "left" };
};

// Media Registry Types
export type MimeTypes =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "image/bmp"
  | "image/tiff"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/zip"
  | "application/x-rar-compressed"
  | "application/x-7z-compressed"
  | "application/gzip"
  | "application/json"
  | "application/xml"
  | "text/plain"
  | "text/csv"
  | "text/html"
  | "video/mp4"
  | "video/quicktime"
  | "video/x-msvideo"
  | "video/x-matroska"
  | "video/webm"
  | "video/x-flv"
  | "audio/mpeg"
  | "audio/wav"
  | "audio/ogg"
  | "audio/aac"
  | "audio/flac"
  | "application/octet-stream";

export type FileCategory =
  | "image"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "text"
  | "video"
  | "audio"
  | "json"
  | "xml"
  | "binary"
  | "other";

export type Icons =
  | "Add"
  | "ArrowDown"
  | "ArrowDownUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "Bold"
  | "BulletList"
  | "CameraReels"
  | "CheckAll"
  | "ChevronBarLeft"
  | "ChevronBarRight"
  | "ChevronDown"
  | "ChevronExpand"
  | "ChevronUp"
  | "CloseCircle"
  | "CloseSquare"
  | "CloudUpload-Fill"
  | "Dash"
  | "Document"
  | "Download"
  | "ExclamationCircle"
  | "ExclamationDiamond-Fill"
  | "Eye-Fill"
  | "File"
  | "FileEarmark-Fill"
  | "FileTypeCsv"
  | "FileTypeDoc"
  | "FileTypeDocx"
  | "FileTypeHtml"
  | "FileTypeJson"
  | "FileTypePdf"
  | "FileTypePptx"
  | "FileTypeTxt"
  | "FileTypeXls"
  | "FileTypeXlsx"
  | "FileTypeXml"
  | "FileTypeZip"
  | "Filter"
  | "Floppy-Fill"
  | "Folder"
  | "Front"
  | "GripVertical"
  | "Import"
  | "Inbox-Fill"
  | "Information-Circle-Fill"
  | "Italic"
  | "NumberList"
  | "Strikethrough"
  | "TextAlingCenter"
  | "TextAlingLeft"
  | "TextAlingRight"
  | "ThreeDotsVertical"
  | "TickCircle"
  | "Trash-Fill"
  | "Underline"
  | "Upload"
  | "Warning"
  | "XCircle-Fill";
