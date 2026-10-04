import type { MetadataRoute } from "next";
import { indexableRoutes, site, canonicalUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable || !site.url) return [];
  return indexableRoutes.map((route) => ({
    url: canonicalUrl(route)!,
  }));
}
