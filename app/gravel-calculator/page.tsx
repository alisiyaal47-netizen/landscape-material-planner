import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumb } from "@/components/layout/content-page";
import { GravelShell } from "@/components/calculator/gravel-shell";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Gravel Calculator | Estimate Landscaping Material",
  "Estimate gravel requirements for driveways, paths and landscaping projects with clear measurements and transparent calculations.",
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
          Estimate geometric volume for a rectangular or circular space. Enter
          your dimensions in feet, inches, meters or centimeters to see cubic
          feet, cubic yards and cubic meters.
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
      </div>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {[
          [
            "What does this calculator estimate?",
            "It calculates geometric volume for a rectangle or circle at a uniform depth. It does not calculate material weight, compaction, waste, prices or purchase quantities.",
          ],
          [
            "Can I use metric measurements?",
            "Yes. Each dimension has its own unit selector for feet, inches, meters or centimeters. You can mix units, such as feet for length and width with inches for depth.",
          ],
          [
            "Is the result the amount I should order?",
            "No. The result describes geometric space, not a final purchase quantity. It does not account for material behavior or supplier specifications. Verify these separately before ordering.",
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
