import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { ToolCard } from "@/components/home/tool-card";
import { ProjectSketch } from "@/components/home/project-sketch";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Landscape Material Calculators & Project Planning Tools",
  "Plan landscaping projects with practical calculators for gravel, mulch, soil and other materials. Estimate quantities and prepare smarter buying plans.",
  "/",
);

export default function Home() {
  return (
    <>
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
              Practical landscaping calculators for estimating materials,
              planning purchases and reducing unnecessary overbuying.
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
              <span className="status-dot" /> Foundation preview · Calculations
              coming next
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
              A growing collection, built thoughtfully.
            </span>
          </div>
          <div className="tools-grid">
            <ToolCard
              title="Gravel Calculator"
              description="A starting point for driveways, garden paths and patio bases."
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
            <ToolCard
              title="Bag vs Bulk Calculator"
              description="Explore the right purchase format for your project."
              icon="bag"
            />
            <ToolCard
              title="Material Cost Planner"
              description="Bring material needs and purchase planning together."
              icon="plan"
            />
          </div>
        </Container>
      </section>
      <section className="how-section section-space">
        <Container>
          <SectionHeading
            eyebrow="FROM IDEA TO OUTDOORS"
            title="A little planning. A better starting point."
            description="The workflow we’re building toward. Calculations and buying tools are not available yet."
          />
          <div className="steps-grid">
            {[
              ["01", "Measure", "Enter your project dimensions."],
              [
                "02",
                "Calculate",
                "Estimate how much material your project requires.",
              ],
              [
                "03",
                "Plan",
                "Use future buying tools to compare practical purchase options.",
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
              We’re building tools that explain their working, respect
              real-world variability and keep the next step clear.
            </p>
            <Link href="/about" className="text-link mt-6">
              The thinking behind Fieldplan <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="value-list">
            {[
              [
                "Clear calculations",
                "Future results will explain the inputs and assumptions behind an estimate.",
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
                <p>How we’ll approach estimates and their limits.</p>
              </div>
              <Icon name="arrow" size={20} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
