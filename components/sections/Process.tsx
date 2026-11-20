"use client";

import { Blocks, ListChecks, Search } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StepTrail } from "@/components/ui/StepTrail";
import { BuildVisual, ImproveVisual, UnderstandVisual } from "@/components/ui/ProcessVisuals";
import { process } from "@/lib/content";

const icons = [Search, ListChecks, Blocks];
const visuals = [UnderstandVisual, ImproveVisual, BuildVisual];
const steps = process.map((step, i) => ({ ...step, icon: icons[i], Visual: visuals[i] }));

/** How we work: the three steps as cards along a path that is drawn as the visitor scrolls. */
export function Process() {
  return (
    <Section tone="surface" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        label="How we work"
        title="Understand first. Improve next. Build last."
        accent="Build last."
        body="Technology follows the design, never the reverse."
        align="center"
      />
      <StepTrail steps={steps} />
    </Section>
  );
}
