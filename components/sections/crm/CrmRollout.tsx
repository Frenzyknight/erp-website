"use client";

import { Check } from "lucide-react";
import { tagClass } from "@/components/ui/Chip";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollSteps } from "@/components/motion/ScrollSteps";
import { crm } from "@/lib/content";

const card = "h-full rounded-lg bg-white p-5 md:p-8";
const cardTitle = "border-b border-line pb-5 text-h5 text-navy";

/** Two white cards on the quiet sheet: what the platform includes, as tags, and the six steps to go-live on a line that fills. */
export function CrmRollout() {
  return (
    <Section tone="surface" labelledBy="rollout-title">
      <SectionHeader
        id="rollout-title"
        label="What you get"
        title="Everything included, live in six steps."
        accent="live in six steps."
      />

      <div className="mt-12 grid gap-2 md:mt-20 lg:grid-cols-2 lg:gap-3">
        <Reveal className="h-full">
          <div className={card}>
            <h3 className={cardTitle}>Included in the platform</h3>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {crm.features.map((f) => (
                <li key={f} className={`${tagClass} bg-surface text-navy`}>
                  <Check aria-hidden className="size-4 shrink-0 text-blue" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <div className={card}>
            <h3 className={cardTitle}>From kick-off to go-live</h3>
            <div className="mt-6">
              <ScrollSteps items={crm.implementation}>
                {(step) => (
                  <>
                    <p className="text-body font-medium text-navy">{step.title}</p>
                    <p className="mono-label mt-1.5 text-muted">{step.phase}</p>
                  </>
                )}
              </ScrollSteps>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
