"use client";

import { Check } from "lucide-react";
import { tagClass } from "@/components/ui/Chip";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollSteps } from "@/components/motion/ScrollSteps";
import { crm } from "@/lib/content";

const card = "h-full rounded-md bg-white p-6 md:rounded-lg md:p-8";
const cardTitle = "border-b border-line pb-5 text-h5 text-navy";

/** Two white cards: what the platform includes, as pills, and the six steps to go-live on a line that fills. */
export function CrmRollout() {
  return (
    <Section tone="line" labelledBy="rollout-title">
      <SectionHeader id="rollout-title" label="What you get" title="Everything included, live in six steps." />

      <div className="mt-8 grid gap-4 md:mt-12 md:gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className={card}>
            <h3 className={cardTitle}>Included in the platform</h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {crm.features.map((f) => (
                <li key={f} className={`${tagClass} bg-surface text-ink`}>
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
                    <p className="text-body font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-caption text-muted">{step.phase}</p>
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
