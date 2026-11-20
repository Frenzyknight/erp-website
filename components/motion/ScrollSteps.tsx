"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/hooks";

type StepState = {
  /** The line has arrived at this step. */
  reached: boolean;
  /** This is the step the line has most recently arrived at. */
  active: boolean;
};

/**
 * A list of steps joined by a line that fills with the accent as the visitor
 * scrolls, each step's round marker switching on when the line arrives. Lays
 * out as a row on wide screens when `horizontal` is set, otherwise as a
 * vertical timeline. `numbered` swaps the small dots for large numbered nodes.
 */
export function ScrollSteps<T>({
  items,
  horizontal = false,
  numbered = false,
  children,
}: {
  items: T[];
  horizontal?: boolean;
  numbered?: boolean;
  children: (item: T, index: number, state: StepState) => React.ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const wide = useMediaQuery("(min-width: 768px)");
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });

  const count = items.length;
  // In a row the line runs from the first marker to the last, so the markers
  // sit at even fractions of it. In a column the line also runs past the last
  // marker, down the side of its text.
  const inRow = horizontal && wide;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const step = inRow ? Math.floor(v * (count - 1) + 0.04) : Math.floor(v * count);
    setReached(Math.max(0, Math.min(count - 1, step)));
  });

  const last = reduce ? count - 1 : reached;
  const fill = "absolute inset-0 rounded-full bg-blue";

  return (
    <ol ref={ref} className={`relative grid gap-8 ${horizontal ? "md:grid-flow-col md:auto-cols-fr md:gap-6" : ""}`}>
      {/* Vertical track (always on small screens), centred on the markers */}
      <span
        aria-hidden
        className={`absolute bottom-2 top-2 w-1 rounded-full bg-mist/50 ${numbered ? "left-[22px]" : "left-1.5"} ${
          horizontal ? "md:hidden" : ""
        }`}
      >
        {reduce ? (
          <span className={fill} />
        ) : (
          <motion.span style={{ scaleY: scrollYProgress }} className={`${fill} origin-top`} />
        )}
      </span>
      {/* Horizontal track, ending at the last marker */}
      {horizontal && (
        <span
          aria-hidden
          style={{ right: `${100 / count}%` }}
          className={`absolute left-0 hidden h-1 rounded-full bg-mist/50 md:block ${
            numbered ? "top-[30px]" : "top-1.5"
          }`}
        >
          {reduce ? (
            <span className={fill} />
          ) : (
            <motion.span style={{ scaleX: scrollYProgress }} className={`${fill} origin-left`} />
          )}
        </span>
      )}

      {items.map((item, i) => {
        const state = { reached: i <= last, active: i === last };
        return (
          <li
            key={i}
            className={`relative ${numbered ? "pl-[4.5rem]" : "pl-10"} ${
              horizontal ? (numbered ? "md:pl-0 md:pt-24" : "md:pl-0 md:pr-6 md:pt-10") : ""
            }`}
          >
            <span
              aria-hidden
              className={`absolute left-0 grid place-items-center rounded-full font-semibold text-white transition-colors duration-500 ease-out ${
                numbered
                  ? `top-0 size-12 text-body ${horizontal ? "md:size-16 md:text-md" : ""}`
                  : `top-0.5 size-4 ${horizontal ? "md:top-0" : ""}`
              } ${state.reached ? "bg-navy" : "bg-mist"}`}
            >
              {numbered && i + 1}
            </span>
            {children(item, i, state)}
          </li>
        );
      })}
    </ol>
  );
}
