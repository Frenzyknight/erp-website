"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** A paragraph whose words darken one by one as it scrolls up the screen. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {reduce
        ? text
        : words.map((word, i) => (
            <Fragment key={i}>
              <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {word}
              </Word>{" "}
            </Fragment>
          ))}
    </p>
  );
}
