import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}

export function ContentPage({
  title,
  eyebrow = "THE FIELDPLAN APPROACH",
  intro,
  children,
  draft = false,
}: {
  title: string;
  eyebrow?: string;
  intro: string;
  children: ReactNode;
  draft?: boolean;
}) {
  return (
    <Container className="content-page">
      <Breadcrumb title={title} />
      <div className="reading-width">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
        {draft && (
          <p className="notice">
            Foundation draft · Updated October 3, 2026. Review this draft before
            public launch and whenever the service changes.
          </p>
        )}
        <div className="prose-sections">{children}</div>
      </div>
    </Container>
  );
}
