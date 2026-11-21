"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
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
import { centreIn } from "@/components/ui/StepTrail";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotionSafe } from "@/lib/hooks";
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

/** The steps in order, grouped under the phase each belongs to. */
const phases = crm.implementation.reduce<{ name: string; steps: { title: string; index: number }[] }[]>(
  (groups, { title, phase }, index) => {
    const last = groups[groups.length - 1];
    if (last?.name === phase) last.steps.push({ title, index });
    else groups.push({ name: phase, steps: [{ title, index }] });
    return groups;
  },
  [],
);
const stepCount = crm.implementation.length;

/** Radius of the bend where the line turns down into the panel. */
const BEND = 24;
/** Length of that bend as a multiple of its radius: a quarter turn drawn as a quadratic curve. */
const BEND_LENGTH = 1.6232;

type Point = { x: number; y: number };

type Line = {
  d: string;
  /** Distance along the line to each step's marker, then to its end at the panel. */
  stops: number[];
};

const px = (n: number) => Math.round(n * 10) / 10;

/**
 * Draws the line through the step markers and on to the panel. Where the
 * steps sit in a row it runs along them, turns down and ends on the panel's
 * status light. Where they are stacked it runs straight down to the panel's
 * top edge.
 */
function buildLine(markers: Point[], light: Point, panelTop: number): Line {
  const first = markers[0];
  const last = markers[markers.length - 1];

  if (Math.abs(last.y - first.y) < 1) {
    const r = Math.min(BEND, (light.x - last.x) / 2, (light.y - first.y) / 2);
    return {
      d: `M${px(first.x)} ${px(first.y)}H${px(light.x - r)}Q${px(light.x)} ${px(first.y)} ${px(light.x)} ${px(first.y + r)}V${px(light.y)}`,
      stops: [...markers.map((m) => m.x - first.x), light.x - first.x + light.y - first.y + (BEND_LENGTH - 2) * r],
    };
  }

  return {
    d: `M${px(first.x)} ${px(first.y)}V${px(panelTop)}`,
    stops: [...markers.map((m) => m.y - first.y), panelTop - first.y],
  };
}

const switchOn = "transition-colors duration-500 ease-out";
const head = "flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5";

/**
 * The panel's status: a word and a light. Both words take up room whichever
 * one shows, so the title beside them wraps the same way in either state.
 */
function Status({ live, children }: { live: boolean; children: React.ReactNode }) {
  return (
    <p className="flex shrink-0 items-center gap-3">
      <span className="mono-label grid justify-items-end">
        <span className={`[grid-area:1/1] ${live ? "invisible" : ""}`}>Setting up</span>
        <span className={`[grid-area:1/1] ${live ? "" : "invisible"}`}>Live</span>
      </span>
      {children}
    </p>
  );
}

/**
 * The six steps as a line that is drawn as the visitor scrolls, grouped under
 * their two phases, running into a panel of everything the platform includes.
 * The panel waits with its switches off; when the line arrives it pours into
 * the panel's header, which fills with the accent from the corner the line
 * came in at, and the features switch on one after another. On a wide screen
 * the steps run in a row above the panel and the line turns down into its
 * right corner. On a narrow one they are stacked and it runs straight down
 * into its left. It is made for the "surface" sheet.
 */
export function CrmRollout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<Line | null>(null);
  const [d, setD] = useState("");
  // How many stops the line has passed. The first step is on from the start.
  const [passed, setPassed] = useState(1);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.85", "end 0.45"] });

  const sync = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;
    const at = scrollYProgress.get() * line.stops[line.stops.length - 1];
    setPassed(line.stops.filter((stop) => at >= stop - 1).length);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", sync);

  // The line is drawn through wherever the layout has put the markers, so it is rebuilt whenever that changes.
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const light = lightRef.current;
    if (!root || !panel || !light) return;
    const observer = new ResizeObserver(() => {
      const markers = markerRefs.current.flatMap((el) => (el ? [centreIn(el, root)] : []));
      if (markers.length < 2) return;
      const line = buildLine(markers, centreIn(light, root), panel.offsetTop);
      lineRef.current = line;
      setD(line.d);
      sync();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [sync]);

  const arrived = reduce ? stepCount + 1 : passed;
  const live = arrived > stepCount;
  const drawn = { d, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round", className: "stroke-blue" } as const;

  return (
    <Section tone="surface" labelledBy="rollout-title">
      <SectionHeader
        id="rollout-title"
        label="What you get"
        title="Everything included, live in six steps."
        accent="live in six steps."
        align="left"
      />

      <Reveal className="mt-12 md:mt-20">
        <div ref={rootRef} className="relative">
          <svg aria-hidden fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
            <path d={d} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="0.1 9" className="stroke-muted/70" />
            {reduce ? <path {...drawn} /> : <motion.path {...drawn} style={{ pathLength: scrollYProgress }} />}
          </svg>

          <ol
            ref={trackRef}
            style={{ "--steps": stepCount } as React.CSSProperties}
            className="grid gap-y-9 lg:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
          >
            {phases.map((phase, p) => (
              <li
                key={phase.name}
                style={{ "--span": phase.steps.length } as React.CSSProperties}
                className="lg:[grid-column:span_var(--span)]"
              >
                <p className="mono-label flex items-center gap-3 pl-10 text-muted lg:pl-0 lg:pr-6">
                  <span className="text-navy">Phase {p + 1}</span>
                  {phase.name}
                  <span aria-hidden className="h-px min-w-4 flex-1 bg-mist/70" />
                </p>
                <ol
                  start={phase.steps[0].index + 1}
                  className="mt-6 grid gap-y-7 lg:mt-7 lg:[grid-template-columns:repeat(var(--span),minmax(0,1fr))]"
                >
                  {phase.steps.map(({ title, index }) => {
                    const on = index < arrived;
                    return (
                      // The last step keeps clear of the line where it turns down beside it.
                      <li
                        key={title}
                        className={`relative pl-10 lg:pl-0 lg:pt-9 ${index === stepCount - 1 ? "lg:pr-14" : "lg:pr-6"}`}
                      >
                        <span
                          aria-hidden
                          ref={(el) => {
                            markerRefs.current[index] = el;
                          }}
                          className={`absolute left-0 top-1.5 size-4 rounded-full lg:top-0 ${switchOn} ${
                            on ? "bg-navy" : "bg-mist"
                          }`}
                        />
                        <p aria-hidden className={`font-display text-h4 ${switchOn} ${on ? "text-navy" : "text-mist"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1.5 text-body font-medium text-pretty text-navy lg:text-caption xl:text-body">
                          {title}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>

          <div ref={panelRef} className="mt-9 rounded-lg bg-white shadow-card lg:mt-12">
            <div className={`relative border-b border-line ${head}`}>
              <h3 className="text-h5 text-navy">Included in the platform</h3>
              <div aria-hidden className="text-muted">
                <Status live={false}>
                  <span ref={lightRef} className="relative size-4 rounded-full bg-mist" />
                </Status>
              </div>

              {/* The same header in its live colours, lying over the waiting one and uncovered from the line's corner. */}
              <div
                aria-hidden
                className={`absolute inset-0 rounded-t-lg bg-blue text-white transition-[clip-path] duration-700 ease-swift ${head} ${
                  live
                    ? "[clip-path:inset(0_0_0_0)]"
                    : "[clip-path:inset(0_100%_0_0)] lg:[clip-path:inset(0_0_0_100%)]"
                }`}
              >
                <p className="font-display text-h5">Included in the platform</p>
                <Status live>
                  <span className="relative size-4 rounded-full bg-white">
                    {live && <span className="absolute inset-0 animate-ping rounded-full bg-white" />}
                  </span>
                </Status>
              </div>
            </div>

            {/* Each cell draws its own hairline into the gap, so the grid is ruled however many features there are. */}
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-b-lg md:grid-cols-4">
              {crm.features.map((feature, i) => {
                const Icon = featureIcons[i];
                const turn = { transitionDelay: live ? `${350 + i * 70}ms` : "0ms" };
                return (
                  <li
                    key={feature}
                    className="flex min-h-28 flex-col justify-between gap-6 p-5 shadow-[0_0_0_1px_var(--color-line)] md:min-h-36 md:p-6"
                  >
                    <span aria-hidden className="flex items-center justify-between gap-3">
                      <Icon
                        style={turn}
                        className={`size-5 shrink-0 ${switchOn} ${live ? "text-blue" : "text-mist"}`}
                        strokeWidth={1.5}
                      />
                      <span
                        style={turn}
                        className={`flex h-5 w-9 shrink-0 rounded-full p-0.5 ${switchOn} ${live ? "bg-blue" : "bg-mist/60"}`}
                      >
                        <span
                          style={turn}
                          className={`size-4 rounded-full bg-white transition-[translate] duration-500 ease-swift ${
                            live ? "translate-x-4" : ""
                          }`}
                        />
                      </span>
                    </span>
                    <span className="text-body font-medium text-pretty text-navy">{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
