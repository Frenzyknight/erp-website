"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { ScrollSteps } from "@/components/motion/ScrollSteps";
import { process } from "@/lib/content";

export function Process() {
  return (
    <Section tone="surface" pattern="dots" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        label="How we work"
        title="Understand first. Improve next. Build last."
        body="Technology follows the design, never the reverse."
      />
      <div className="mt-16">
        <ScrollSteps items={process} horizontal>
          {(step, i) => (
            <>
              <p aria-hidden className="text-display text-ink">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-title font-bold uppercase text-ink">{step.title}</h3>
              <p className="mt-2 max-w-sm text-body text-slate">{step.body}</p>
            </>
          )}
        </ScrollSteps>
      </div>
    </Section>
  );
}
