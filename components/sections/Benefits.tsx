import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StripCard } from "@/components/ui/StripCard";
import { Reveal } from "@/components/motion/Reveal";

/** Four outcomes, one card each, rising in one after another. */
export function Benefits({
  id,
  label,
  title,
  items,
  tone = "white",
}: {
  id: string;
  label: string;
  title: string;
  items: { icon: LucideIcon; title: string; body: string }[];
  tone?: "white" | "surface";
}) {
  return (
    <Section tone={tone} labelledBy={id}>
      <SectionHeader id={id} label={label} title={title} />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 xl:grid-cols-4">
        {items.map(({ icon: Icon, title, body }, i) => (
          <li key={title}>
            <Reveal delay={i * 0.09} className="h-full">
              <StripCard
                index={i}
                onSurface={tone === "surface"}
                icon={<Icon aria-hidden className="size-7" strokeWidth={1.5} />}
              >
                <h3 className="mt-10 text-body font-semibold text-ink">{title}</h3>
                <span aria-hidden className="my-4 h-px w-full bg-line" />
                <p className="text-caption text-muted">{body}</p>
              </StripCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
