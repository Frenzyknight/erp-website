import { Reveal } from "@/components/motion/Reveal";

type Tone = "white" | "surface" | "navy";
type Pattern = "grid" | "dots" | "diagonal";

const patterns: Record<Pattern, string> = {
  grid: "swiss-grid-pattern",
  dots: "swiss-dots",
  diagonal: "swiss-diagonal",
};

/** Shared page gutter, so the navigation, every section and the footer sit on the same grid. */
export const container = "mx-auto max-w-7xl px-6 lg:px-12";

/** A full-width band closed by a thick rule. "surface" bands carry a texture; white and navy never do. */
export function Section({
  id,
  tone = "white",
  pattern = "grid",
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  pattern?: Pattern;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const fill = tone === "navy" ? "bg-navy" : tone === "surface" ? `bg-surface ${patterns[pattern]}` : "";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`border-b-4 border-ink py-20 sm:py-28 ${fill} ${className}`}
    >
      <div className={container}>{children}</div>
    </section>
  );
}

/** The numbered label that opens a section. The number comes from a CSS counter, so it follows page order. */
export function SectionLabel({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p className={`section-label text-label uppercase ${onDark ? "text-sky" : "text-blue"} ${className}`}>
      {children}
    </p>
  );
}

/**
 * "split" sets the title across eight columns with the supporting line in the
 * remaining four. "stacked" is for headers that sit inside a narrower column.
 */
export function SectionHeader({
  id,
  label,
  title,
  body,
  layout = "split",
  onDark = false,
}: {
  id?: string;
  label?: string;
  title: string;
  body?: string;
  layout?: "split" | "stacked";
  onDark?: boolean;
}) {
  const split = layout === "split";

  return (
    <Reveal className={split ? "grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end" : ""}>
      <div className={split ? "lg:col-span-8" : ""}>
        {label && (
          <SectionLabel onDark={onDark} className="mb-5">
            {label}
          </SectionLabel>
        )}
        <h2
          id={id}
          className={`text-heading uppercase ${split ? "text-balance" : ""} ${onDark ? "text-white" : "text-ink"}`}
        >
          {title}
        </h2>
      </div>
      {body && (
        <p
          className={`max-w-md text-pretty text-title ${split ? "lg:col-span-4" : "mt-6"} ${
            onDark ? "text-mist" : "text-slate"
          }`}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}
