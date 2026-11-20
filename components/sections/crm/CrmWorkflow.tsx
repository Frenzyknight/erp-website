"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bot, Receipt, RefreshCw, Send, UserRound, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { crm } from "@/lib/content";
import { useReducedMotionSafe } from "@/lib/hooks";

const icons: LucideIcon[] = [Receipt, RefreshCw, Bot, Send, UserRound];
const lastIndex = crm.workflow.length - 1;

/** Five stages joined by a line; it fills, and a small marker travels along it, as the visitor scrolls. */
export function CrmWorkflow() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const travel = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(lastIndex, Math.floor(v * lastIndex + 0.08)));
  });

  const step = reduce ? lastIndex : reached;
  const fill = "absolute inset-0 rounded-full bg-blue";
  const marker = "absolute size-3 rounded-full bg-blue ring-4 ring-surface";

  return (
    <Section id="how-it-works" tone="surface" pattern labelledBy="workflow-title">
      <SectionHeader
        id="workflow-title"
        label="How it works"
        title="What happens after every bill"
        body="The agent connects to your existing billing and customer data, and handles the rest."
        align="center"
      />

      {/* Each stage is a 4rem circle, so both lines run through the centre of the circles (2rem in). */}
      <ol ref={ref} className="relative mt-10 grid gap-8 md:mt-16 md:grid-cols-5 md:gap-0">
        {/* Vertical line on small screens */}
        <span aria-hidden className="absolute bottom-8 left-[1.875rem] top-8 w-1 rounded-full bg-mist/50 md:hidden">
          {reduce ? (
            <span className={fill} />
          ) : (
            <>
              <motion.span style={{ scaleY: scrollYProgress }} className={`${fill} origin-top`} />
              <motion.span style={{ top: travel }} className={`${marker} left-1/2 -translate-x-1/2 -translate-y-1/2`} />
            </>
          )}
        </span>
        {/* Horizontal line on wide screens, running from the first circle to the last */}
        <span
          aria-hidden
          className="absolute left-8 right-[calc(20%-2rem)] top-[1.875rem] hidden h-1 rounded-full bg-mist/50 md:block"
        >
          {reduce ? (
            <span className={fill} />
          ) : (
            <>
              <motion.span style={{ scaleX: scrollYProgress }} className={`${fill} origin-left`} />
              <motion.span style={{ left: travel }} className={`${marker} top-1/2 -translate-x-1/2 -translate-y-1/2`} />
            </>
          )}
        </span>

        {crm.workflow.map((w, i) => {
          const Icon = icons[i];
          const on = i <= step;
          return (
            <li key={w.title} className="relative flex items-center gap-5 md:flex-col md:items-start md:gap-0 md:pr-6">
              <span
                className={`grid size-16 shrink-0 place-items-center rounded-full text-white transition-colors duration-500 ease-out ${
                  on ? "bg-navy" : "bg-mist"
                }`}
              >
                <Icon aria-hidden className="size-7" strokeWidth={1.5} />
              </span>
              <div className="md:mt-6">
                <p className="text-caption font-semibold text-muted">Step {i + 1}</p>
                <h3 className="mt-1.5 text-md font-medium text-navy">{w.title}</h3>
                <p className="mt-1.5 text-body text-muted">{w.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
