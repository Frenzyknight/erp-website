import { CircleCheck, CircleX } from "lucide-react";
import { Carousel } from "@/components/ui/Carousel";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { crm } from "@/lib/content";

const card = "flex h-full flex-col rounded-lg p-5 md:p-8";

/**
 * Two cards set close together: today on the quiet surface, the opportunity on navy. Their points run as rows
 * between hairlines. On a phone the pair is swiped through, from today to the opportunity.
 */
export function CrmCompare() {
  return (
    <Section labelledBy="crm-compare-title">
      <SectionHeader
        id="crm-compare-title"
        label="Where you are today"
        title="Your billing software works. What happens after the bill does not."
        accent="What happens after the bill does not."
        body="Customer data and billing already run well. Post-sales engagement on WhatsApp is still manual, untracked and easy to forget."
      />

      <Carousel
        label="Today and the opportunity"
        className="mt-12 md:mt-20"
        track="md:grid md:grid-cols-2 md:gap-2 lg:gap-3"
      >
        <Reveal className="h-full">
          <div className={`${card} bg-surface`}>
            <h3 className="text-h4 text-navy">Today</h3>
            <ul className="mt-8 border-t border-line md:mt-10">
              {crm.today.map((t) => (
                <li key={t.title} className="flex gap-4 border-b border-line py-5">
                  <CircleX aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.5} />
                  <div>
                    <p className="text-body font-medium text-navy">{t.title}</p>
                    <p className="mt-1.5 text-body text-muted">{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <div className={`${card} bg-navy`}>
            <h3 className="text-h4 text-white">The opportunity</h3>
            <ul className="mt-8 border-t border-white/20 md:mt-10">
              {crm.opportunity.map((o) => (
                <li key={o} className="flex gap-4 border-b border-white/20 py-5">
                  <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-sky" strokeWidth={1.5} />
                  <p className="text-body text-white">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Carousel>
    </Section>
  );
}
