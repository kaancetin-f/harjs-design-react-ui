import type { ReactNode } from "react";
import { ExampleView } from "@/components/example-view";
import { getDemoCodeByExportName, getDemoCodeFromChildren } from "@/lib/demo-code";

export function Example({
  children,
  code,
  name,
  lang = "tsx",
}: {
  children: ReactNode;
  code?: string;
  name?: string;
  lang?: string;
}) {
  // variables
  // `code` prop'u eski MDX'ler için kaldı; yeni sayfalar demo dosyasını `name` ile çözer.
  const resolved = (
    code ??
    (name ? getDemoCodeByExportName(name) : getDemoCodeFromChildren(children))
  ).trim();

  return (
    <ExampleView code={resolved} lang={lang} name={name}>
      {children}
    </ExampleView>
  );
}

Example.displayName = "Example";
