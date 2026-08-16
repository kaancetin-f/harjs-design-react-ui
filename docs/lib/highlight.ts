/**
 * Docs overlay and MDX fences use the library tokenizer.
 * Load token CSS here so pages that never mount `Typography.Code` still highlight.
 */
import "../../src/assets/css/components/data-display/typography/code.css";

export {
  highlightDocument,
  highlightToHtml,
  registerHighlighter,
} from "../../src/components/data-display/typography/code/highlight";
