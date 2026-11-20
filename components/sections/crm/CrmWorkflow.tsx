"use client";

import { Bot, Receipt, RefreshCw, Send, UserRound } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StepTrail } from "@/components/ui/StepTrail";
import { AgentVisual, BillVisual, CustomerVisual, SendVisual, SyncVisual } from "@/components/ui/WorkflowVisuals";
import { crm } from "@/lib/content";

const icons = [Receipt, RefreshCw, Bot, Send, UserRound];
const visuals = [BillVisual, SyncVisual, AgentVisual, SendVisual, CustomerVisual];
const steps = crm.workflow.map((stage, i) => ({ ...stage, icon: icons[i], Visual: visuals[i] }));

/** How it works: the five stages a bill passes through, laid out like "How we work" on the home page. */
export function CrmWorkflow() {
  return (
    <Section id="how-it-works" tone="surface" labelledBy="workflow-title">
      <SectionHeader
        id="workflow-title"
        label="How it works"
        title="What happens after every bill"
        accent="after every bill"
        body="The agent connects to your existing billing and customer data, and handles the rest."
        align="center"
      />
      <StepTrail steps={steps} />
    </Section>
  );
}
