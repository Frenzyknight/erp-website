"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };

/** The curve behind every entrance: almost all of the travel happens at once, then it settles slowly. */
export const riseEase = [0, 1, 0.4, 1] as const;

/** Content rises into place once, the first time it scrolls into view. A long, hard ease-out, never springy. */
export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1, delay, ease: riseEase }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
