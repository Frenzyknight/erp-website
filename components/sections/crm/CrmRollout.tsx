"use client";

import {
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Gift,
  Megaphone,
  ReceiptText,
  Star,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollSteps } from "@/components/motion/ScrollSteps";
import { crm } from "@/lib/content";

/* One per entry in crm.features, in the same order. */
const featureIcons: LucideIcon[] = [
  ReceiptText,
  Gift,
  Megaphone,
  UsersRound,
  ClipboardList,
  Star,
  BadgeCheck,
  CalendarClock,
];

const card = "flex h-full flex-col rounded-lg bg-white p-5 md:p-8";
const cardTitle = "flex items-baseline justify-between gap-4 border-b border-line pb-5 text-h5 text-navy";
const count = "mono-label text-muted";

/**
 * Two white cards of equal height on the quiet sheet. The first holds what
 * the platform includes as a grid of tiles that stretch to fill it; the
 * second the six steps to go-live, on a line that fills as the visitor scrolls.
 */
export function CrmRollout() {
  return (
    <Section tone="surface" labelledBy="rollout-title">
      <SectionHeader
        id="rollout-title"
        label="What you get"
        title="Everything included, live in six steps."
        accent="live in six steps."
        align="left"
      />

      <div className="mt-12 grid gap-2 md:mt-20 lg:grid-cols-2 lg:gap-3">
        <Reveal className="h-full">
          <div className={card}>
            <h3 className={cardTitle}>
              Included in the platform
              <span className={count}>{crm.features.length} features</span>
            </h3>
            <ul className="mt-5 grid flex-1 auto-rows-fr grid-cols-2 gap-2 md:mt-6">
              {crm.features.map((feature, i) => {
                const Icon = featureIcons[i];
                return (
                  <li key={feature} className="flex flex-col justify-between gap-5 rounded-md bg-surface p-4">
                    <Icon aria-hidden className="size-5 shrink-0 text-blue" strokeWidth={1.5} />
                    <span className="text-body font-medium text-pretty text-navy">{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <div className={card}>
            <h3 className={cardTitle}>
              From kick-off to go-live
              <span className={count}>{crm.implementation.length} steps</span>
            </h3>
            <div className="mt-6 flex flex-1 flex-col justify-center md:mt-8">
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
