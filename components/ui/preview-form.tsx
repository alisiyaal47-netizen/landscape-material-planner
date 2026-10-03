"use client";

import type { ComponentProps } from "react";

// Prevents implicit Enter submissions as well as normal form submissions.
// Values remain in the browser; no requests, storage, or calculation handlers.
export function PreviewForm(props: ComponentProps<"form">) {
  return <form {...props} onSubmit={(event) => event.preventDefault()} />;
}
