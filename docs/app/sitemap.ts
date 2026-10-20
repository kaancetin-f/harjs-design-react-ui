import type { MetadataRoute } from "next";
import { getDocBySlug, getDocSlugs } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getDocSlugs().map((slug) => {
    const { meta } = getDocBySlug(slug);
    return {
      url: `${SITE_URL}${meta.href}`,
      changeFrequency: "weekly" as const,
      priority: slug.length === 0 ? 0.9 : 0.8,
    };
  });

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docs,
  ];
}
