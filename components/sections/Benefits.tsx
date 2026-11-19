import type { LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

/** Four cells that share their borders. Each one inverts to blue on hover. */
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
    <Section tone={tone} pattern="dots" labelledBy={id}>
      <SectionHeader id={id} label={label} title={title} />
      <Reveal delay={0.05}>
        <ul className="mt-14 grid border-l-4 border-t-4 border-ink sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="group border-b-4 border-r-4 border-ink bg-white p-8 transition-colors duration-150 ease-linear hover:bg-blue"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center border-2 border-ink text-ink transition-colors duration-150 ease-linear group-hover:border-white group-hover:text-white">
                  <Icon aria-hidden className="size-5" strokeWidth={2} />
                </span>
                <span aria-hidden className="text-label text-blue transition-colors duration-150 ease-linear group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-12 text-title font-bold uppercase text-ink transition-colors duration-150 ease-linear group-hover:text-white">
                {title}
              </h3>
              <p className="mt-3 text-body text-slate transition-colors duration-150 ease-linear group-hover:text-white">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
