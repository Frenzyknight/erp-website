import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type Tone = "white" | "surface" | "line" | "navy";

const fills: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  line: "bg-line",
  navy: "bg-navy",
};

/** Shared page gutter, so the navigation, every section and the footer line up. */
export const container = "w-full px-page";

/**
 * A full-width band. Bands are told apart by their fill alone: there are no
 * rules between them. "lifted" rounds the top corners and pulls the band up
 * over the one before it, which is how a navy band enters the page.
 */
export function Section({
  id,
  tone = "white",
  pattern = false,
  lifted = false,
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  /** Tiles the faint star mark behind the content. For "surface" bands. */
  pattern?: boolean;
  lifted?: boolean;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`py-16 md:py-20 lg:py-30 ${fills[tone]} ${pattern ? "mark-pattern" : ""} ${
        lifted ? "relative -mt-8 rounded-t-2xl md:-mt-10 md:rounded-t-3xl" : ""
      } ${className}`}
    >
      <div className={container}>{children}</div>
    </section>
  );
}

/** The small pill that names a section or a product. Outlined on navy and blue, filled with the accent elsewhere. */
export function Eyebrow({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center rounded-full font-semibold ${
        onDark ? "border border-white px-5 py-[7px] text-sub text-white" : "bg-blue px-4 py-1.5 text-caption text-white"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/**
 * The heading of a section: an optional pill, the title, and an optional
 * supporting line in the large muted size. Centred headers sit above
 * symmetrical content; left-aligned ones above grids and lists.
 */
export function SectionHeader({
  id,
  label,
  title,
  body,
  align = "left",
  onDark = false,
}: {
  id?: string;
  label?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  const centered = align === "center";

  return (
    <div className={`flex flex-col gap-4 md:gap-6 ${centered ? "items-center text-center" : "items-start"}`}>
      {label && (
        <Reveal>
          <Eyebrow onDark={onDark}>{label}</Eyebrow>
        </Reveal>
      )}
      <h2 id={id} className={`max-w-5xl text-h2 text-balance ${onDark ? "text-white" : "text-navy"}`}>
        <SplitText text={title} />
      </h2>
      {body && (
        <Reveal delay={0.1}>
          <p className={`max-w-[45rem] text-lead text-pretty ${onDark ? "text-white/70" : "text-muted"}`}>{body}</p>
        </Reveal>
      )}
    </div>
  );
}
