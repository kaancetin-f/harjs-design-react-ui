export type NavItem =
  | { type: "link"; title: string; href: string }
  | { type: "group"; title: string; items: { title: string; href: string }[] };

function componentLinks(
  group: string,
  items: { title: string; slug: string }[],
): NavItem {
  return {
    type: "group",
    title: group,
    items: items.map((item) => ({
      title: item.title,
      href: `/docs/components/${item.slug}`,
    })),
  };
}

export const navigation: NavItem[] = [
  { type: "link", title: "Getting Started", href: "/docs" },
  componentLinks("Form", [
    { title: "Button", slug: "form/button" },
    { title: "Checkbox", slug: "form/checkbox" },
    { title: "Date Picker", slug: "form/date-picker" },
    { title: "Input", slug: "form/input" },
    { title: "Radio", slug: "form/radio" },
    { title: "Select", slug: "form/select" },
    { title: "Switch", slug: "form/switch" },
    { title: "Text Editor", slug: "form/text-editor" },
    { title: "Upload", slug: "form/upload" },
  ]),
  componentLinks("Data Display", [
    { title: "Card", slug: "data-display/card" },
    { title: "Chip", slug: "data-display/chip" },
    { title: "Diagram", slug: "data-display/diagram" },
    { title: "Divider", slug: "data-display/divider" },
    { title: "DnD", slug: "data-display/dnd" },
    { title: "Kanban Board", slug: "data-display/kanban-board" },
    { title: "Paper", slug: "data-display/paper" },
    { title: "Table", slug: "data-display/table" },
    { title: "Tabs", slug: "data-display/tabs" },
    { title: "Tour", slug: "data-display/tour" },
    { title: "Typography", slug: "data-display/typography" },
  ]),
  componentLinks("Feedback", [
    { title: "Alert", slug: "feedback/alert" },
    { title: "Drawer", slug: "feedback/drawer" },
    { title: "Loading", slug: "feedback/loading" },
    { title: "Modal", slug: "feedback/modal" },
    { title: "Notification", slug: "feedback/notification" },
    { title: "Popover", slug: "feedback/popover" },
    { title: "Popup Confirm", slug: "feedback/popup-confirm" },
    { title: "Progress", slug: "feedback/progress" },
    { title: "Spinner", slug: "feedback/spinner" },
    { title: "Tooltip", slug: "feedback/tooltip" },
  ]),
  componentLinks("Navigation", [
    { title: "Breadcrumb", slug: "navigation/breadcrumb" },
    { title: "Menu", slug: "navigation/menu" },
    { title: "Pagination", slug: "navigation/pagination" },
    { title: "Steps", slug: "navigation/steps" },
    { title: "Wizard", slug: "navigation/wizard" },
  ]),
  componentLinks("Layout", [
    { title: "Grid System", slug: "layout/grid-system" },
    { title: "Layout", slug: "layout/layout" },
  ]),
];

const CATEGORY_LABELS: Record<string, string> = {
  form: "Form",
  "data-display": "Data Display",
  feedback: "Feedback",
  navigation: "Navigation",
  charts: "Charts",
  layout: "Layout",
};

export function getDocCategory(href: string): string | null {
  const match = href.match(/^\/docs\/components\/([^/]+)/);
  if (!match) return null;
  return CATEGORY_LABELS[match[1]] ?? match[1];
}
