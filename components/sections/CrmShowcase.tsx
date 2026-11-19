"use client";

import { useRef } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PhoneChat } from "@/components/ui/PhoneChat";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/lib/hooks";

/** Copy across seven columns, and in the other five a phone whose messages appear as it scrolls into view. */
export function CrmShowcase({
  label,
  title,
  body,
  items,
  cta,
  tone = "surface",
}: {
  label: string;
  title: string;
  body: string;
  items: { title: string; body?: string }[];
  cta?: { href: string; label: string };
  tone?: "white" | "surface";
}) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const complete = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: phoneRef, offset: ["start 0.9", "center 0.45"] });

  return (
    <Section tone={tone} labelledBy="crm-showcase-title">
      <div className="grid items-center gap-x-12 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeader id="crm-showcase-title" label={label} title={title} body={body} layout="stacked" />
          <Reveal delay={0.05}>
            <ul className="mt-10 border-b-4 border-ink">
              {items.map((item) => (
                <li key={item.title} className="flex gap-4 border-t-4 border-ink py-5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-blue text-white">
                    <Check aria-hidden className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-body font-bold text-ink">{item.title}</p>
                    {item.body && <p className="mt-1 text-body text-slate">{item.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {cta && (
              <ButtonLink href={cta.href} variant="secondary" arrow className="mt-9 w-full sm:w-auto">
                {cta.label}
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <div ref={phoneRef} className="lg:col-span-5">
          <PhoneChat progress={reduce ? complete : scrollYProgress} />
        </div>
      </div>
    </Section>
  );
}
