"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bot, Receipt, RefreshCw, Send, UserRound, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { crm } from "@/lib/content";
import { useReducedMotionSafe } from "@/lib/hooks";

const icons: LucideIcon[] = [Receipt, RefreshCw, Bot, Send, UserRound];
const lastIndex = crm.workflow.length - 1;

/** Five stages joined by a thick rule; a square marker travels along it as the visitor scrolls. */
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
  const fill = "absolute inset-0 bg-blue";
  const marker = "absolute size-3 bg-blue ring-4 ring-white";

  return (
    <Section id="how-it-works" labelledBy="workflow-title">
      <SectionHeader
        id="workflow-title"
        label="How it works"
        title="What happens after every bill"
        body="The agent connects to your existing billing and customer data, and handles the rest."
      />

      {/* Each stage is 3.5rem square, so both rules run through the centre of the squares (1.75rem in). */}
      <ol ref={ref} className="relative mt-16 grid gap-8 md:grid-cols-5 md:gap-0">
        {/* Vertical rule on small screens */}
        <span aria-hidden className="absolute bottom-7 left-[1.625rem] top-7 w-1 bg-ink md:hidden">
          {reduce ? (
            <span className={fill} />
          ) : (
            <>
              <motion.span style={{ scaleY: scrollYProgress }} className={`${fill} origin-top`} />
              <motion.span style={{ top: travel }} className={`${marker} left-1/2 -translate-x-1/2 -translate-y-1/2`} />
            </>
          )}
        </span>
        {/* Horizontal rule on wide screens, running from the first square to the last */}
        <span
          aria-hidden
          className="absolute left-7 right-[calc(20%-1.75rem)] top-[1.625rem] hidden h-1 bg-ink md:block"
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
                className={`grid size-14 shrink-0 place-items-center border-4 transition-colors duration-150 ease-linear ${
                  on ? "border-blue bg-blue text-white" : "border-ink bg-white text-ink"
                }`}
              >
                <Icon aria-hidden className="size-5" strokeWidth={2} />
              </span>
              <div className="md:mt-6">
                <p aria-hidden className="text-label text-blue">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-body font-bold uppercase text-ink">{w.title}</h3>
                <p className="mt-1 text-small text-slate">{w.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
