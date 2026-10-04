import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: site.indexable && site.url ? `${site.url}/sitemap.xml` : undefined,
  };
}
