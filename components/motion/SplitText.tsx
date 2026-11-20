"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { riseEase } from "@/components/motion/Reveal";

/** Marks each word of `text` that falls inside the phrase `accent`. */
function splitWords(text: string, accent?: string) {
  const from = accent ? text.indexOf(accent) : -1;
  const to = from + (accent?.length ?? 0);
  const words: { word: string; accented: boolean }[] = [];
  let at = 0;
  for (const word of text.split(" ")) {
    words.push({ word, accented: from >= 0 && at >= from && at < to });
    at += word.length + 1;
  }
  return words;
}

/**
 * A heading whose words rise one after another from under their own line,
 * the first time it scrolls into view. Each word sits in a mask; the small
 * padding keeps descenders from being clipped. Pass `accent`, a phrase taken
 * from the text, to set those words in the accent colour.
 */
export function SplitText({
  text,
  accent,
  accentClass = "text-blue",
}: {
  text: string;
  accent?: string;
  accentClass?: string;
}) {
  return (
    <motion.span
      className="block"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ staggerChildren: 0.035 }}
    >
      {splitWords(text, accent).map(({ word, accented }, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${accented ? accentClass : ""}`}
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
