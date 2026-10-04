import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Material Planning Disclaimer | Fieldplan",
  "Understand the limits of Fieldplan gravel quantities, estimated weight and entered-cost comparisons before confirming an order with your supplier.",
  "/disclaimer",
);
export default function DisclaimerPage() {
  return (
    <ContentPage
      title="A starting point, not a final specification."
      eyebrow="DISCLAIMER"
      intro="Fieldplan estimates gravel quantities and compares purchase options using your inputs. Its project plan is an estimate to verify with your supplier before ordering."
    >
      <section>
        <h2>Entered prices are not supplier quotes</h2>
        <p>
          The comparison uses bag prices, bulk prices and a bulk delivery fee
          you enter. Taxes, bag delivery or pickup costs, labor, equipment,
          availability and other charges are not calculated separately. A lower
          entered cost does not guarantee the lowest final invoice or the most
          suitable product.
        </p>
      </section>
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
          the formulas, assumptions and limitations behind the full project plan.
        </p>
      </section>
    </ContentPage>
  );
}
