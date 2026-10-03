import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Calculation Methodology | Fieldplan",
  "Understand gravel volume, allowance, existing-material and weight formulas, unit conversions, density assumptions and display rounding.",
  "/methodology",
);
export default function MethodologyPage() {
  return (
    <ContentPage
      title="Know what goes into the estimate."
      eyebrow="OUR METHODOLOGY"
      intro="Useful estimates should be understandable. Here is how the gravel calculator turns dimensions into volume, applies planning adjustments and estimates material weight."
    >
      <section>
        <h2>How calculations are developed</h2>
        <p>
          Rectangle: Volume = Length × Width × Depth. Circle: Volume = π ×
          Radius² × Depth, where Radius = Diameter ÷ 2. Both assume a uniform
          depth. Project type does not affect the formula. Known examples, mixed
          units and invalid inputs are covered by automated tests.
        </p>
      </section>
      <section>
        <h2>Units and conversions</h2>
        <p>
          Each dimension can independently use feet, inches, meters or
          centimeters. Every length is converted to meters: 1 ft = 0.3048 m, 1
          in = 0.0254 m, 1 cm = 0.01 m, and 1 m = 1 m. The formula is evaluated
          once in cubic meters, without rounding the inputs.
        </p>
        <p>
          Cubic feet = cubic meters ÷ (0.3048³), or approximately cubic meters ×
          35.3146667. 1 cubic yard = 27 cubic feet, so cubic yards = cubic feet
          ÷ 27, approximately cubic meters × 1.30795062. The calculator uses
          factors derived from the exact foot definition rather than the
          shortened decimal factors shown here.
        </p>
      </section>
      <section>
        <h2>Material variability</h2>
        <p>
          Material type, grading, moisture, density and compaction can affect
          the relationship between volume and delivered weight. Preset densities
          are general planning values in US short tons per cubic yard. Density
          is editable because supplier specifications for the exact product are
          more reliable than a general preset.
        </p>
      </section>
      <section>
        <h2>Allowance and existing material</h2>
        <p>
          Planned volume = base volume × (1 + allowance ÷ 100). Extra Allowance
          is an editable planning margin from 0% to 100%; it is not presented as
          a compaction or waste recommendation. Existing gravel is converted to
          cubic yards and deducted next: remaining volume = max(0, planned
          volume − existing volume).
        </p>
      </section>
      <section>
        <h2>Weight conversions</h2>
        <p>
          Estimated US short tons = remaining cubic yards × density. Pounds =
          short tons × 2,000. Kilograms = pounds × 0.45359237, and metric tonnes
          = kilograms ÷ 1,000. Actual delivered weight can vary with material
          size, moisture, gradation and supplier specifications.
        </p>
      </section>
      <section>
        <h2>Rounding</h2>
        <p>
          Cubic feet and cubic yards display 2 decimal places; cubic meters
          display 3. Measurement steps display up to 8 significant digits, but
          those rounded values are not fed back into the calculation. A positive
          volume below the smallest displayed increment is shown with a
          less-than sign, and very large values use scientific notation. Extra
          precision on screen does not imply extra certainty on site.
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
