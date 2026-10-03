import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Calculation Methodology | Fieldplan",
  "Our planned approach to formulas, unit conversions, material variability, rounding and the limits of landscape material estimates.",
  "/methodology",
);
export default function MethodologyPage() {
  return (
    <ContentPage
      title="Know what goes into the estimate."
      eyebrow="OUR METHODOLOGY"
      intro="Useful estimates should be understandable. These principles will guide our future calculators; no calculation engine is included in the current release."
    >
      <section>
        <h2>How calculations are developed</h2>
        <p>
          Future calculators will show formulas where practical, explain the
          role of each input and state the assumptions used. We plan to check
          representative cases and unit handling before publishing working
          tools.
        </p>
      </section>
      <section>
        <h2>Units and conversions</h2>
        <p>
          We will disclose which units an input accepts and how any conversion
          is performed. Dimensions, volume and weight will be labeled separately
          so an estimate is not mistaken for a different kind of measurement.
        </p>
      </section>
      <section>
        <h2>Material variability</h2>
        <p>
          Material type, grading, moisture, density and compaction can affect
          the relationship between a measured space and the amount supplied.
          Future tools will explain relevant assumptions rather than present one
          universal material value.
        </p>
      </section>
      <section>
        <h2>Rounding</h2>
        <p>
          Future results will explain rounding and distinguish a calculated
          estimate from a practical purchase quantity. Extra precision on screen
          should not imply extra certainty on site.
        </p>
      </section>
      <section>
        <h2>Limitations</h2>
        <p>
          These tools are intended to support planning, not provide exact
          quantities or professional construction advice. Verify major purchases
          and project requirements with suppliers or qualified professionals
          where appropriate. See the <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </section>
      <section>
        <h2>Corrections</h2>
        <p>
          When feedback is enabled, useful correction reports will include the
          tool, input values, units and an explanation of the issue. The{" "}
          <Link href="/contact">contact page</Link> currently shows the planned
          feedback interface; it cannot receive messages yet.
        </p>
      </section>
    </ContentPage>
  );
}
