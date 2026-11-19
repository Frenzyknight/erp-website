import { Check, X } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { crm } from "@/lib/content";

/** Two panels sharing one rule: today on textured grey, the opportunity inverted to navy. */
export function CrmCompare() {
  return (
    <Section labelledBy="crm-compare-title">
      <SectionHeader
        id="crm-compare-title"
        label="Where you are today"
        title="Your billing software works. What happens after the bill does not."
        body="Customer data and billing already run well. Post-sales engagement on WhatsApp is still manual, untracked and easy to forget."
      />

      <Reveal delay={0.05} className="mt-14 grid border-4 border-ink md:grid-cols-2">
        <div className="border-b-4 border-ink bg-surface p-8 swiss-diagonal md:border-b-0 md:border-r-4 lg:p-12">
          <h3 className="text-title font-black uppercase text-ink">Today</h3>
          <ul className="mt-8 space-y-6">
            {crm.today.map((t) => (
              <li key={t.title} className="flex gap-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center border-2 border-ink bg-white text-ink">
                  <X aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="text-body font-bold text-ink">{t.title}</p>
                  <p className="mt-1 text-body text-slate">{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-navy p-8 lg:p-12">
          <h3 className="text-title font-black uppercase text-white">The opportunity</h3>
          <ul className="mt-8 space-y-6">
            {crm.opportunity.map((o) => (
              <li key={o} className="flex gap-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-blue text-white">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
                <p className="text-body font-medium text-white">{o}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
