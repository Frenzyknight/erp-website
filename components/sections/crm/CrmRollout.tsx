"use client";

import { Check } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollSteps } from "@/components/motion/ScrollSteps";
import { crm } from "@/lib/content";

const columnTitle = "border-b-4 border-ink pb-4 text-title font-black uppercase text-ink";

export function CrmRollout() {
  return (
    <Section labelledBy="rollout-title">
      <SectionHeader
        id="rollout-title"
        label="What you get"
        title="Everything included, live in six steps."
      />

      <div className="mt-14 grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h3 className={columnTitle}>Included in the platform</h3>
          {/* Cells share their borders: the list draws the left edge, each cell its right and bottom. */}
          <ul className="grid border-l-2 border-ink sm:grid-cols-2">
            {crm.features.map((f) => (
              <li key={f} className="flex items-center gap-3 border-b-2 border-r-2 border-ink p-4 text-body font-medium text-ink">
                <span className="grid size-6 shrink-0 place-items-center bg-blue text-white">
                  <Check aria-hidden className="size-4" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="lg:col-span-5">
          <h3 className={columnTitle}>From kick-off to go-live</h3>
          <div className="mt-8">
            <ScrollSteps items={crm.implementation}>
              {(step) => (
                <>
                  <p className="text-body font-bold text-ink">{step.title}</p>
                  <p className="mt-1 text-label uppercase text-muted">{step.phase}</p>
                </>
              )}
            </ScrollSteps>
          </div>
        </div>
      </div>
    </Section>
  );
}
