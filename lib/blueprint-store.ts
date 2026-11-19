"use client";

import { useSyncExternalStore } from "react";
import { defaultBlueprint, fromSearch, toSearch, type Blueprint } from "@/lib/configurator";

let state: Blueprint | null = null;
const listeners = new Set<() => void>();

function read(): Blueprint {
  if (!state) state = fromSearch(window.location.search) ?? defaultBlueprint;
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setBlueprint(update: (bp: Blueprint) => Blueprint) {
  state = { ...update(read()), touched: true };
  const { pathname, hash } = window.location;
  window.history.replaceState(window.history.state, "", `${pathname}?${toSearch(state)}${hash}`);
  listeners.forEach((l) => l());
}

export function useBlueprint() {
  return useSyncExternalStore(subscribe, read, () => defaultBlueprint);
}
