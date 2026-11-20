"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { riseEase } from "@/components/motion/Reveal";

/**
 * A heading whose words rise one after another from under their own line,
 * the first time it scrolls into view. Each word sits in a mask; the small
 * padding keeps descenders from being clipped.
 */
export function SplitText({ text }: { text: string }) {
  return (
    <motion.span
      className="block"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ staggerChildren: 0.035 }}
    >
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "115%" }, shown: { y: 0 } }}
              transition={{ duration: 0.9, ease: riseEase }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </motion.span>
  );
}
