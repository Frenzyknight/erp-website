import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type Tone = "white" | "surface" | "navy";

const fills: Record<Tone, string> = {
  white: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy",
};

/** Shared page gutter, so the navigation, every section and the footer line up. */
export const container = "w-full px-page";

/** The 12-column grid most sections lay out on. The right half starts at column 7. */
export const columns = "grid gap-x-6 gap-y-10 lg:grid-cols-12";

/**
 * A full-width band. "white" and "surface" are light sheets lying on the navy
 * page; "navy" is the page itself showing through. The stylesheet rounds a
 * sheet's corners wherever it meets navy (see "Sheets" in globals.css), so a
 * section only says which tone it is.
 */
export function Section({
  id,
  tone = "white",
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === "navy" ? "dark" : "light"}
      className={`py-20 md:py-28 lg:py-36 ${fills[tone]} ${className}`}
    >
      <div className={container}>{children}</div>
    </section>
  );
}

/** The small capital label that names a section, after a square dot. */
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
    <p className={`mono-label flex items-center gap-2.5 ${onDark ? "text-white" : "text-navy"} ${className}`}>
      <span aria-hidden className="size-1 shrink-0 rounded-[1px] bg-current" />
      {children}
    </p>
  );
}

/**
 * The heading of a section: an optional label, the title in the light display
 * face with one phrase in the accent, and an optional supporting line.
 *
 * "split" puts the label and the supporting line in the left half and the
 * title, large, in the right half. "left" stacks them, for a header that
 * shares its row with something else. "center" is for symmetrical content.
 */
export function SectionHeader({
  id,
  label,
  title,
  accent,
  body,
  align = "split",
  size = "h2",
  onDark = false,
}: {
  id?: string;
  label?: string;
  title: string;
  /** A phrase from the title to set in the accent colour. */
  accent?: string;
  body?: string;
  align?: "split" | "left" | "center" | "side";
  size?: "h2" | "h3";
  onDark?: boolean;
}) {
  const heading = (
    <h2
      id={id}
      className={`text-balance ${size === "h2" ? "text-h2" : "text-h3"} ${onDark ? "text-white" : "text-navy"}`}
    >
      <SplitText text={title} accent={accent} accentClass={onDark ? "text-sky" : "text-blue"} />
    </h2>
  );
  const eyebrow = label && (
    <Reveal>
      <Eyebrow onDark={onDark}>{label}</Eyebrow>
    </Reveal>
  );

  if (align === "split") {
    return (
      <div className={columns}>
        <div className="flex flex-col gap-5 lg:col-span-5">
          {eyebrow}
          {body && (
            <Reveal delay={0.1}>
              <p className={`max-w-[23rem] text-md font-medium text-pretty ${onDark ? "text-white" : "text-navy"}`}>
                {body}
              </p>
            </Reveal>
          )}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">{heading}</div>
      </div>
    );
  }

  if (align === "side") {
    return (
      <div className={`${columns} lg:items-end`}>
        <div className="flex flex-col gap-5 md:gap-6 lg:col-span-7">
          {eyebrow}
          {heading}
        </div>
        {body && (
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className={`max-w-[26rem] text-lead text-pretty ${onDark ? "text-white/70" : "text-muted"}`}>{body}</p>
          </Reveal>
        )}
      </div>
    );
  }

  const centered = align === "center";

  return (
    <div className={`flex flex-col gap-5 md:gap-6 ${centered ? "items-center text-center" : "items-start"}`}>
      {eyebrow}
      <div className={centered ? "max-w-4xl" : "max-w-3xl"}>{heading}</div>
      {body && (
        <Reveal delay={0.1}>
          <p className={`max-w-[34rem] text-lead text-pretty ${onDark ? "text-white/70" : "text-muted"}`}>{body}</p>
        </Reveal>
      )}
    </div>
  );
}
