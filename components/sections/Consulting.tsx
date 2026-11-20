import {
  Boxes,
  ChartColumn,
  ClipboardList,
  Factory,
  SearchCheck,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { consultingServices } from "@/lib/content";

/* One icon per service, in the order the services are listed. */
const icons: LucideIcon[] = [Workflow, ClipboardList, Boxes, Factory, ShoppingCart, SearchCheck, ChartColumn];

/** The seven services as white cards, and an eighth navy card that asks for the first conversation. */
export function Consulting() {
  return (
    <Section id="consulting" tone="line" labelledBy="consulting-title">
      <SectionHeader
        id="consulting-title"
        label="Consulting"
        title="Not ready for software yet? Start with the process."
        body="Many engagements begin here. We review how the work gets done, remove what slows it down, and prepare the business for what comes next."
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 xl:grid-cols-4">
        {consultingServices.map((s, i) => {
          const Icon = icons[i];
          return (
            <li key={s.title}>
              <Reveal delay={(i % 4) * 0.09} className="h-full">
                <div className="group flex h-full flex-col items-start rounded-md bg-white p-6 transition-transform duration-500 ease-swift hover:scale-[1.03]">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-surface text-navy transition-colors duration-500 ease-swift group-hover:bg-blue group-hover:text-white">
                    <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-8 text-body font-semibold text-ink">{s.title}</h3>
                  <span aria-hidden className="my-4 h-px w-full bg-line" />
                  <p className="text-caption text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          );
        })}

        <li>
          <Reveal delay={0.27} className="h-full">
            <div className="flex h-full flex-col items-start justify-between gap-8 rounded-md bg-navy p-6">
              <p className="text-h5 text-balance text-white">Start with a gap assessment.</p>
              <ButtonLink href="#contact" variant="light" className="w-full sm:w-auto">
                Ask for a gap assessment
              </ButtonLink>
            </div>
          </Reveal>
        </li>
      </ul>
    </Section>
  );
}
