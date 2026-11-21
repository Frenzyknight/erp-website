"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useLite } from "@/lib/device";
import { useReducedMotionSafe } from "@/lib/hooks";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();
  // Easing the wheel means moving the page from script on every frame. A slow device scrolls the browser's own way.
  const lite = useLite();

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: 0.11,
          smoothWheel: !reduce && !lite,
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
