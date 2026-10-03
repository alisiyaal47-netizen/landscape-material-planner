import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";

export function ToolCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: IconName;
  href?: string;
}) {
  return (
    <article className={`tool-card ${href ? "tool-card-featured" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="tool-icon">
          <Icon name={icon} size={28} />
        </span>
        <span className="status-badge">
          {href ? "Volume calculator" : "Coming Soon"}
        </span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {href ? (
        <>
          <p className="tool-status">
            Rectangle and circle volumes, with independent measurement units.
          </p>
          <Link href={href} className="text-link">
            Explore calculator <Icon name="arrow" size={18} />
          </Link>
        </>
      ) : (
        <span className="future-note">
          In the plans <span aria-hidden="true">↗</span>
        </span>
      )}
    </article>
  );
}
