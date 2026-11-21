"use client";

import { useEffect, useRef, useState } from "react";
import { StarMark } from "@/components/ui/Logo";
import { isSiteReady, setSiteOpening, setSiteReady, useLite } from "@/lib/device";

/* The most the count climbs in a second, so the screen can be read and never just flickers past. */
const PACE = 170;
/* The screen opens this long after the page was asked for, in milliseconds, whatever is still on its way. */
const LONGEST = 6000;
/* How long the screen takes to open, in milliseconds. */
const OPENING = 1150;
/* How far through the opening the page's text starts its entrance, where no hero is bringing it in. */
const ENTRANCE = 0.45;
/* How long the plain fade takes, which stands in for the opening with reduced motion. The stylesheet's `loader` rule has the same figure. */
const FADE = 500;

/*
 * The star in the logo, for a star one unit from its centre to a point: the
 * two handles and the end of the side that runs from the top point to the
 * right-hand one. The other three sides are this one turned a quarter each.
 */
const SIDE = [0.0643, -0.4786, 0.4786, -0.0643, 1, 0];
/* How far the star reaches from its centre where it is narrowest, halfway between two points. */
const WAIST = 0.4647;
/* In the logo's drawing the star is this much of the width of its box, from centre to point. */
const MARK = 14 / 32;

/* The outline of the star around (x, y), `reach` from its centre to a point and turned by `turn`, as SVG path data. */
function star(x: number, y: number, reach: number, turn: number) {
  const c = Math.cos(turn) * reach;
  const s = Math.sin(turn) * reach;
  const at = (px: number, py: number) => `${(x + px * c - py * s).toFixed(2)} ${(y + px * s + py * c).toFixed(2)}`;
  let [ax, ay, bx, by, ex, ey] = SIDE;
  let d = `M${at(0, -1)}`;
  for (let side = 0; side < 4; side++) {
    d += `C${at(ax, ay)} ${at(bx, by)} ${at(ex, ey)}`;
    [ax, ay, bx, by, ex, ey] = [-ay, ax, -by, bx, -ey, ex];
  }
  return `${d}Z`;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/**
 * The screen a visitor sees while the page is put together: the dark of the
 * hero, with the star turning on it and a count of how much has arrived. It
 * is part of the page as the server sends it, so it is there from the first
 * paint, and it waits for everything the page is made of: each typeface, the
 * page's own files, and the hero's picture, drawn and fitted to the device.
 *
 * Then it opens. The star stops being a mark on the screen and becomes a hole
 * in it, which grows until it has passed the corners. A hero that can has
 * been waiting behind it as the same star, so the mark seems to turn solid,
 * and it then comes home to the page's picture and brings the text in (see
 * components/hero/HeroFilm.tsx). Otherwise the text makes its entrance as the
 * hole opens. With reduced motion the screen fades instead.
 *
 * It belongs to the layout, so it shows on arrival and not again when moving
 * from page to page. If the script never runs, the stylesheet lifts it.
 *
 * `fonts` is the family of every typeface the site uses, as the stylesheet names it.
 */
export function Loader({ fonts }: { fonts: string[] }) {
  // Put back by a code change while developing, it finds the page already open and stays away.
  const [gone, setGone] = useState(isSiteReady);
  const screenRef = useRef<HTMLDivElement>(null);
  const lite = useLite();

  // Tells the stylesheet about a slow device. Here, after the page has taken hold, so the server's markup is matched first.
  useEffect(() => {
    if (lite) document.documentElement.dataset.perf = "lite";
  }, [lite]);

  useEffect(() => {
    const screen = screenRef.current;
    const mark = screen?.querySelector<HTMLElement>("[data-mark]");
    const count = screen?.querySelector<HTMLElement>("[data-count]");
    const bar = screen?.querySelector<HTMLElement>("[data-bar]");
    const veil = screen?.querySelector<SVGPathElement>("[data-veil]");
    const plug = screen?.querySelector<SVGPathElement>("[data-plug]");
    const rim = screen?.querySelector<SVGPathElement>("[data-rim]");
    if (!screen || !mark || !count || !bar || !veil || !plug || !rim) return;

    let over = false;
    let frame = 0;
    let timer = 0;
    let watching: MutationObserver | undefined;

    const fade = () => {
      screen.dataset.state = "lifting";
      setSiteReady();
      timer = window.setTimeout(() => setGone(true), FADE);
    };

    // The script was so long in coming that the stylesheet has lifted the screen by itself. The page is on show already.
    if (getComputedStyle(screen).visibility === "hidden") {
      fade();
      return () => window.clearTimeout(timer);
    }
    // From here the script lifts the screen, and the stylesheet's own timer is not needed.
    screen.dataset.live = "";

    /*
     * What is waited for. Each typeface is asked for by name, so the ones that
     * are only used further down the page are fetched now too. The page's own
     * files, and anything it shows that has to be fetched, are in when the
     * browser says the page has loaded. The hero says so on itself once its
     * picture is drawn, or once it has fallen back to the still artwork; it is
     * looked for when the page is all there, in case it was sent after the rest.
     */
    const loaded = new Promise<void>((done) => {
      if (document.readyState === "complete") done();
      else window.addEventListener("load", () => done(), { once: true });
    });
    const drawn = loaded.then(
      () =>
        new Promise<void>((done) => {
          const hero = document.querySelector<HTMLElement>("[data-hero]");
          if (over || !hero || hero.dataset.art) return done();
          watching = new MutationObserver(() => {
            if (hero.dataset.art) done();
          });
          watching.observe(hero, { attributes: true, attributeFilter: ["data-art"] });
        }),
    );
    const waits: Promise<unknown>[] = [
      ...fonts.map((family) => document.fonts.load(`1em ${family}`)),
      Promise.all([loaded, document.fonts.ready]),
      drawn,
    ];
    let arrived = 0;
    let arrivedAt = performance.now();
    // One that fails counts as in: the page has a stand-in for it, and should not be kept waiting.
    for (const wait of waits) {
      wait
        .catch(() => {})
        .then(() => {
          arrived++;
          arrivedAt = performance.now();
        });
    }

    /*
     * The opening. The cut-out starts as the mark exactly as it stands, in the
     * middle of a turn or not, draws in a little, and then grows by even
     * proportions, finishing the turn as it goes, until its waist is past the
     * corners of the screen. Its fill thins away as it grows, to show what is
     * behind it, and a line of light runs round its edge.
     */
    const open = (from: number) => {
      setSiteOpening();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return fade();
      // A hero waiting as the star has put the page's text away, and brings it back itself as it comes home.
      const led = document.documentElement.hasAttribute("data-hero-film");

      const x = screen.clientWidth / 2;
      const y = screen.clientHeight / 2;
      const stands = new DOMMatrixReadOnly(getComputedStyle(mark).transform);
      const small = mark.offsetWidth * MARK * Math.hypot(stands.a, stands.b);
      const large = (Math.hypot(x, y) / WAIST) * 1.03;
      const turned = Math.atan2(stands.b, stands.a);
      // The star looks the same every quarter turn, so it ends on the first one that gives it at least half a quarter to travel.
      const quarter = Math.PI / 2;
      const turns = Math.ceil(turned / quarter + 0.5) * quarter;

      const step = (now: number) => {
        const t = clamp01((now - from) / OPENING);
        // Slow to start and slow to finish, and a little the wrong way first.
        const grown = t * t * t * (t * (t * 6 - 15) + 10) - 0.045 * Math.sin(Math.PI * clamp01(t / 0.3)) ** 2;
        const shape = star(x, y, small * (large / small) ** grown, turned + (turns - turned) * smooth(t / 0.7));
        veil.setAttribute("d", `M-9999-9999H19999V19999H-9999Z${shape}`);
        plug.setAttribute("d", shape);
        plug.style.opacity = String(1 - smooth((t - 0.08) / 0.3));
        rim.setAttribute("d", shape);
        rim.style.opacity = String(smooth(t / 0.15) * (1 - smooth((t - 0.45) / 0.45)));

        if (!led && t >= ENTRANCE) setSiteReady();
        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        // The hero says when the text may come in. Should it not, for whatever reason, the text comes in anyway.
        timer = window.setTimeout(setSiteReady, 2500);
        setGone(true);
      };

      // The first frame is drawn before the mark is taken away and the screen's own dark let go, so nothing shows between the two.
      step(from);
      mark.style.visibility = "hidden";
      screen.dataset.state = "opening";
    };

    /*
     * The count. It follows what has arrived, each thing waited for counting
     * the same. While something is still on its way it creeps towards the
     * next arrival without reaching it, so it never looks stuck.
     */
    let shown = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, Math.max(0, now - last) / 1000);
      last = now;
      const share = 100 / waits.length;
      // Both clocks start when the page was asked for.
      const all = arrived === waits.length || now > LONGEST;
      const goal = all ? 100 : (arrived + 0.8 * (1 - Math.exp((arrivedAt - now) / 1500))) * share;
      shown = Math.min(100, shown + Math.min(Math.max(0, goal - shown), PACE * dt));
      count.textContent = String(Math.floor(shown)).padStart(3, "0");
      bar.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;
      if (shown < 100) frame = requestAnimationFrame(tick);
      else open(now);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      over = true;
      watching?.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [fonts]);

  if (gone) return null;

  return (
    <div ref={screenRef} role="status" className="loader">
      {/* The opening is drawn here, in the screen's own pixels: the dark with the star cut out of it, the star's fill, and its edge. */}
      <svg aria-hidden className="absolute inset-0 size-full">
        <path data-veil fillRule="evenodd" className="fill-night" />
        <path data-plug className="fill-blue" />
        <path data-rim fill="none" strokeWidth="1.5" className="stroke-sky" />
      </svg>

      <span data-mark className="loader-star">
        <StarMark className="size-9 text-blue" />
      </span>

      <div aria-hidden className="loader-foot absolute inset-x-0 bottom-0 px-page pb-6 md:pb-8">
        <p className="mono-label flex justify-between text-mist">
          <span>Polaris Consulting</span>
          <span data-count className="text-white tabular-nums">
            000
          </span>
        </p>
        <div className="mt-3 h-px bg-white/15">
          <div data-bar className="loader-bar h-full bg-sky" />
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}
