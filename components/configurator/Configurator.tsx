"use client";

import { useLenis } from "lenis/react";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Controls } from "@/components/configurator/Controls";
import { DashboardPreview } from "@/components/configurator/DashboardPreview";
import { setBlueprint, useBlueprint } from "@/lib/blueprint-store";
import { estimateWeeks, summarise } from "@/lib/configurator";
import { whatsappLink } from "@/lib/content";

/** A navy band with a centred heading, holding three light cards: the controls, the live preview, and the plan with its two actions. */
export function Configurator() {
  const bp = useBlueprint();
  const lenis = useLenis();
  const count = bp.modules.length;

  const sendToForm = () => {
    // Marks the blueprint as chosen, so the enquiry form attaches it.
    setBlueprint((b) => b);
    const focusName = () => document.getElementById("enquiry-name")?.focus({ preventScroll: true });
    if (lenis) {
      lenis.scrollTo("#contact", { onComplete: focusName });
    } else {
      document.getElementById("contact")?.scrollIntoView();
      focusName();
    }
  };

  return (
    <Section id="build" tone="navy" labelledBy="build-title">
      <SectionHeader
        id="build-title"
        label="Try it yourself"
        title="Build your ERP"
        body="Pick your industry and the modules you need. The preview updates as you go."
        align="center"
        onDark
      />

      {/* Side by side only from "xl": any narrower and the preview is too tight to read. */}
      <Reveal delay={0.09} className="mt-12 grid grid-cols-1 gap-2 md:mt-16 lg:gap-3 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <Controls bp={bp} />
        </div>

        <div className="space-y-2 lg:space-y-3">
          <div className="rounded-lg bg-line p-2 md:p-3">
            <DashboardPreview modules={bp.modules} size={bp.size} />
          </div>

          <div className="flex flex-col gap-6 rounded-lg bg-white p-6 md:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div aria-live="polite">
              <p className="font-display text-h5 text-navy">
                {count === 0
                  ? "Pick a module to see your plan"
                  : `${count} ${count === 1 ? "module" : "modules"}, live in about ${estimateWeeks(bp)} weeks`}
              </p>
              <p className="mt-2 text-caption text-muted">
                An indicative estimate. Your final plan is set after discovery.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a
                href={whatsappLink(`Hi Polaris, here is my ERP blueprint:\n${summarise(bp)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("light", "sm:flex-1 lg:flex-none")}
              >
                <ButtonLabel>Send on WhatsApp</ButtonLabel>
              </a>
              <button
                type="button"
                onClick={sendToForm}
                disabled={count === 0}
                className={buttonClass("primary", "sm:flex-1 lg:flex-none")}
              >
                <ButtonLabel>Send me this blueprint</ButtonLabel>
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
