"use client";

import { useSyncExternalStore } from "react";

/*
 * Whether this is a slow device. A slow one gets the "lite" site: the hero's
 * picture is drawn smaller and less often, and the motion that is only there
 * for show is left out (see `lite` in the stylesheet, and `useLite` below).
 *
 * The first answer is a guess from what the browser says about the device
 * and its graphics chip. The hero then times its own picture, and calls
 * `goLite` if the device turns out to be slower than it looked. It never goes
 * the other way.
 *
 * To see either version on any device, add ?perf=lite or ?perf=full to the
 * address. "full" only overrules the guess: a hero that cannot keep up still
 * steps down.
 */

let lite: boolean | null = null;
const listeners = new Set<() => void>();

type Hints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/** What the address asks for, if anything. */
export function forcedTier(): "lite" | "full" | null {
  const asked = new URLSearchParams(window.location.search).get("perf");
  return asked === "lite" || asked === "full" ? asked : null;
}

/* Graphics that are drawn by the processor, and the chips of entry-level and older phones. */
const WEAK_CHIPS =
  /swiftshader|llvmpipe|softpipe|software|basic render|mali-4\d\d|mali-t\d{3}|adreno \(tm\) (?:[2-4]\d\d|50\d|51\d)|powervr sgx|powervr rogue ge|videocore/i;

/* Asks a graphics context, made for the question and let go straight after, which chip it draws with. */
function weakChip() {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return false;
    const named = gl.getExtension("WEBGL_debug_renderer_info");
    const chip = String(gl.getParameter(named ? named.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return WEAK_CHIPS.test(chip);
  } catch {
    return false;
  }
}

function guess() {
  const forced = forcedTier();
  if (forced) return forced === "lite";
  const hints = navigator as Hints;
  // Someone saving data has asked for less. Two gigabytes of memory or two cores is an entry-level phone or an old laptop.
  return (
    hints.connection?.saveData === true ||
    (hints.deviceMemory !== undefined && hints.deviceMemory <= 2) ||
    (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 2) ||
    weakChip()
  );
}

export function isLite() {
  if (lite === null) lite = guess();
  return lite;
}

/** Switches the whole site to its lite version, for the rest of the visit. */
export function goLite() {
  if (isLite()) return;
  lite = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True on a slow device. Always false on the server and on the first render, like a media query. */
export function useLite() {
  return useSyncExternalStore(subscribe, isLite, () => false);
}

/*
 * Arriving. The loading screen covers the page until everything it needs is
 * there, and then opens. A hero that can do so waits behind it as the star,
 * and comes home from the star once the screen has opened onto it.
 *
 * "Opening" is the moment the screen starts to open. "Ready" is the moment
 * the page's text may make its entrance: partway through the opening, or, if
 * a hero is coming home from the star, when it brings its text back.
 */
let openedAt = 0;
let ready = false;

export function setSiteOpening() {
  if (!openedAt) openedAt = performance.now();
}

/** When the loading screen started to open, on the clock `performance.now()` reads. Zero while it is still up. */
export function siteOpenedAt() {
  return openedAt;
}

export function setSiteReady() {
  if (ready) return;
  setSiteOpening();
  ready = true;
  listeners.forEach((listener) => listener());
}

export function isSiteReady() {
  return ready;
}

export function useSiteReady() {
  return useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );
}
