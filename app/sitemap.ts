import type { MetadataRoute } from "next";
import { listContent } from "@/lib/content/store";
import type { ArticleData } from "@/lib/content/schemas";

const BASE = "https://official-kd.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/solutions`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/hackathon`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const articles = await listContent<ArticleData>("article");
    dynamicPages = articles
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${BASE}/insights/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // DB down — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
