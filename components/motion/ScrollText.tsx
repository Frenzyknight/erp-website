"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLite } from "@/lib/device";
import { useReducedMotionSafe } from "@/lib/hooks";

/** How faint a word is before the scroll reaches it. */
const unlit = 0.18;

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [unlit, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/**
 * A phrase in handwriting, in the accent colour, with one pen stroke under it.
 * The phrase is set twice: faint, like the words around it, and again in
 * colour on top. `ink` clips the coloured copy and `line` is how much of the
 * stroke is drawn; leave both out and the phrase stands fully written. The
 * phrase never breaks across lines, and `tail` is the punctuation that has to
 * stay on its line.
 */
function Scribble({
  children,
  tail,
  ink,
  line,
  lit,
}: {
  children: string;
  tail?: string;
  ink?: MotionValue<string>;
  line?: MotionValue<number>;
  lit?: MotionValue<number>;
}) {
  // A round-capped stroke of no length still shows as a dot, so the stroke is hidden until it starts.
  const started = useTransform(() => ((line?.get() ?? 1) > 0 ? 1 : 0));

  return (
    <span className="whitespace-nowrap">
      {/* The line height is short so the larger handwriting does not push its line of text apart, and it sits a touch low to clear the line above. */}
      <span className="relative inline-block translate-y-[0.04em] -rotate-2 font-scribble text-[1.15em] leading-[0.7] font-normal tracking-normal">
        <span style={{ opacity: unlit }}>{children}</span>
        <motion.span aria-hidden className="absolute inset-0 text-sky select-none" style={{ clipPath: ink }}>
          {children}
        </motion.span>
        <svg
          aria-hidden
          viewBox="0 0 200 10"
          fill="none"
          className="absolute top-[86%] left-0 w-full overflow-visible text-sky"
        >
          {/* Across to the right, then a quick pass back underneath. It is kept shallow, to stay clear of the next line of text. */}
          <motion.path
            d="M4 4.8C50 2.4 134 1.8 197 3.4 150 3.7 98 4.7 50 7.4"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: line, opacity: started }}
          />
        </svg>
      </span>
      {tail && <motion.span style={{ opacity: lit }}>{tail}</motion.span>}
    </span>
  );
}

/** The phrase written in as the scroll crosses `range`: the words first, left to right, then the stroke under them. */
function ScrollScribble({
  children,
  tail,
  range,
  progress,
}: {
  children: string;
  tail?: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  // The pen trails the scroll, so a quick flick past still reads as writing. It settles without overshooting.
  const pen = useSpring(useTransform(progress, range, [0, 1]), { stiffness: 90, damping: 24 });
  // The clip reaches past the box on every side, because handwriting overhangs it.
  const ink = useTransform(pen, [0, 0.7], ["inset(-0.6em 100% -0.6em -0.3em)", "inset(-0.6em -12% -0.6em -0.3em)"]);
  const line = useTransform(pen, [0.6, 1], [0, 1]);
  const lit = useTransform(progress, range, [unlit, 1]);

  return (
    <Scribble tail={tail} ink={ink} line={line} lit={lit}>
      {children}
    </Scribble>
  );
}

/**
 * A paragraph whose words darken one by one as it scrolls up the screen. Pass
 * `scribble`, a phrase of two or three words taken from the text, to have it
 * written in by hand in the accent colour when the scroll gets to it.
 */
export function ScrollText({ text, scribble, className }: { text: string; scribble?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  // A slow device gets the paragraph as it ends, written in full: lighting it word by word is work on every scroll.
  const lite = useLite();
  const reduce = useReducedMotionSafe() || lite;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  // The text in three parts: the words before the phrase, the phrase with any punctuation attached to it, and the rest.
  const at = scribble ? text.indexOf(scribble) : -1;
  const phrase = at < 0 ? "" : (scribble ?? "");
  const rest = at < 0 ? "" : text.slice(at + phrase.length);
  const tail = rest.match(/^\S*/)?.[0] ?? "";
  const before = (at < 0 ? text : text.slice(0, at)).split(" ").filter(Boolean);
  const after = rest.slice(tail.length).split(" ").filter(Boolean);
  const held = phrase ? phrase.split(" ").length : 0;
  const total = before.length + held + after.length;
  const span = (from: number, count = 1): [number, number] => [from / total, (from + count) / total];

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {before.join(" ")}
        {phrase && (
          <>
            {" "}
            <Scribble tail={tail}>{phrase}</Scribble>{" "}
          </>
        )}
        {after.join(" ")}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {before.map((word, i) => (
        <Fragment key={i}>
          <Word progress={scrollYProgress} range={span(i)}>
            {word}
          </Word>{" "}
        </Fragment>
      ))}
      {phrase && (
        <>
          <ScrollScribble tail={tail} progress={scrollYProgress} range={span(before.length, held)}>
            {phrase}
          </ScrollScribble>{" "}
        </>
      )}
      {after.map((word, i) => (
        <Fragment key={i}>
          <Word progress={scrollYProgress} range={span(before.length + held + i)}>
            {word}
          </Word>{" "}
        </Fragment>
      ))}
    </p>
  );
}
