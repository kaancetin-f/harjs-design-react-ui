/**
 * Copies the first JSX child name onto `<Example name="...">` so the Code
 * tab can load that demo file without a `code={` prop.
 */
type MdxNode = {
  type: string;
  name?: string;
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
  children?: MdxNode[];
};

function walk(node: MdxNode, visit: (node: MdxNode) => void) {
  visit(node);
  for (const child of node.children ?? []) {
    walk(child, visit);
  }
}

function hasAttribute(node: MdxNode, name: string) {
  return node.attributes?.some((attribute) => attribute.name === name) ?? false;
}

function firstJsxChildName(node: MdxNode): string | undefined {
  for (const child of node.children ?? []) {
    if (
      (child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') &&
      child.name
    ) {
      return child.name;
    }

    const nested = firstJsxChildName(child);
    if (nested) return nested;
  }
}

/** Copies the demo component tag name onto `<Example>` so the Code tab can load that `.tsx` file. */
export function remarkExampleDemoName() {
  return (tree: MdxNode) => {
    walk(tree, (node) => {
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return;
      if (node.name !== 'Example') return;
      if (hasAttribute(node, 'code') || hasAttribute(node, 'name')) return;

      const demoName = firstJsxChildName(node);
      if (!demoName) return;

      node.attributes = node.attributes ?? [];
      node.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'name',
        value: demoName,
      });
    });
  };
}
