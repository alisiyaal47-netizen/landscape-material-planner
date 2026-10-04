import { canonicalUrl, site } from "@/lib/site";

export function StructuredData({ calculator = false }: { calculator?: boolean }) {
  if (!site.url) return null;
  const home = canonicalUrl("/")!;
  const url = canonicalUrl("/gravel-calculator")!;
  const graph = calculator ? [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: home },
        { "@type": "ListItem", position: 2, name: "Gravel Calculator", item: url },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": `${url}#application`,
      name: "Fieldplan Gravel Calculator",
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "JavaScript required for calculations.",
      isAccessibleForFree: true,
      description: "Estimate gravel volume and weight, compare entered bag and bulk costs, and copy or print a project plan.",
    },
  ] : [{ "@type": "WebSite", "@id": `${home}/#website`, name: site.name, url: home }];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
  }} />;
}
