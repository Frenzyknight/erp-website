"use client";

import { useEffect, useRef } from "react";
import { HeroArt } from "@/components/ui/HeroArt";
import { createHeroScene, type HeroLook } from "@/components/hero/scene";
import { useReducedMotionSafe } from "@/lib/hooks";

/* Seconds of holding to run the film through. */
const LENGTH = 8;
/* Seconds the picture takes to go home from the end of the film once the hold is let go. Less from earlier in the film, which has less far to go. */
const RETURN = 1.6;
/* Seconds to pick the film up again where it was left, when the hold is taken up on the way home. */
const RESUME = 0.5;
/* How long a press must last, in milliseconds, before it counts as a hold. A finger gets longer, so a scroll never starts the film. */
const GRACE = { mouse: 120, touch: 260 };

/* When each word shows, as a stretch of the film, and where on the screen it stands. */
const CUES = [
  { from: 0.1, to: 0.35, place: "left-[var(--page-pad)]" },
  { from: 0.38, to: 0.61, place: "left-1/2 -translate-x-1/2" },
  { from: 0.64, to: 0.85, place: "right-[var(--page-pad)]" },
];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * A page's hero: the ribbon picture filling the section, in the page's own
 * look, with the headline and actions (the children) laid over it. Pressing
 * and holding anywhere on the picture plays a film: the page's text and the
 * navigation step aside, the camera travels through the ribbons while the
 * words appear one at a time, and the ribbons end as the Polaris star.
 * Letting go does not run the film backwards: the ribbons and the camera
 * go straight from wherever they are to the picture at rest. A ring follows
 * the pointer to say so, and fills as the film runs.
 *
 * Where WebGL is missing the still artwork shows instead, and with reduced
 * motion the picture is drawn once and the film is switched off.
 */
export function HeroFilm({
  look = "hoops",
  words,
  children,
}: {
  look?: HeroLook;
  /** Up to three, shown one at a time as the film plays. */
  words: string[];
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let scene = createHeroScene(canvas, look);
    if (!scene) {
      section.dataset.art = "still";
      return () => {
        delete section.dataset.art;
      };
    }
    section.dataset.art = "live";

    const root = document.documentElement;
    const ring = section.querySelector<HTMLElement>("[data-ring]");
    const arc = section.querySelector<SVGCircleElement>("[data-arc]");
    // Each letter comes and goes at its own moment, in a scattered order that is the same on every visit.
    const letters = Array.from(section.querySelectorAll<HTMLElement>("[data-word]")).flatMap((word, w) =>
      Array.from(word.children, (el, l) => ({
        el: el as HTMLElement,
        cue: CUES[w],
        turn: Math.abs(Math.sin(l * 12.9898 + w * 78.233) * 43758.5453) % 1,
        shown: 0,
      })),
    );
    const finePointer = window.matchMedia("(pointer: fine)");

    let width = 1;
    let height = 1;
    let film = 0;
    let rate = 0;
    // How far the picture has gone home since the hold was let go, from 0 (where the film left it) to 1 (at rest).
    let home = 0;
    let pressedAt = 0;
    let grace = GRACE.mouse;
    let playing = false;
    let held = false;
    let frame = 0;
    let last = 0;
    let swayX = 0;
    let swayY = 0;
    let ringX = 0;
    let ringY = 0;
    let ringPlaced = false;
    const pointer = { x: 0, y: 0, inside: false, onLink: false };

    const measure = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      // Sharp on dense screens, but never so many pixels that a large one struggles.
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4_200_000 / (width * height)));
      scene?.resize(width, height, dpr);
      if (reduce) scene?.render(20, 0, 0, 0);
    };

    const setPlaying = (on: boolean) => {
      if (on === playing) return;
      playing = on;
      root.toggleAttribute("data-hero-film", on);
    };
    const setHeld = (on: boolean) => {
      if (on === held) return;
      held = on;
      section.toggleAttribute("data-held", on);
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // The film gathers speed and slows to a stop, so pressing and letting go never jolt it. It never runs backwards.
      setHeld(pressedAt > 0 && now - pressedAt > grace);
      rate += ((held ? 1 / LENGTH : 0) - rate) * (1 - Math.exp(-dt * 7));
      film = clamp01(film + rate * dt);
      if (film === 1) rate = 0;

      // Let go, the picture goes straight home, and the film is back at its start once it is there.
      // Held again on the way, it comes back to where the film was left and the film carries on.
      if (held) {
        home = Math.max(0, home - dt / RESUME);
      } else if (film > 0) {
        home += dt / (RETURN * (0.45 + 0.55 * film));
        if (home >= 1) {
          film = 0;
          rate = 0;
          home = 0;
        }
      }
      // The page's text comes back while the picture is still settling, so the two arrive together.
      setPlaying(held || (film > 0.035 && home < 0.6));
      // What the ring and the words show of the film: all of it while held, and less and less on the way home.
      const kept = film * (1 - home * home * (3 - 2 * home));
      const wordsKept = clamp01(1 - home * 4);

      const follow = finePointer.matches && pointer.inside;
      const ease = 1 - Math.exp(-dt * 3);
      swayX += ((follow ? (pointer.x / width) * 2 - 1 : 0) - swayX) * ease;
      swayY += ((follow ? (pointer.y / height) * 2 - 1 : 0) - swayY) * ease;
      scene?.render(now / 1000, film, swayX, swayY, home);

      // The ring rests in the open part of the picture, and goes to the pointer whenever a mouse is over it.
      if (ring && arc) {
        const toX = follow ? pointer.x : width / 2;
        const toY = follow ? pointer.y : height * (width < 1024 ? 0.3 : 0.44);
        const glide = ringPlaced ? 1 - Math.exp(-dt * 14) : 1;
        ringPlaced = true;
        ringX += (toX - ringX) * glide;
        ringY += (toY - ringY) * glide;
        ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
        ring.style.opacity = (follow && pointer.onLink && !held) || kept > 0.93 ? "0" : "1";
        arc.style.strokeDashoffset = (1 - kept).toFixed(4);
      }

      for (const letter of letters) {
        const at = (film - letter.cue.from) / (letter.cue.to - letter.cue.from);
        const arrived = clamp01((at - letter.turn * 0.24) / 0.16);
        const left = clamp01((at - 0.6 - letter.turn * 0.24) / 0.16);
        const shown = Math.round(arrived * (1 - left) * wordsKept * 100) / 100;
        if (shown === letter.shown) continue;
        letter.shown = shown;
        letter.el.style.opacity = String(shown);
      }
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      pressedAt = 0;
      film = 0;
      rate = 0;
      home = 0;
      setHeld(false);
      setPlaying(false);
      for (const letter of letters) {
        letter.shown = 0;
        letter.el.style.opacity = "0";
      }
    };

    const onLink = (e: Event) => e.target instanceof Element && e.target.closest("a, button") !== null;
    const track = (e: PointerEvent) => {
      const box = section.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
      pointer.inside = true;
      pointer.onLink = onLink(e);
    };
    const leave = () => {
      pointer.inside = false;
    };
    const press = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary || onLink(e)) return;
      track(e);
      const mouse = e.pointerType === "mouse";
      grace = mouse ? GRACE.mouse : GRACE.touch;
      pressedAt = performance.now();
      // Keeps the hold alive when the mouse wanders off the hero with the button still down.
      if (mouse) section.setPointerCapture(e.pointerId);
    };
    const release = () => {
      pressedAt = 0;
    };
    // A hold must not select the headline or drag anything, and a long touch must not open the browser's menu.
    const guardMouse = (e: MouseEvent) => {
      if (!onLink(e)) e.preventDefault();
    };
    const guardMenu = (e: MouseEvent) => {
      if (held) e.preventDefault();
    };
    const lost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    const restored = () => {
      scene = createHeroScene(canvas, look);
      measure();
      if (!reduce) start();
    };

    const resizing = new ResizeObserver(measure);
    resizing.observe(section);
    // Nothing is drawn while the hero is off screen, and a film left running is put back to its start.
    const watching = new IntersectionObserver(([entry]) => (entry.isIntersecting && !reduce ? start() : stop()));
    watching.observe(section);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);

    if (!reduce) {
      section.addEventListener("pointermove", track);
      section.addEventListener("pointerleave", leave);
      section.addEventListener("pointerdown", press);
      section.addEventListener("pointerup", release);
      section.addEventListener("pointercancel", release);
      section.addEventListener("mousedown", guardMouse);
      section.addEventListener("contextmenu", guardMenu);
      window.addEventListener("blur", release);
    }

    return () => {
      stop();
      resizing.disconnect();
      watching.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      section.removeEventListener("pointermove", track);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointerdown", press);
      section.removeEventListener("pointerup", release);
      section.removeEventListener("pointercancel", release);
      section.removeEventListener("mousedown", guardMouse);
      section.removeEventListener("contextmenu", guardMenu);
      window.removeEventListener("blur", release);
      scene?.dispose();
      delete section.dataset.art;
    };
  }, [reduce, look]);

  return (
    <section
      ref={sectionRef}
      data-tone="dark"
      data-hero
      // Taller than the screen by the next sheet's overlap, so the picture alone fills the screen until the page is scrolled.
      className="group/hero relative isolate flex min-h-[calc(100svh+var(--sheet-r))] flex-col justify-end overflow-hidden bg-night pb-[var(--sheet-r)] text-white [-webkit-touch-callout:none] pointer-coarse:select-none"
    >
      <HeroArt className="absolute inset-0 hidden size-full group-data-[art=still]/hero:block" />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000 ease-out group-data-[art=live]/hero:opacity-100"
      />
      {/* Shown only where a navy section follows, to run the picture into it without a line: see "Joins" in the stylesheet. */}
      <span aria-hidden className="hero-foot" />

      <div aria-hidden className="pointer-events-none absolute inset-0 font-display text-stat md:text-stat-lg">
        {words.slice(0, CUES.length).map((word, w) => (
          <p key={word} data-word className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${CUES[w].place}`}>
            {Array.from(word, (letter, l) => (
              <span key={l} className="opacity-0">
                {letter}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="relative transition-opacity duration-500 ease-out in-data-hero-film:pointer-events-none in-data-hero-film:opacity-0">
        {children}
      </div>

      {/* Placed by the script, with its centre on the pointer. */}
      <div
        data-ring
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-out motion-reduce:hidden"
      >
        <svg
          viewBox="0 0 88 88"
          fill="none"
          stroke="white"
          className="absolute -top-11 -left-11 size-22 transition-transform duration-500 ease-swift group-data-held/hero:scale-90"
        >
          <circle cx="44" cy="44" r="43" strokeOpacity="0.35" />
          <circle
            data-arc
            cx="44"
            cy="44"
            r="43"
            strokeWidth="1.5"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
            transform="rotate(-90 44 44)"
          />
          <path d="M22 44h6M60 44h6" strokeWidth="1.5" />
        </svg>
        <p className="mono-label absolute top-15 left-0 -translate-x-1/2 whitespace-nowrap text-white transition-opacity duration-300 ease-out in-data-hero-film:opacity-0">
          <span className="pointer-coarse:hidden">Click and hold</span>
          <span className="hidden pointer-coarse:inline">Press and hold</span>
        </p>
      </div>
    </section>
  );
}
