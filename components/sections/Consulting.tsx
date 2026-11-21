import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ChartColumn,
  ClipboardList,
  Factory,
  SearchCheck,
  ShoppingCart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Carousel } from "@/components/ui/Carousel";
import { Section, SectionHeader, columns } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { consultingServices } from "@/lib/content";

/* One icon per service, in the order the services are listed. */
const icons: LucideIcon[] = [Workflow, ClipboardList, Boxes, Factory, ShoppingCart, SearchCheck, ChartColumn];

const row = "flex h-full gap-4 border-b border-line py-6";

/* The row that asks for the first conversation. */
const invitation = (
  <Link
    href="#contact"
    className={`${row} group items-center justify-between text-blue transition-colors duration-200 ease-out hover:text-blue-deep`}
  >
    <span className="font-display text-h5">Start with a gap assessment.</span>
    <ArrowRight
      aria-hidden
      strokeWidth={1.5}
      className="size-5 shrink-0 transition-transform duration-300 ease-swift group-hover:translate-x-1"
    />
  </Link>
);

/**
 * The heading on the left, staying on screen from "lg" while the list beside
 * it scrolls. The seven services run in two columns of rows between
 * hairlines, and an eighth row, in the accent, asks for the first conversation.
 * On a phone the services are swiped through two at a time.
 */
export function Consulting() {
  return (
    <Section id="consulting" tone="surface" labelledBy="consulting-title">
      <div className={columns}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SectionHeader
              id="consulting-title"
              label="Consulting"
              title="Not ready for software yet? Start with the process."
              accent="Start with the process."
              body="Many engagements begin here. We review how the work gets done, remove what slows it down, and prepare the business for what comes next."
              align="left"
              size="h3"
            />
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Carousel
            as="ul"
            label="Consulting services"
            until="sm"
            rows={2}
            gap="loose"
            track="sm:grid sm:grid-cols-2 sm:gap-x-6 sm:border-t sm:border-line"
          >
            {consultingServices.map((s, i) => {
              const Icon = icons[i];
              return (
                // In a slide the upper row of each pair draws the hairline the list's top edge draws elsewhere.
                <li key={s.title} className={i % 2 === 0 ? "max-sm:border-t max-sm:border-line" : ""}>
                  <Reveal delay={(i % 2) * 0.06} className={row}>
                    <Icon aria-hidden className="mt-1 size-5 shrink-0 text-blue" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-h5 text-navy">{s.title}</h3>
                      <p className="mt-2 text-caption text-pretty text-muted">{s.body}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}

            <li className="max-sm:hidden">
              <Reveal delay={0.06} className="h-full">
                {invitation}
              </Reveal>
            </li>
          </Carousel>

          {/* On a phone the invitation stays put under the slides, so it is never the last thing to be swiped to. */}
          <Reveal className="mt-6 border-t border-line sm:hidden">{invitation}</Reveal>
        </div>
      </div>
    </Section>
  );
}
