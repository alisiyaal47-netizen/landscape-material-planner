import type { Metadata } from "next";

export const site = {
  name: "Fieldplan",
  url: new URL(process.env.SITE_URL || "http://localhost:3000").origin,
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

// Centralized so social metadata can be added without changing every page.
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${site.url}${path === "/" ? "" : path}` },
  };
}
