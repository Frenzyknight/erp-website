import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader, columns } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

/** The heading on the left; on the right the outcomes as an open list, each an icon and its name, then one line. */
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

  return (
    <Section tone={tone} labelledBy={id}>
      <div className={columns}>
        <div className="lg:col-span-5">
          <SectionHeader id={id} label={label} title={title} accent={accent} align="left" onDark={onDark} />
        </div>

        <ul className="flex flex-col gap-10 md:gap-12 lg:col-span-5 lg:col-start-7">
          {items.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06}>
                <h3 className={`flex items-center gap-3 text-h5 ${onDark ? "text-white" : "text-navy"}`}>
                  <Icon aria-hidden className={`size-5 shrink-0 ${onDark ? "text-sky" : "text-blue"}`} strokeWidth={1.5} />
                  {title}
                </h3>
                <p className={`mt-2 max-w-[26rem] text-body text-pretty ${onDark ? "text-white/70" : "text-muted"}`}>
                  {body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
