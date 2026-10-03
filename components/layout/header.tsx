"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

const links = [
  ["Tools", "/#tools"],
  ["Guides", "/#guides"],
  ["Methodology", "/methodology"],
  ["About", "/about"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link
          href="/"
          aria-label="Fieldplan home"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">
            <Icon name="leaf" />
          </span>
          Fieldplan<span className="brand-dot">.</span>
        </Link>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={`primary-nav ${open ? "is-open" : ""}`}
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/gravel-calculator"
            className="nav-tool"
            onClick={() => setOpen(false)}
          >
            Gravel Calculator <Icon name="arrow" size={17} />
          </Link>
        </nav>
      </Container>
    </header>
  );
}
