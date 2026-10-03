import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return <button className={`button ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : ""}`}
    >
      {children}
    </Link>
  );
}
