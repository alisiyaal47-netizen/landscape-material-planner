import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";
import { GRAVEL_MATERIALS } from "@/lib/materials/gravel";

export const metadata = pageMetadata(
  "Calculation Methodology | Fieldplan",
  "See Fieldplan’s gravel formulas, exact unit conversions, density presets, allowance and stock deductions, bag counts, bulk order rules and cost limitations.",
  "/methodology",
);
export default function MethodologyPage() {
  return (
    <ContentPage
      title="Gravel calculation methodology"
      eyebrow="OUR METHODOLOGY"
      intro="Follow the calculation from measurements through volume, weight and an entered-cost buying plan. Every stage uses your inputs; no supplier prices or availability are fetched."
    >
      <section>
        <h2>How calculations are developed</h2>
        <p>
          Rectangle: Volume = Length × Width × Depth. Circle: Volume = π ×
          Radius² × Depth, where Radius = Diameter ÷ 2. Both assume a uniform
          depth. Project type does not affect the formula. Known examples, mixed
          units and invalid inputs are covered by automated tests.
        </p>
        <p>
          Use the <Link href="/gravel-calculator">gravel calculator</Link> to
          see these steps with your own measurements, or follow its{" "}
          <Link href="/gravel-calculator#worked-example">worked project example</Link>.
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
        <h3>Planning density presets</h3>
        <ul>
          {GRAVEL_MATERIALS.filter((material) => material.density !== null).map((material) => (
            <li key={material.id}>
              {material.name}: {material.density!.toFixed(2)} US short tons/yd³
            </li>
          ))}
        </ul>
        <p>
          These are general planning assumptions, not measurements of your
          supplier’s product or certified material specifications. Custom density
          must be a positive finite value. The density field is editable for all
          presets. No universal compaction factor or construction depth is assumed.
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
        <p>
          The default allowance is 10%. Existing material is entered as volume,
          not weight. Only subtract usable stock that has not already been
          excluded from the space you measured. When remaining volume is zero,
          estimated weight is zero and the interface skips bag/bulk purchases.
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
        <h2>Bag purchase calculations</h2>
        <p>
          If a label volume is entered, bag volume in yd³ = label ft³ ÷ 27.
          This takes priority over bag weight. Otherwise, estimated bag volume
          in yd³ = (bag weight in lb ÷ 2,000) ÷ density in short tons/yd³.
          This weight-based estimate depends on the density selected above.
        </p>
        <p>
          Bags needed = remaining yd³ ÷ bag volume yd³, rounded up to a whole
          bag. Purchased volume = bag count × bag volume. Bag material cost =
          bag count × entered bag price.
        </p>
      </section>
      <section>
        <h2>Bulk orders, delivery and leftovers</h2>
        <p>
          Required order = max(remaining yd³, minimum order yd³). Order volume =
          required order rounded up to a multiple of the supplier increment.
          A small numerical tolerance avoids rounding an exact multiple up an
          extra increment because of floating-point representation.
        </p>
        <p>
          Bulk material cost = order yd³ × entered price per yd³. Bulk total =
          material cost + entered delivery fee. For either option, leftover =
          max(0, purchased volume − remaining volume).
        </p>
      </section>
      <section>
        <h2>Entered costs and the final plan</h2>
        <p>
          The tool compares the unrounded bag material cost with the unrounded
          bulk total and displays their absolute difference. Equal costs have
          no winner. Displayed USD amounts use two decimal places; very small
          differences can round to $0.00 while one unrounded cost is lower.
        </p>
        <p>
          Prices are supplied by the user and are not verified quotes. Taxes,
          bag delivery or pickup, labor and equipment are not added separately.
          No availability, distance-based delivery or truck-capacity check is
          performed. Confirm the final invoice and delivery terms with the supplier.
        </p>
        <p>
          The final project plan reuses the calculated results. Editing a
          relevant input invalidates it. Copy Plan exports text to the clipboard;
          Print Plan uses the browser print dialog. Plans are not stored by Fieldplan.
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
