"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useReducedMotionSafe } from "@/lib/hooks";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.11,
          smoothWheel: !reduce,
          // No offset here: the stylesheet's scroll-margin on [id] already clears the
          // navigation bar, and the scroller honours it, so adding one would double it.
          anchors: { immediate: reduce },
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
