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
        <p className="eyebrow">LANDSCAPE PLANNING / TOOL PREVIEW</p>
        <h1>Gravel Calculator</h1>
        <p className="page-intro">
          Estimate the gravel required for your landscaping project. Calculation
          functionality will be added in the next development phase.
        </p>
      </div>
      <GravelShell />
      <div className="calculator-guides">
        <section>
          <h2>How the Gravel Calculator Works</h2>
          <p>
            The planned workflow starts with your project type, shape and
            dimensions. For now, you can explore the interface; there is no
            calculation engine and no numerical result.
          </p>
        </section>
        <section id="measurement-guide">
          <h2>Measurement Guide</h2>
          <p>
            Record length and width for a rectangular area, and note the
            intended material depth separately. For a circular or irregular
            area, keep a sketch and note its dimensions. Check measurements on
            site and always record the unit alongside each value.
          </p>
        </section>
        <section>
          <h2>Calculation Methodology</h2>
          <p>
            Future calculations will explain formulas, unit conversions and
            assumptions. Read our <Link href="/methodology">methodology</Link>{" "}
            for the principles that will guide development.
          </p>
        </section>
        <section>
          <h2>Gravel Units Explained</h2>
          <p>
            Feet, meters, inches and centimeters describe dimensions. Cubic
            yards and cubic meters describe volume. Tons describe weight; the
            relationship between volume and weight depends on the material and
            its condition. No conversions are performed in this preview.
          </p>
        </section>
      </div>
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {[
          [
            "Can I calculate gravel quantities yet?",
            "Not yet. This is the calculator interface preview. The calculation button is disabled and no estimates are produced.",
          ],
          [
            "Can I use metric measurements?",
            "The interface includes meters and centimeters alongside feet and inches. Unit conversion and calculations will be added in a later phase.",
          ],
          [
            "Can I use this preview to place an order?",
            "No. It does not provide quantities, prices or buying advice. Verify measurements and material specifications with your supplier before ordering.",
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
