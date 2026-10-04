import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { ToolCard } from "@/components/home/tool-card";
import { ProjectSketch } from "@/components/home/project-sketch";
import { pageMetadata } from "@/lib/site";
import { StructuredData } from "@/components/seo/structured-data";

export const metadata = pageMetadata(
  "Fieldplan | Landscape Material & Purchase Planning",
  "Plan an outdoor project with Fieldplan. Start with our free gravel tool for quantities, estimated weight, bag or bulk costs, and a plan you can copy or print.",
  "/",
);

export default function Home() {
  return (
    <>
      <StructuredData />
      <section className="hero">
        <Container className="hero-grid">
          <div>
            <p className="eyebrow">
              <span className="little-line" /> LESS GUESSWORK. MORE GROUNDWORK.
            </p>
            <h1>
              Plan Your Project.
              <br />
              <span>Know What to Buy.</span>
            </h1>
            <p className="hero-description">
              Start with gravel: estimate materials for your space, compare
              bag and bulk prices you enter, and prepare a plan you can copy or print.
            </p>
            <div className="hero-actions">
              <ButtonLink href="/gravel-calculator">
                Try Gravel Calculator <Icon name="arrow" size={18} />
              </ButtonLink>
              <ButtonLink href="/methodology" secondary>
                How Our Calculations Work
              </ButtonLink>
            </div>
            <p className="hero-note">
              <span className="status-dot" /> Gravel planning tool · Free to
              use
            </p>
          </div>
          <ProjectSketch />
        </Container>
      </section>
      <div className="principles-strip">
        <Container>
          <span>
            <Icon name="ruler" size={19} />
            Made for everyday projects
          </span>
          <span>
            <Icon name="layers" size={19} />
            US & metric-friendly foundation
          </span>
          <span>
            <Icon name="plan" size={19} />
            Transparent by design
          </span>
        </Container>
      </div>
      <section id="tools" className="section-space">
        <Container>
          <div className="section-title-row">
            <SectionHeading
              eyebrow="THE TOOL SHED"
              title="Landscape Planning Tools"
              description="Start with your space. Find a clearer path to your material list."
            />
            <span className="small-note">
              Available now: gravel. Other materials are planned.
            </span>
          </div>
          <div className="tools-grid">
            <ToolCard
              title="Gravel Calculator"
              description="Volume, estimated weight and bag vs bulk planning for driveways, paths and patio bases."
              icon="gravel"
              href="/gravel-calculator"
            />
            <ToolCard
              title="Mulch Calculator"
              description="Plan the finishing layer for garden beds and borders."
              icon="leaf"
            />
            <ToolCard
              title="Topsoil Calculator"
              description="Prepare for new lawns, planting areas and garden projects."
              icon="layers"
            />
          </div>
        </Container>
      </section>
      <section className="how-section section-space">
        <Container>
          <SectionHeading
            eyebrow="FROM IDEA TO OUTDOORS"
            title="A little planning. A better starting point."
            description="From measurements to a gravel buying plan, with the assumptions visible at each step."
          />
          <div className="steps-grid">
            {[
              ["01", "Measure", "Enter your project dimensions."],
              [
                "02",
                "Calculate",
                "Estimate volume and weight after allowance and existing stock.",
              ],
              [
                "03",
                "Plan",
                "Compare your entered prices, check leftovers, then copy or print the plan.",
              ],
            ].map(([number, title, text]) => (
              <article key={number} className="step">
                <span className="step-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="section-space">
        <Container className="values-grid">
          <div>
            <SectionHeading
              eyebrow="PRACTICAL BY NATURE"
              title="Understand the estimate. Make a more informed plan."
            />
            <p className="muted mt-5">
              Fieldplan shows how measurements become quantities and how your
              entered prices affect the buying comparison. Supplier specifications
              and on-site conditions still matter.
            </p>
            <Link href="/about" className="text-link mt-6">
              The thinking behind Fieldplan <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="value-list">
            {[
              [
                "Clear calculations",
                "Gravel volume results show the measurements, formula and assumptions behind an estimate.",
              ],
              [
                "Transparent methodology",
                "A place for formulas, conversions and limitations, in plain language.",
              ],
              [
                "US and metric-friendly foundation",
                "Familiar unit choices for projects at home and further afield.",
              ],
              [
                "Built for real landscaping projects",
                "Thoughtful starting points for paths, driveways, gardens and patio bases.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="value-item">
                <span>
                  <Icon name="check" size={20} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section id="guides" className="guides-section section-space">
        <Container>
          <SectionHeading
            eyebrow="BEFORE YOU BREAK GROUND"
            title="Start with the basics"
            description="Short, practical notes to help you prepare your project."
          />
          <div className="guides-grid">
            <Link
              href="/gravel-calculator#measurement-guide"
              className="guide-card"
            >
              <Icon name="ruler" />
              <div>
                <h3>Measure your project</h3>
                <p>What to record before planning your materials.</p>
              </div>
              <Icon name="arrow" size={20} />
            </Link>
            <Link href="/methodology" className="guide-card">
              <Icon name="plan" />
              <div>
                <h3>Know the assumptions</h3>
                <p>Formulas, supplier density and the limits of entered costs.</p>
              </div>
              <Icon name="arrow" size={20} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
