import { ContentPage } from "@/components/layout/content-page";
import { PreviewForm } from "@/components/ui/preview-form";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact Fieldplan | Questions and Feedback",
  "Preview Fieldplan’s contact page for questions, feedback and corrections. Message delivery is not available in this foundation release.",
  "/contact",
);
export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      eyebrow="LET’S MAKE PLANNING CLEARER"
      intro="A future home for your questions, feedback and suggested corrections."
    >
      <p id="contact-status" className="notice">
        This form is a preview. Message delivery is not connected, so nothing
        can be sent or saved. Please do not enter sensitive information.
      </p>
      <PreviewForm
        className="contact-form"
        aria-label="Contact preview"
        aria-describedby="contact-status"
      >
        <div className="field-pair">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            placeholder="What’s on your mind?"
          />
        </div>
        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Share a question or suggestion…"
          />
        </div>
        <Button type="button" disabled aria-describedby="contact-status">
          Send Message — Coming Soon
        </Button>
      </PreviewForm>
    </ContentPage>
  );
}
