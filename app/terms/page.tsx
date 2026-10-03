import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Terms of Use Draft | Fieldplan",
  "Draft terms for informational use of Fieldplan, including estimates, user responsibilities, intellectual property and service changes.",
  "/terms",
);
export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      eyebrow="SITE INFORMATION"
      intro="Practical draft terms for using the Fieldplan website and its future planning tools."
      draft
    >
      <section>
        <h2>Informational use</h2>
        <p>
          Fieldplan is intended to help with general landscaping material
          planning. Content does not replace project-specific advice from a
          supplier, engineer, contractor or other qualified professional. The
          current release is an interface preview and does not calculate
          quantities.
        </p>
      </section>
      <section>
        <h2>Estimates and user responsibility</h2>
        <p>
          Future outputs will be estimates based on supplied inputs and stated
          assumptions. You are responsible for checking measurements, material
          specifications, site suitability and purchase quantities before acting
          on an estimate.
        </p>
      </section>
      <section>
        <h2>Intellectual property</h2>
        <p>
          Site content and original design remain subject to applicable
          intellectual property rights. You may use the site for personal
          project planning and link to its public pages. These terms do not
          transfer ownership of site content or third-party materials.
        </p>
      </section>
      <section>
        <h2>Limitations of liability</h2>
        <p>
          Content may contain errors or be incomplete, and availability is not
          guaranteed. To the extent permitted by applicable law, Fieldplan is
          not responsible for losses arising from reliance on unverified
          estimates or inappropriate use of the site. Nothing in these draft
          terms excludes rights or responsibilities that cannot lawfully be
          excluded.
        </p>
      </section>
      <section>
        <h2>Changes to the service</h2>
        <p>
          Tools and content may change, be corrected or be removed as the site
          develops. These terms should be reviewed and updated with material
          service changes. Operator details and any jurisdiction-specific terms
          must be settled before public launch.
        </p>
      </section>
    </ContentPage>
  );
}
