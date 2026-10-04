import type { Metadata } from "next";
import { resolveSiteConfig } from "./site-config";

export const site = {
  name: "Fieldplan",
  ...resolveSiteConfig(process.env),
};

export const routes = [
  "/",
  "/gravel-calculator",
  "/about",
  "/contact",
  "/methodology",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
] as const;

// These pages remain reachable, but their unfinished contact/legal content
// should not be submitted for indexing until the owner completes it.
export const draftRoutes: readonly string[] = ["/contact", "/privacy-policy", "/terms"];
export const indexableRoutes = routes.filter((route) => !draftRoutes.includes(route));

export function canonicalUrl(path: string): string | undefined {
  return site.url ? `${site.url}${path === "/" ? "" : path}` : undefined;
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = canonicalUrl(path);
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: { index: site.indexable && !draftRoutes.includes(path), follow: true },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title,
      description,
      ...(url ? { url } : {}),
    },
    twitter: { card: "summary", title, description },
  };
}
