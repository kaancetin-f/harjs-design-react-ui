import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { DocsShell } from "@/components/shell";
import { mdxComponents } from "@/components/mdx";
import {
  extractToc,
  getDocBySlug,
  getDocCategory,
  getDocSlugs,
} from "@/lib/docs";
import { remarkExampleDemoName } from "@/lib/remark-example-demo";
import { rehypeHeadingIds } from "@/lib/slug";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  try {
    const { meta } = getDocBySlug(slug);
    return {
      title: meta.title,
      description: meta.description,
    };
  } catch {
    return {};
  }
}

export default async function DocsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  let doc: ReturnType<typeof getDocBySlug>;

  try {
    doc = getDocBySlug(slug);
  } catch {
    notFound();
  }

  // TOC ids must match rehypeHeadingIds so in-page links land on the heading.
  const toc = extractToc(doc.content);
  const href = doc.meta.href;

  return (
    <DocsShell currentPath={href} toc={toc}>
      <header className="doc-header">
        <div className="doc-kicker">
          {getDocCategory(href) ?? "Documentation"}
        </div>
        <h1 className="doc-title">{doc.meta.title}</h1>
        {doc.meta.description ? (
          <p className="doc-desc">{doc.meta.description}</p>
        ) : null}
      </header>

      <article className="prose">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkExampleDemoName],
              rehypePlugins: [rehypeHeadingIds],
            },
          }}
        />
      </article>
    </DocsShell>
  );
}
