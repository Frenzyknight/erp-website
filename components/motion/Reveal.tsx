"use client";

import { createContext, useContext } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { useSiteReady } from "@/lib/device";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number };

/** The curve behind every entrance: almost all of the travel happens at once, then it settles slowly. */
export const riseEase = [0, 1, 0.4, 1] as const;

const hidden = { opacity: 0, y: 72 };
const shown = { opacity: 1, y: 0 };

/*
 * A carousel's slides cannot each wait to come into view: the ones off to the
 * side would still be hidden when they are swiped to. So the carousel answers
 * for all of them, here: false until the row is reached, then true. Outside a
 * carousel this is null and each piece watches for itself.
 */
export const RevealGroup = createContext<boolean | null>(null);

/**
 * Content rises into place once, the first time it scrolls into view. A long, hard ease-out, never springy.
 * Whatever is in view on arrival waits behind the loading screen, and rises as the screen lifts.
 */
export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  const ready = useSiteReady();
  const group = useContext(RevealGroup);

  return (
    <motion.div
      initial={hidden}
      whileInView={group === null ? (ready ? shown : hidden) : undefined}
      animate={group === null ? undefined : ready && group ? shown : hidden}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1, delay, ease: riseEase }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
