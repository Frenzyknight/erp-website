"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";

/**
 * A list of steps joined by a thick rule that fills in as the visitor scrolls,
 * with each step's square marker switching on when the rule reaches it. Lays
 * out as a row on wide screens when `horizontal` is set, otherwise as a
 * vertical timeline.
 */
export function ScrollSteps<T>({
  items,
  horizontal = false,
  children,
}: {
  items: T[];
  horizontal?: boolean;
  children: (item: T, index: number) => React.ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotionSafe();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached(Math.min(items.length - 1, Math.floor(v * items.length)));
  });

  const last = reduce ? items.length - 1 : reached;
  const fill = "absolute inset-0 bg-blue";

  return (
    <ol
      ref={ref}
      className={`relative grid gap-10 ${horizontal ? "md:grid-flow-col md:auto-cols-fr md:gap-0" : ""}`}
    >
      {/* Vertical track (always on small screens) */}
      <span
        aria-hidden
        className={`absolute bottom-2 left-1.5 top-2 w-1 bg-ink ${horizontal ? "md:hidden" : ""}`}
      >
        {reduce ? (
          <span className={fill} />
        ) : (
          <motion.span style={{ scaleY: scrollYProgress }} className={`${fill} origin-top`} />
        )}
      </span>
      {/* Horizontal track */}
      {horizontal && (
        <span aria-hidden className="absolute inset-x-0 top-1.5 hidden h-1 bg-ink md:block">
          {reduce ? (
            <span className={fill} />
          ) : (
            <motion.span style={{ scaleX: scrollYProgress }} className={`${fill} origin-left`} />
          )}
        </span>
      )}

      {items.map((item, i) => (
        <li key={i} className={`relative pl-10 ${horizontal ? "md:pl-0 md:pr-10 md:pt-12" : ""}`}>
          <span
            aria-hidden
            className={`absolute left-0 top-1 size-4 border-4 transition-colors duration-150 ease-linear ${
              horizontal ? "md:top-0" : ""
            } ${i <= last ? "border-blue bg-blue" : "border-ink bg-white"}`}
          />
          {children(item, i)}
        </li>
      ))}
    </ol>
  );
}
