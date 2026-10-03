import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "About Fieldplan | Practical Landscape Planning",
  "Learn why Fieldplan is being built around transparent calculations, practical landscaping plans and clearly stated assumptions.",
  "/about",
);
export default function AboutPage() {
  return (
    <ContentPage
      title="A clearer plan for the ground ahead."
      intro="Fieldplan is being built to make landscaping material planning clearer and more practical for homeowners and DIY users."
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
        <h2>What we’re building toward</h2>
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
          This first release provides the website foundation and a gravel
          calculator interface. Calculations and purchase planning are still in
          development. There are no working material estimates, supplier prices
          or buying recommendations yet.
        </p>
        <p>
          Explore the{" "}
          <Link href="/gravel-calculator">gravel calculator preview</Link> or
          read our <Link href="/methodology">methodology principles</Link>.
        </p>
      </section>
    </ContentPage>
  );
}
