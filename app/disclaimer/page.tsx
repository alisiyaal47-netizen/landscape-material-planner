import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Material Planning Disclaimer | Fieldplan",
  "Understand why future material calculations are estimates and why site conditions, compaction and supplier specifications can change actual requirements.",
  "/disclaimer",
);
export default function DisclaimerPage() {
  return (
    <ContentPage
      title="A starting point, not a final specification."
      eyebrow="DISCLAIMER"
      intro="Future calculations will provide planning estimates. The current calculator is an interface preview and produces no material quantities."
    >
      <section>
        <h2>Real projects have real variation</h2>
        <p>
          Actual material requirements can vary due to site conditions,
          compaction, density, moisture, measurement error, supplier
          specifications and the conditions of the project itself. An estimate
          cannot fully describe every site or material.
        </p>
      </section>
      <section>
        <h2>Check before purchasing</h2>
        <p>
          Verify major purchases with your supplier or a qualified professional
          where appropriate. Confirm the intended depth, material suitability,
          supplied units and any project-specific requirements before ordering.
        </p>
      </section>
      <section>
        <h2>Planning support, not construction advice</h2>
        <p>
          The site does not provide structural, drainage, engineering or other
          professional construction advice. For work with safety or structural
          implications, seek advice suited to your project and location.
        </p>
        <p>
          Read our <Link href="/methodology">methodology</Link> to understand
          how future estimates will disclose their assumptions and limitations.
        </p>
      </section>
    </ContentPage>
  );
}
