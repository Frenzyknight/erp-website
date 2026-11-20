"use client";

import { useRef } from "react";
import { useMotionValue, useScroll } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader, columns } from "@/components/ui/Section";
import { PhoneChat } from "@/components/ui/PhoneChat";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/lib/hooks";

/**
 * Copy on one side: the heading, then the points as numbered rows between
 * hairlines. On the other a pale dotted panel with a phone whose messages
 * appear as it scrolls into view.
 */
export function CrmShowcase({
  label,
  title,
  accent,
  body,
  items,
  cta,
}: {
  label: string;
  title: string;
  accent?: string;
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
      <div className={`${columns} items-center`}>
        <div className="lg:col-span-6">
          <SectionHeader
            id="crm-showcase-title"
            label={label}
            title={title}
            accent={accent}
            body={body}
            align="left"
          />
          <Reveal delay={0.09}>
            <ol className="mt-10 border-t border-line md:mt-14">
              {items.map((item, i) => (
                <li key={item.title} className="flex gap-5 border-b border-line py-5">
                  <span aria-hidden className="mono-label w-6 shrink-0 pt-1.5 text-blue">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-h5 text-navy">{item.title}</p>
                    {item.body && <p className="mt-2 max-w-[34rem] text-body text-muted">{item.body}</p>}
                  </div>
                </li>
              ))}
            </ol>
            {cta && (
              <ButtonLink href={cta.href} variant="dark" className="mt-8 w-full sm:w-auto">
                {cta.label}
              </ButtonLink>
            )}
          </Reveal>
        </div>

        <div
          ref={phoneRef}
          className="rounded-lg bg-line px-6 py-10 dot-grid [--dot-gap:28px] [--dot:rgb(11_31_58/0.16)] md:py-14 lg:col-span-5 lg:col-start-8"
        >
          <PhoneChat progress={reduce ? complete : scrollYProgress} />
        </div>
      </div>
    </Section>
  );
}
