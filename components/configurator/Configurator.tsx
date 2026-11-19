"use client";

import { useLenis } from "lenis/react";
import { ButtonArrow, buttonClass } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Controls } from "@/components/configurator/Controls";
import { DashboardPreview } from "@/components/configurator/DashboardPreview";
import { setBlueprint, useBlueprint } from "@/lib/blueprint-store";
import { estimateWeeks, summarise } from "@/lib/configurator";
import { whatsappLink } from "@/lib/content";

export function Configurator({ tone = "white" }: { tone?: "white" | "surface" }) {
  const bp = useBlueprint();
  const lenis = useLenis();
  const count = bp.modules.length;

  const sendToForm = () => {
    // Marks the blueprint as chosen, so the enquiry form attaches it.
    setBlueprint((b) => b);
    const focusName = () => document.getElementById("enquiry-name")?.focus({ preventScroll: true });
    if (lenis) {
      lenis.scrollTo("#contact", { offset: -68, onComplete: focusName });
    } else {
      document.getElementById("contact")?.scrollIntoView();
      focusName();
    }
  };

  return (
    <Section id="build" tone={tone} labelledBy="build-title">
      <SectionHeader
        id="build-title"
        label="Try it yourself"
        title="Build your ERP"
        body="Pick your industry and the modules you need. The preview updates as you go."
      />

      {/* Side by side only from "xl": any narrower and the preview is too tight to read. */}
      <Reveal delay={0.05} className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <Controls bp={bp} />
        </div>

        <div className="space-y-6">
          <DashboardPreview modules={bp.modules} size={bp.size} />

          <div className="flex flex-col gap-6 border-4 border-ink bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
            <div aria-live="polite">
              <p className="text-title font-black uppercase text-ink">
                {count === 0
                  ? "Pick a module to see your plan"
                  : `${count} ${count === 1 ? "module" : "modules"}, live in about ${estimateWeeks(bp)} weeks`}
              </p>
              <p className="mt-1 text-small text-slate">
                An indicative estimate. Your final plan is set after discovery.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(`Hi Polaris, here is my ERP blueprint:\n${summarise(bp)}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary", "sm:flex-1 lg:flex-none")}
              >
                Send on WhatsApp
              </a>
              <button
                type="button"
                onClick={sendToForm}
                disabled={count === 0}
                className={buttonClass("primary", "sm:flex-1 lg:flex-none")}
              >
                Send me this blueprint
                <ButtonArrow />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
