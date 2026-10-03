import Link from "next/link";
import { ContentPage } from "@/components/layout/content-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Privacy Policy Draft | Fieldplan",
  "How the Fieldplan foundation handles data today, and the privacy disclosures that will need updating as new services are introduced.",
  "/privacy-policy",
);
export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      eyebrow="SITE INFORMATION"
      intro="This draft describes the current foundation release and the limits of its data handling."
      draft
    >
      <section>
        <h2>The current site</h2>
        <p>
          This version has no accounts, database, analytics, advertising or
          Google AdSense. The application does not set tracking cookies or use
          browser storage to save project or contact details.
        </p>
      </section>
      <section>
        <h2>Calculator and contact fields</h2>
        <p>
          Values entered in the preview fields remain in the page. The
          calculator does not process or save them, and the contact form does
          not transmit messages. There is no message-delivery service connected.
          Browser features such as autofill are controlled by your browser.
        </p>
      </section>
      <section>
        <h2>Hosting and technical information</h2>
        <p>
          A hosting provider may process technical request information, such as
          an IP address, requested page and browser details, to deliver and
          protect the site. Hosting-specific collection, retention and provider
          details must be reviewed and added before public launch. This draft
          does not claim that no technical data is processed.
        </p>
      </section>
      <section>
        <h2>Updates required before new services</h2>
        <p>
          This policy must be updated when Google Analytics, Google AdSense,
          cookies or consent management are introduced. Any update should
          explain the information collected, purposes, providers, retention and
          available choices. Contact delivery or saved projects will also
          require updated disclosures before activation.
        </p>
      </section>
      <section>
        <h2>Privacy questions and review</h2>
        <p>
          The <Link href="/contact">contact interface</Link> is not operational
          yet. A working privacy contact and operator details must be supplied
          before public launch. This draft makes no claim of full GDPR, CCPA or
          other regulatory compliance.
        </p>
      </section>
    </ContentPage>
  );
}
