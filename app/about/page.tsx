import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "About Fieldplan | Practical Landscape Planning",
  "Learn what Fieldplan does today: transparent gravel estimates and entered-price buying plans, with clear assumptions and limits for homeowners.",
  "/about",
);
export default function AboutPage() {
  return (
    <ContentPage
      title="A clearer plan for the ground ahead."
      intro="Fieldplan helps homeowners and DIY users understand a landscape material estimate before making a purchase. Gravel is the first available planning tool."
    >
      <section>
        <h2>Less guesswork, more understanding</h2>
        <p>
          Planning a path, refreshing a garden bed or preparing a patio base
          brings plenty of questions. Our aim is to help you understand the
          material estimate before you make a purchase.
        </p>
      </section>
      <section>
        <h2>What guides the tool</h2>
        <ul>
          <li>
            <strong>Transparent calculations.</strong> Explain how inputs lead
            to an estimate.
          </li>
          <li>
            <strong>Practical project planning.</strong> Keep the everyday
            decisions of a landscaping project in view.
          </li>
          <li>
            <strong>Clearly stated assumptions.</strong> Make limits and
            material differences visible.
          </li>
        </ul>
      </section>
      <section>
        <h2>Where the site stands today</h2>
        <p>
          The gravel calculator estimates volume and weight, applies your
          allowance and existing stock, and compares bag and bulk purchase
          options using prices you enter. You can copy or print the final plan.
          Other material calculators are not available yet. Fieldplan does not
          sell gravel, check product availability or collect live supplier prices.
        </p>
        <p>
          Explore the <Link href="/gravel-calculator">gravel calculator</Link>{" "}
          or read our <Link href="/methodology">calculation methodology</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
