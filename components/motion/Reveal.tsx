"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  as?: "div" | "li";
};

/** Snaps content into place once, the first time it scrolls into view. Short and linear-feeling, never springy. */
export function Reveal({ delay = 0, as = "div", children, ...rest }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      {...rest}
    >
      {children}
    </Component>
  );
}
