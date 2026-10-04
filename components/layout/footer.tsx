import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <div>
            <Link href="/" className="brand">
              <Icon name="leaf" />
              Fieldplan.
            </Link>
            <p className="mt-4 max-w-xs text-sm">
              A clearer starting point for your next outdoor project.
            </p>
            <p className="mt-3 text-xs">
              Gravel quantities and buying plans. More materials are planned.
            </p>
          </div>
          <nav aria-label="Tools and resources">
            <p className="footer-label">PLAN YOUR PROJECT</p>
            <Link href="/gravel-calculator">Gravel Calculator</Link>
            <Link href="/methodology">Methodology</Link>
          </nav>
          <nav aria-label="About Fieldplan">
            <p className="footer-label">GET TO KNOW US</p>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Fieldplan</p>
          <nav aria-label="Legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </nav>
          <span>Thoughtful plans. Better outdoor spaces.</span>
        </div>
      </Container>
    </footer>
  );
}
