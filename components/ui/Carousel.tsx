"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RevealGroup } from "@/components/motion/Reveal";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/hooks";

type Until = "sm" | "md";

/*
 * Everything that makes the list a carousel, written out once per breakpoint
 * because the stylesheet is built from the class names it finds in the source.
 * The row runs out to both edges of the screen, so a slide leaves through the
 * edge and not through the page gutter, and each slide is a little narrower
 * than the page so the next one shows beside it.
 */
const modes: Record<
  Until,
  { query: string; track: string; rows: string; gap: { tight: string; loose: string }; controls: string }
> = {
  sm: {
    query: "(width < 40rem)",
    track:
      "max-sm:-mx-(--page-pad) max-sm:grid max-sm:snap-x max-sm:snap-mandatory max-sm:grid-flow-col max-sm:auto-cols-[86%] max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:overscroll-x-contain max-sm:scroll-px-(--page-pad) max-sm:px-page max-sm:scrollbar-none max-sm:*:min-w-0 max-sm:*:snap-start",
    rows: "max-sm:grid-rows-2",
    gap: { tight: "max-sm:gap-x-2", loose: "max-sm:gap-x-4" },
    controls: "sm:hidden",
  },
  md: {
    query: "(width < 48rem)",
    track:
      "max-md:-mx-(--page-pad) max-md:grid max-md:snap-x max-md:snap-mandatory max-md:grid-flow-col max-md:auto-cols-[86%] max-md:overflow-x-auto max-md:overflow-y-hidden max-md:overscroll-x-contain max-md:scroll-px-(--page-pad) max-md:px-page max-md:scrollbar-none max-md:*:min-w-0 max-md:*:snap-start",
    rows: "max-md:grid-rows-2",
    gap: { tight: "max-md:gap-x-2", loose: "max-md:gap-x-4" },
    controls: "md:hidden",
  },
};

const two = (n: number) => String(n).padStart(2, "0");

/**
 * A list that is a carousel on a phone and an ordinary layout from `until`
 * upwards. Below `until` its children sit in one row that is swiped sideways
 * and stops on each slide; under it are the slide number, a bar that follows
 * the swipe, and a pair of arrows. From `until` upwards none of that applies
 * and the list is laid out by `track` alone, so `track` should only hold
 * classes for that breakpoint and wider.
 *
 * `rows` stacks two children in each slide, for short items. `onChange` is
 * told which slide is in front.
 */
export function Carousel({
  as: Tag = "div",
  label,
  until = "md",
  rows = 1,
  gap = "tight",
  onDark = false,
  className = "",
  track = "",
  onChange,
  children,
}: {
  as?: "div" | "ul" | "ol" | "dl";
  /** What the carousel holds, read out by a screen reader: "Modules", or the section's title. */
  label: string;
  until?: Until;
  rows?: 1 | 2;
  gap?: "tight" | "loose";
  onDark?: boolean;
  className?: string;
  track?: string;
  onChange?: (index: number) => void;
  children: React.ReactNode;
}) {
  const mode = modes[until];
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  // Where each slide starts, as the scroll position that brings it to the front.
  const stopsRef = useRef<number[]>([]);
  const [count, setCount] = useState(() => Math.ceil(Children.count(children) / rows));
  const [index, setIndex] = useState(0);
  const sliding = useMediaQuery(mode.query);
  const reduce = useReducedMotionSafe();
  const seen = useInView(rootRef, { once: true, margin: "0px 0px -6% 0px" });

  const follow = useCallback(() => {
    const el = trackRef.current;
    const stops = stopsRef.current;
    if (!el || stops.length < 2) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const at = el.scrollLeft;
    // The last slide cannot reach the left edge: the row simply ends, and that counts as being on it.
    let front = stops.length - 1;
    if (at < max - 2) {
      front = stops.reduce((best, stop, i) => (Math.abs(stop - at) < Math.abs(stops[best] - at) ? i : best), 0);
    }
    setIndex(front);
    if (thumbRef.current) thumbRef.current.style.translate = `${(at / max) * (stops.length - 1) * 100}%`;
  }, []);

  // The slides are found from the layout, so anything hidden at this width is left out and two rows count as one slide.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const shown = ([...el.children] as HTMLElement[]).filter((child) => child.offsetWidth > 0);
      if (!shown.length) return;
      const first = shown[0].offsetLeft;
      const stops: number[] = [];
      for (const child of shown) {
        const stop = child.offsetLeft - first;
        if (!stops.length || stop - stops[stops.length - 1] > 1) stops.push(stop);
      }
      stopsRef.current = stops;
      setCount(stops.length);
      follow();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", follow, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", follow);
    };
  }, [follow]);

  useEffect(() => {
    onChange?.(index);
  }, [index, onChange]);

  const go = (to: number) => {
    const stop = stopsRef.current[to];
    if (stop === undefined) return;
    trackRef.current?.scrollTo({ left: stop, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = `grid size-11 place-items-center rounded-md transition-colors duration-200 ease-out disabled:opacity-35 ${
    onDark ? "bg-white/10 text-white active:bg-white/20" : "bg-line text-navy active:bg-mist"
  }`;

  return (
    <div
      ref={rootRef}
      className={className}
      {...(sliding ? { role: "group", "aria-roledescription": "carousel", "aria-label": label } : {})}
    >
      {/* While it is a carousel the slides off to the side are out of view, so they all rise together when the row is reached. */}
      <RevealGroup value={sliding ? seen : null}>
        <Tag
          ref={(el: HTMLElement | null) => {
            trackRef.current = el;
          }}
          // A sideways swipe on a trackpad belongs to the row, not to the page's eased scrolling.
          data-lenis-prevent-horizontal={sliding ? "" : undefined}
          className={`relative ${mode.track} ${mode.gap[gap]} ${rows === 2 ? mode.rows : ""} ${track}`}
        >
          {children}
        </Tag>
      </RevealGroup>

      {count > 1 && (
        <div className={`relative mt-5 flex items-center gap-4 ${mode.controls}`}>
          <p aria-hidden className={`mono-label tabular-nums ${onDark ? "text-white" : "text-navy"}`}>
            {two(index + 1)}
            <span className={onDark ? "text-white/50" : "text-muted"}> / {two(count)}</span>
          </p>
          <span aria-hidden className={`h-0.5 flex-1 overflow-hidden rounded-full ${onDark ? "bg-white/15" : "bg-line"}`}>
            <span
              ref={thumbRef}
              style={{ width: `${100 / count}%` }}
              className={`block h-full rounded-full ${onDark ? "bg-sky" : "bg-blue"}`}
            />
          </span>
          <div className="flex gap-1.5">
            <button type="button" aria-label="Previous" disabled={index === 0} onClick={() => go(index - 1)} className={arrow}>
              <ArrowLeft aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={index >= count - 1}
              onClick={() => go(index + 1)}
              className={arrow}
            >
              <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
