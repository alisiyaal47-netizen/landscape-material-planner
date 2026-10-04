import { ContentPage } from "@/components/layout/content-page";
import { ButtonLink } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Fieldplan",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ContentPage
      title="This path doesn’t lead anywhere yet."
      eyebrow="PAGE NOT FOUND"
      intro="The page may have moved, or the tool may still be in the plans."
    >
      <ButtonLink href="/">Back to home</ButtonLink>
    </ContentPage>
  );
}
