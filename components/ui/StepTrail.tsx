"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { Carousel } from "@/components/ui/Carousel";
import { useMediaQuery, useReducedMotionSafe } from "@/lib/hooks";

export type TrailStep = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** The small picture at the top of the card. `on` turns true when the line reaches the step. */
  Visual: (props: { on: boolean }) => React.ReactNode;
};

/** How far down the viewport the tip of the line sits while it is being drawn. */
const READING_LINE = 0.6;
/** Radius of the bends in the path. */
const BEND = 32;
/** Share of the drop between two markers that runs straight down, at each end, before the path crosses over. */
const LEAD = 0.34;

type Point = { x: number; y: number };

type Trail = {
  d: string;
  /** Height of the list. The line's tip follows the reading line down it. */
  height: number;
  /** The y of each marker's centre. */
  stops: number[];
  /** The path as short straight runs: the y of each joint, and the distance along the path to it. */
  ys: number[];
  lengths: number[];
};

const fixed = (n: number) => Math.round(n * 10) / 10;

/**
 * Draws the path through the markers. Where two markers are not in line it
 * drops straight out of the first, crosses over on a diagonal and drops
 * straight into the second, with rounded bends. On a phone the markers share
 * a column, so the same code gives a straight line.
 */
function buildTrail(markers: Point[], height: number): Trail {
  const corners: Point[] = [markers[0]];
  for (let i = 1; i < markers.length; i++) {
    const from = markers[i - 1];
    const to = markers[i];
    if (Math.abs(to.x - from.x) > 1) {
      const lead = (to.y - from.y) * LEAD;
      corners.push({ x: from.x, y: from.y + lead }, { x: to.x, y: to.y - lead });
    }
    corners.push(to);
  }

  let pen = corners[0];
  let d = `M${fixed(pen.x)} ${fixed(pen.y)}`;
  const ys = [pen.y];
  const lengths = [0];
  const lineTo = (p: Point) => {
    lengths.push(lengths[lengths.length - 1] + Math.hypot(p.x - pen.x, p.y - pen.y));
    ys.push(p.y);
    pen = p;
  };

  for (let i = 1; i < corners.length; i++) {
    const prev = corners[i - 1];
    const at = corners[i];
    const next = corners[i + 1];
    const turns = next && Math.abs((at.x - prev.x) * (next.y - at.y) - (at.y - prev.y) * (next.x - at.x)) > 0.5;
    if (!turns) {
      d += `L${fixed(at.x)} ${fixed(at.y)}`;
      lineTo(at);
      continue;
    }
    const into = Math.hypot(at.x - prev.x, at.y - prev.y);
    const out = Math.hypot(next.x - at.x, next.y - at.y);
    const r = Math.min(BEND, into / 2, out / 2);
    const start = { x: at.x - ((at.x - prev.x) / into) * r, y: at.y - ((at.y - prev.y) / into) * r };
    const end = { x: at.x + ((next.x - at.x) / out) * r, y: at.y + ((next.y - at.y) / out) * r };
    d += `L${fixed(start.x)} ${fixed(start.y)}Q${fixed(at.x)} ${fixed(at.y)} ${fixed(end.x)} ${fixed(end.y)}`;
    lineTo(start);
    for (let k = 1; k <= 8; k++) {
      const t = k / 8;
      const u = 1 - t;
      lineTo({
        x: u * u * start.x + 2 * u * t * at.x + t * t * end.x,
        y: u * u * start.y + 2 * u * t * at.y + t * t * end.y,
      });
    }
  }

  return { d, height, stops: markers.map((m) => m.y), ys, lengths };
}

/** Distance along the path to the point at height `y`. The path only ever runs downwards. */
function lengthAt({ ys, lengths }: Trail, y: number) {
  const last = ys.length - 1;
  if (y <= ys[0]) return 0;
  if (y >= ys[last]) return lengths[last];
  let i = 1;
  while (ys[i] < y) i++;
  const span = ys[i] - ys[i - 1];
  return lengths[i - 1] + (span ? (y - ys[i - 1]) / span : 0) * (lengths[i] - lengths[i - 1]);
}

/** Centre of `el` inside `root`, from layout offsets so transforms in between do not skew it. */
export function centreIn(el: HTMLElement, root: HTMLElement): Point {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  for (let node: HTMLElement | null = el; node && node !== root; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

const ringClass = "absolute rounded-full border transition-[opacity,scale] duration-700 ease-rise";
const rings = [
  "-inset-1.5 border-navy/45 md:-inset-2",
  "-inset-3 border-navy/25 md:-inset-4",
  "-inset-[18px] border-navy/10 md:-inset-6",
];

/**
 * Steps as cards on alternating sides of a path that winds down the section.
 * The path is dotted until the visitor scrolls past it, when it is drawn in
 * the accent; each step's marker switches on as the line arrives, and the
 * step it reached last carries rings, and its card lifts off the sheet. It is
 * made for the "surface" sheet.
 *
 * On a phone the steps are a carousel instead. The path runs sideways through
 * the markers, one stretch per step, and the step in front is the one the
 * line has reached: swiping on draws the next stretch and switches that step on.
 */
export function StepTrail({ steps }: { steps: TrailStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trailRef = useRef<Trail | null>(null);
  const [d, setD] = useState("");
  const [reached, setReached] = useState(0);
  const [slide, setSlide] = useState(0);
  const winding = useMediaQuery("(width >= 48rem)");
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: [`start ${READING_LINE}`, `end ${READING_LINE}`],
  });
  const drawn = useMotionValue(0);

  const sync = useCallback(() => {
    const trail = trailRef.current;
    if (!trail) return;
    const y = scrollYProgress.get() * trail.height;
    const total = trail.lengths[trail.lengths.length - 1];
    drawn.set(total ? lengthAt(trail, y) / total : 0);
    setReached(trail.stops.reduce((last, stop, i) => (y >= stop - 1 ? i : last), 0));
  }, [drawn, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", sync);

  // The path is drawn through wherever the layout has put the markers, so it is rebuilt whenever that changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => {
      const markers = markerRefs.current.flatMap((el) => (el ? [centreIn(el, root)] : []));
      if (markers.length < 2) return;
      // In the carousel the markers sit in a row and each step draws its own stretch of line, so there is no path.
      if (markers[1].y - markers[0].y < 1) {
        trailRef.current = null;
        setD("");
        return;
      }
      const trail = buildTrail(markers, root.offsetHeight);
      trailRef.current = trail;
      setD(trail.d);
      sync();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [sync]);

  // Down the winding path the scroll says how far the line has come; in the carousel the slide in front does.
  const last = !winding ? slide : reduce ? steps.length - 1 : reached;
  const stroke = { strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const dots = { ...stroke, strokeWidth: 2.5, strokeDasharray: "0.1 9", className: "stroke-muted/70" } as const;
  const line = { ...stroke, d, strokeWidth: 4, className: "stroke-blue" } as const;

  return (
    <div ref={rootRef} className="relative mx-auto mt-10 max-w-[64rem] md:mt-16">
      <svg aria-hidden fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible max-md:hidden">
        <path d={d} {...dots} />
        {reduce ? <path {...line} /> : <motion.path {...line} style={{ pathLength: drawn }} />}
      </svg>

      {/* The row is deeper than its cards, so the shadow under the step in front is not cut off; the controls move up into the spare room. */}
      <Carousel as="ol" label="Steps" onChange={setSlide} track="max-md:-mb-12 max-md:pb-14">
        {steps.map((step, i) => {
          const { icon: Icon, Visual } = step;
          const on = i <= last;
          const active = i === last;
          // Cards alternate left and right. The first marker sits on the centre line; after that each
          // marker sits across the centre line from its card, so the path swings from side to side.
          const cardLeft = i % 2 === 0;
          const markerSide =
            i === 0 ? "md:justify-self-center" : cardLeft ? "md:mr-8 md:justify-self-end" : "md:ml-8 md:justify-self-start";

          return (
            <li
              key={step.title}
              className={`max-md:relative max-md:flex max-md:flex-col md:grid md:grid-cols-[minmax(0,1fr)_clamp(11rem,24vw,20rem)_minmax(0,1fr)] md:items-start ${
                i ? "md:-mt-20" : ""
              }`}
            >
              {/* The stretch of path from this marker to the next slide's, drawn when that step is reached. */}
              {i < steps.length - 1 && (
                <svg
                  aria-hidden
                  fill="none"
                  className="pointer-events-none absolute left-10 top-10 h-px w-[calc(100%+0.5rem)] overflow-visible md:hidden"
                >
                  <line x2="100%" {...dots} />
                  <line
                    x2="100%"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={i < last ? 0 : 1}
                    strokeWidth={4}
                    strokeLinecap="round"
                    className="stroke-blue transition-[stroke-dashoffset] duration-700 ease-swift"
                  />
                </svg>
              )}
              <span
                aria-hidden
                ref={(el) => {
                  markerRefs.current[i] = el;
                }}
                className={`relative size-10 shrink-0 max-md:ml-5 max-md:mt-5 md:col-start-2 md:row-start-1 md:mt-20 md:size-14 ${markerSide}`}
              >
                {/* A plain disc under the rings, so the path stops at the outer ring instead of running through them. */}
                <span
                  className={`absolute -inset-[18px] rounded-full bg-surface transition-[opacity,scale] duration-700 ease-rise md:-inset-6 ${
                    active ? "" : "scale-50 opacity-0"
                  }`}
                />
                {rings.map((ring, k) => (
                  <span
                    key={ring}
                    style={{ transitionDelay: active ? `${k * 90}ms` : "0ms" }}
                    className={`${ringClass} ${ring} ${active ? "" : "scale-50 opacity-0"}`}
                  />
                ))}
                <span
                  className={`absolute inset-0 grid place-items-center rounded-full text-white transition-colors duration-500 ease-out ${
                    on ? "bg-navy" : "bg-mist"
                  }`}
                >
                  <Icon className="size-5 md:size-6" strokeWidth={1.5} />
                </span>
              </span>

              <div
                className={`rounded-lg bg-white p-2 transition-[box-shadow,translate] duration-700 ease-swift max-md:mt-7 max-md:flex-1 md:row-start-1 md:w-full md:max-w-[22rem] ${
                  cardLeft ? "md:col-start-1 md:justify-self-end" : "md:col-start-3 md:justify-self-start"
                } ${active ? "-translate-y-1 shadow-float" : "shadow-card"}`}
              >
                <div aria-hidden className="h-48 overflow-hidden rounded-md border border-line bg-surface">
                  <Visual on={on} />
                </div>
                <div className="px-4 pb-4 pt-5">
                  <p className={`mono-label transition-colors duration-500 ease-out ${active ? "text-blue" : "text-muted"}`}>
                    Step {i + 1}
                  </p>
                  <h3 className="mt-2 text-h5 text-navy">{step.title}</h3>
                  <p className="mt-2 text-caption text-pretty text-muted">{step.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </Carousel>
    </div>
  );
}
