import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The outcomes as a row of tiles under the heading, so the section fills its
 * width: each tile has its icon and number at the top and its name and one
 * line at the foot. Two across on a tablet, four on a desktop.
 */
export function Benefits({
  id,
  label,
  title,
  accent,
  items,
  tone = "white",
}: {
  id: string;
  label: string;
  title: string;
  /** A phrase from the title to set in the accent colour. */
  accent?: string;
  items: { icon: LucideIcon; title: string; body: string }[];
  tone?: "white" | "surface" | "navy";
}) {
  const onDark = tone === "navy";
  const tile = onDark ? "bg-white/[0.06]" : tone === "surface" ? "bg-white" : "bg-surface";

  return (
    <Section tone={tone} labelledBy={id}>
      <SectionHeader id={id} label={label} title={title} accent={accent} align="left" onDark={onDark} />

      <ul className="mt-12 grid gap-2 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-3">
        {items.map(({ icon: Icon, title, body }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.06} className="h-full">
              <div className={`flex h-full min-h-[12rem] flex-col rounded-lg p-5 md:p-6 lg:min-h-[15rem] ${tile}`}>
                <div className="flex items-start justify-between gap-4">
                  <Icon aria-hidden className={`size-7 shrink-0 ${onDark ? "text-sky" : "text-blue"}`} strokeWidth={1.25} />
                  <span aria-hidden className={`mono-label ${onDark ? "text-white/50" : "text-muted"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={`mt-auto pt-10 text-h5 ${onDark ? "text-white" : "text-navy"}`}>{title}</h3>
                <p className={`mt-2 text-body text-pretty ${onDark ? "text-white/70" : "text-muted"}`}>{body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
