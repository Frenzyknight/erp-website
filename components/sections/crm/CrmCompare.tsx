import { CircleCheck, CircleX } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { crm } from "@/lib/content";

const card = "flex h-full flex-col gap-5 rounded-md p-6 md:rounded-lg md:p-8";

/** Two cards side by side: today on the quiet surface, the opportunity on navy. The navy one grows a little on hover. */
export function CrmCompare() {
  return (
    <Section tone="line" labelledBy="crm-compare-title">
      <SectionHeader
        id="crm-compare-title"
        label="Where you are today"
        title="Your billing software works. What happens after the bill does not."
        body="Customer data and billing already run well. Post-sales engagement on WhatsApp is still manual, untracked and easy to forget."
        align="center"
      />

      <div className="mx-auto mt-8 grid max-w-[1040px] gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
        <Reveal className="h-full">
          <div className={`${card} bg-surface`}>
            <h3 className="text-h5 text-navy">Today</h3>
            <span aria-hidden className="h-px w-full bg-line" />
            <ul className="space-y-4">
              {crm.today.map((t) => (
                <li key={t.title} className="flex gap-3">
                  <CircleX aria-hidden className="size-5 shrink-0 text-muted" />
                  <div>
                    <p className="text-body font-semibold text-ink">{t.title}</p>
                    <p className="mt-1.5 text-body text-muted">{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <div className={`${card} bg-navy transition-transform duration-1000 ease-rise lg:hover:scale-[1.04]`}>
            <h3 className="text-h5 text-white">The opportunity</h3>
            <span aria-hidden className="h-px w-full bg-white/60" />
            <ul className="space-y-4">
              {crm.opportunity.map((o) => (
                <li key={o} className="flex gap-3">
                  <CircleCheck aria-hidden className="size-5 shrink-0 text-sky" />
                  <p className="text-body text-white">{o}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
