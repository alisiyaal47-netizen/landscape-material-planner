import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/content-page";
import { GravelShell } from "@/components/calculator/gravel-shell";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Gravel Calculator | Estimate Landscaping Material",
  "Estimate gravel volume and weight, then compare bag and bulk costs using prices, delivery fees and order rules you enter.",
  "/gravel-calculator",
);

export default function GravelPage() {
  return (
    <Container className="calculator-page">
      <Breadcrumb title="Gravel Calculator" />
      <div className="page-heading">
        <p className="eyebrow">LANDSCAPE PLANNING / GRAVEL VOLUME</p>
        <h1>Gravel Calculator</h1>
        <p className="page-intro">
          Estimate geometric volume and planning weight for a rectangular or
          circular space. Adjust the material density, extra allowance and any
          gravel you already have, then compare bag and bulk buying options with
          prices you enter.
        </p>
      </div>
      <GravelShell />
      <div className="calculator-guides">
        <section>
          <h2>How the Gravel Calculator Works</h2>
          <p>
            Choose Rectangle or Circle, enter your measurements and select a
            unit for each dimension. Calculate to see geometric volume and a
            breakdown of the formula. Project type is context only; it does not
            change the calculation. Reset clears measurements, errors and
            results.
          </p>
        </section>
        <section id="measurement-guide">
          <h2>Measurement Guide</h2>
          <p>
            Record length and width for a rectangular area, and note the
            intended material depth separately. For a circle, measure its
            diameter through the center. Check measurements on site and record
            the unit alongside each value. Custom and irregular shapes are not
            supported yet.
          </p>
        </section>
        <section>
          <h2>Calculation Methodology</h2>
          <p>
            Rectangle: Volume = Length × Width × Depth. Circle: Volume = π ×
            Radius² × Depth, where radius is half the diameter. Dimensions are
            converted to meters before calculating. Both formulas assume a
            uniform depth. Read our <Link href="/methodology">methodology</Link>{" "}
            for conversion factors, rounding and limitations.
          </p>
        </section>
        <section>
          <h2>Gravel Units Explained</h2>
          <p>
            Feet, meters, inches and centimeters describe dimensions. Cubic
            feet, cubic yards and cubic meters describe volume. 1 cubic yard =
            27 cubic feet. Results show 2 decimal places for cubic feet and
            yards, and 3 for cubic meters. These are geometric estimates, not
            final order quantities.
          </p>
        </section>
        <section>
          <h2>How Gravel Weight Is Estimated</h2>
          <p>
            The calculator multiplies remaining cubic yards by the editable
            density in US short tons per cubic yard. It then converts short tons
            to pounds and metric tonnes. Weight is a planning estimate, not a
            delivery guarantee.
          </p>
        </section>
        <section>
          <h2>Why Density Varies</h2>
          <p>
            Gravel density can change with stone type, particle size, gradation,
            moisture and how the material is measured. Presets provide a
            consistent starting point, while the density field remains editable.
          </p>
        </section>
        <section>
          <h2>Why Supplier Density Is Better</h2>
          <p>
            A supplier can provide a density or conversion factor for the exact
            product being delivered. That product-specific figure is more
            reliable than a general planning preset.
          </p>
        </section>
        <section>
          <h2>What Extra Allowance Means</h2>
          <p>
            Extra Allowance adds a percentage to the base geometric volume
            before existing gravel is deducted. The default is 10%, but it is an
            editable planning margin—not a compaction or waste recommendation.
          </p>
        </section>
        <section>
          <h2>Subtracting Existing Gravel</h2>
          <p>
            Existing gravel can be entered in cubic yards, cubic feet or cubic
            meters. It is converted to cubic yards and subtracted from planned
            volume. Remaining volume stops at zero and never becomes negative.
          </p>
        </section>
        <section>
          <h2>Bags vs Bulk Gravel</h2>
          <p>
            Bag estimates round up to a whole number of bags. Bulk estimates
            apply the entered minimum and order increment. The comparison uses
            only the prices and fees you enter; it does not search suppliers or
            provide live prices.
          </p>
        </section>
        <section>
          <h2>Why Delivery Changes the Result</h2>
          <p>
            A bulk material price covers the entered volume, while delivery is
            added separately. A delivery fee can change which option has the
            lower entered cost, especially for smaller projects.
          </p>
        </section>
        <section>
          <h2>Why Supplier Increments Matter</h2>
          <p>
            Some suppliers sell bulk gravel only in fixed increments. The
            planner first applies the minimum order, then rounds the required
            volume up to the next entered increment.
          </p>
        </section>
        <section>
          <h2>Why Bag Weight and Volume Can Differ by Material</h2>
          <p>
            Equal-weight bags can occupy different volumes because density
            varies by material. A bag&apos;s label volume takes priority when
            entered; otherwise the planner estimates bag volume from its weight
            and the selected density.
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
            "No. This version has no project storage or accounts. Entered values are not sent to a calculator service.",
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
