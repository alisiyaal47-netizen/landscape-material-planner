import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/content-page";
import { GravelShell } from "@/components/calculator/gravel-shell";
import { pageMetadata } from "@/lib/site";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata = pageMetadata(
  "Gravel Calculator: Yards, Tons & Buying Plan | Fieldplan",
  "Estimate gravel in cubic yards and tons. Subtract existing stock, compare bag and bulk prices with delivery, and copy or print your project plan.",
  "/gravel-calculator",
);

export default function GravelPage() {
  return (
    <Container className="calculator-page">
      <StructuredData calculator />
      <Breadcrumb title="Gravel Calculator" />
      <div className="page-heading">
        <p className="eyebrow">FREE LANDSCAPE PLANNING TOOL</p>
        <h1>Gravel Calculator</h1>
        <p className="page-intro">
          Enter your driveway, path or bed measurements to estimate gravel in
          cubic yards, cubic feet, cubic meters and US short tons. Account for
          extra allowance and gravel you already have, then compare your bag and
          bulk prices and copy or print a final project plan.
        </p>
      </div>
      <GravelShell />
      <noscript>
        <p className="notice calculator-guides-note">
          Enable JavaScript to calculate and compare buying options. The formulas,
          worked example and measurement guidance below are available without it.
        </p>
      </noscript>
      <div className="calculator-guides">
        <section>
          <h2>How to use the gravel calculator</h2>
          <ol>
            <li>Choose Rectangle or Circle. Enter length and width, or diameter,
              plus depth. Each field accepts feet, inches, meters or centimeters.</li>
            <li>Select the material and check its density. Choose your extra
              allowance and enter any usable gravel you already have.</li>
            <li>Select Calculate Gravel to see base volume, remaining material
              and estimated weight with the calculation breakdown.</li>
            <li>Enter a bag size and price, plus the bulk price per cubic yard,
              minimum order, increment and delivery fee. Select Compare options.</li>
            <li>Review costs and leftovers in Your Gravel Project Plan. Copy it
              or use Print Plan, then your browser’s Save as PDF option.</li>
          </ol>
        </section>
        <section id="measurement-guide">
          <h2>Measurement Guide</h2>
          <p>
            Record length and width for a rectangular area, and note the
            intended material depth separately. For a circle, measure its
            diameter through the center. Check measurements on site and record
            the unit alongside each value. Both shapes assume a uniform depth.
            For an irregular area, measure simpler sections separately and keep
            a record of each result; this tool does not combine multiple areas.
            Project type is a label, not a depth or construction recommendation.
          </p>
        </section>
        <section>
          <h2>Gravel volume formula</h2>
          <p>
            Rectangle: Volume = Length × Width × Depth. Circle: Volume = π ×
            Radius² × Depth, where radius is half the diameter. Dimensions are
            converted to meters before calculating. Both formulas assume a
            uniform depth. Read our <Link href="/methodology">methodology</Link>{" "}
            for conversion factors, rounding and limitations.
          </p>
        </section>
        <section>
          <h2>Cubic feet, cubic yards and tons</h2>
          <p>
            Feet, meters, inches and centimeters describe dimensions. Cubic
            feet, cubic yards and cubic meters describe volume. 1 cubic yard =
            27 cubic feet. Results show 2 decimal places for cubic feet and
            yards, and 3 for cubic meters. A cubic yard measures space; a ton
            measures weight. There is no single yards-to-tons factor for every
            gravel product.
          </p>
        </section>
        <section>
          <h2>How gravel weight is estimated</h2>
          <p>
            The calculator multiplies remaining cubic yards by the editable
            density in US short tons per cubic yard. It then converts short tons
            to pounds and metric tonnes. Weight is a planning estimate, not a
            delivery guarantee.
          </p>
          <h3>Why density varies</h3>
          <p>
            Gravel density can change with stone type, particle size, gradation,
            moisture and how the material is measured. Presets provide a
            consistent starting point, while the density field remains editable.
          </p>
          <h3>Use supplier density when available</h3>
          <p>
            A supplier can provide a density or conversion factor for the exact
            product being delivered. That product-specific figure is more
            reliable than a general planning preset.
          </p>
        </section>
        <section>
          <h2>Extra allowance and existing gravel</h2>
          <p>
            Extra Allowance adds a percentage to the base geometric volume
            before existing gravel is deducted. The default is 10%, but it is an
            editable planning margin—not a compaction or waste recommendation.
          </p>
          <h3>Subtract usable existing material once</h3>
          <p>
            Existing gravel can be entered in cubic yards, cubic feet or cubic
            meters. It is converted to cubic yards and subtracted from planned
            volume. Remaining volume stops at zero and never becomes negative.
            If it covers the project, no purchase comparison is needed. Avoid
            double counting: if your depth already measures only the unfilled
            space, do not also subtract gravel already below that depth.
          </p>
        </section>
        <section>
          <h2>Bags vs bulk gravel</h2>
          <p>
            Bag estimates round up to a whole number of bags. Bulk estimates
            apply the entered minimum and order increment. The comparison uses
            only the prices and fees you enter; it does not search suppliers or
            provide live prices.
          </p>
          <h3>Delivery and minimum orders change the comparison</h3>
          <p>
            A bulk material price covers the entered volume, while delivery is
            added separately. A delivery fee can change which option has the
            lower entered cost, especially for smaller projects.
          </p>
          <p>
            Some suppliers sell bulk gravel only in fixed increments. The
            planner first applies the minimum order, then rounds the required
            volume up to the next entered increment. Needing 4.38 yd³ with a
            1 yd³ minimum and 0.5 yd³ increments means an order of 4.5 yd³.
            The difference becomes estimated leftover material.
          </p>
        </section>
        <section>
          <h2>Bag weight vs label volume</h2>
          <p>
            Equal-weight bags can occupy different volumes because density
            varies by material. A bag&apos;s label volume takes priority when
            entered; otherwise the planner estimates bag volume from its weight
            and the selected density.
          </p>
        </section>
        <section id="worked-example">
          <h2>Example: a 40 ft × 12 ft area, 3 in deep</h2>
          <p>
            Three inches is 0.25 ft. Base volume is 40 × 12 × 0.25 =
            120.00 ft³, or 4.44 yd³ (3.398 m³). A 10% allowance gives
            4.89 yd³ planned. Subtract 0.5 yd³ already available to leave
            4.39 yd³. At 1.40 short tons/yd³, that is about 6.14 US short
            tons, 12,288.89 lb or 5.574 metric tonnes.
          </p>
          <p>
            For illustration only, 50 lb bags at $5.99 require 246 bags and
            cost $1,473.54 using that density. Bulk at $52/yd³, a 1 yd³
            minimum, 0.5 yd³ increments and $75 delivery means 4.5 yd³ for
            $309.00, with about 0.11 yd³ left over. Bulk is lower by $1,164.54
            in this example. These are sample inputs, not current market prices;
            the calculator retains full precision between steps.
          </p>
        </section>
        <section>
          <h2>What to verify before ordering</h2>
          <p>
            Confirm depth, material suitability, density, product availability,
            delivery access and the supplier’s final quantities. Enter a total
            bulk delivery fee for the intended order; the tool does not estimate
            fees from your location or number of truckloads. Bulk pricing is
            per cubic yard, not per ton. Ask the supplier for a matching quote.
          </p>
          <p>
            Taxes, bag delivery or pickup costs, labor and equipment are not
            calculated separately. The comparison is a lower-cost option based
            on the values you entered, not a final invoice. Read the{" "}
            <Link href="/disclaimer">planning limitations</Link> and{" "}
            <Link href="/methodology">full calculation methodology</Link>.
          </p>
        </section>
      </div>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {[
          [
            "What does this calculator estimate?",
            "It calculates geometric volume for a rectangle or circle at a uniform depth, estimates remaining volume and weight, and compares bag and bulk purchase options using values you enter. It does not provide live prices or a final supplier quote.",
          ],
          [
            "Can I use metric measurements?",
            "Yes. Each dimension has its own unit selector for feet, inches, meters or centimeters. You can mix units, such as feet for length and width with inches for depth.",
          ],
          [
            "Is the result the amount I should order?",
            "No. Volume and weight are planning estimates. Verify measurements, product density, material behavior and supplier specifications before ordering.",
          ],
          [
            "Are my project details saved?",
            "No. There is no project storage or account. Calculations stay in your browser. Copy Plan saves text to your clipboard, and Print Plan opens your browser’s print dialog. Changing an input clears the previous plan.",
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </Container>
  );
}
