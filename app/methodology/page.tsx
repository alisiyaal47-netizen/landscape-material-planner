import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Calculation Methodology | Fieldplan",
  "Understand rectangle and circle volume formulas, exact length conversions, display rounding and the limits of geometric landscape estimates.",
  "/methodology",
);
export default function MethodologyPage() {
  return (
    <ContentPage
      title="Know what goes into the estimate."
      eyebrow="OUR METHODOLOGY"
      intro="Useful estimates should be understandable. Here is how the gravel calculator turns your measurements into a geometric volume estimate."
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
          the relationship between a measured space and the amount supplied. The
          current calculator does not adjust for any of these factors. Its
          output describes geometric space, not weight or a final order
          quantity.
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
