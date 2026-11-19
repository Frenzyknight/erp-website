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
          // Lands sections flush under the fixed navigation bar (4rem plus its 4px border).
          anchors: { offset: -68, immediate: reduce },
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
