"use client";

import { useRef } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { CircleCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PhoneChat } from "@/components/ui/PhoneChat";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/lib/hooks";

/** Copy on one side; on the other a gridded panel with a phone whose messages appear as it scrolls into view. */
export function CrmShowcase({
  label,
  title,
  body,
  items,
  cta,
}: {
  label: string;
  title: string;
  body: string;
  items: { title: string; body?: string }[];
  cta?: { href: string; label: string };
}) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const complete = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: phoneRef, offset: ["start 0.9", "center 0.45"] });

  return (
    <Section labelledBy="crm-showcase-title">
      <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <SectionHeader id="crm-showcase-title" label={label} title={title} body={body} />
          <Reveal delay={0.09}>
            <ul className="mt-8 border-t border-line md:mt-10">
              {items.map((item) => (
                <li key={item.title} className="flex gap-3 border-b border-line py-4">
                  <CircleCheck aria-hidden className="size-5 shrink-0 text-blue" />
                  <div>
                    <p className="text-body font-semibold text-ink">{item.title}</p>
                    {item.body && <p className="mt-1.5 text-body text-muted">{item.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {cta && (
              <ButtonLink href={cta.href} className="mt-8 w-full sm:w-auto">
                {cta.label}
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <div
          ref={phoneRef}
          className="rounded-md bg-surface px-6 py-10 grid-pattern md:rounded-lg md:py-14"
        >
          <PhoneChat progress={reduce ? complete : scrollYProgress} />
        </div>
      </div>
    </Section>
  );
}
