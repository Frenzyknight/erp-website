import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { tagClass } from "@/components/ui/Chip";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { crm, erpModules } from "@/lib/content";

const card =
  "flex h-full flex-col items-start gap-6 rounded-md p-6 transition-transform duration-1000 ease-rise md:gap-8 md:rounded-lg md:p-8 lg:hover:scale-[1.02]";

/**
 * The two things Polaris builds, as a pair of equal cards: the ERP on navy,
 * the CRM agent on the quiet surface. Each lists what is inside it, states
 * its one-line promise, and links to its own page.
 */
export function Offerings() {
  return (
    <Section tone="line" labelledBy="offerings-title">
      <SectionHeader
        id="offerings-title"
        title="One team. Two things we build."
        body="A custom ERP for how your teams work, and a WhatsApp agent for what happens after the sale."
        align="center"
      />

      <div className="mx-auto mt-8 grid max-w-[1240px] gap-4 md:mt-12 md:gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <article className={`${card} bg-navy`}>
            <div className="flex flex-col gap-3">
              <p className="text-caption text-mist">Custom ERP</p>
              <h3 className="text-h4 text-balance text-white">
                An ERP designed around how your organisation actually works.
              </h3>
            </div>
            <span aria-hidden className="h-px w-full bg-white/25" />
            <ul aria-label="ERP modules" className="flex flex-wrap gap-2">
              {erpModules.map((m) => (
                <li key={m.id} className={`${tagClass} bg-white/10 text-white`}>
                  <ModuleIcon id={m.id} className="size-4 shrink-0 text-sky" />
                  {m.name}
                </li>
              ))}
            </ul>
            <p className="mt-auto w-full rounded-sm bg-sky p-4 text-body font-semibold text-navy">
              Live in about 3 months, for less than a standard ERP.
            </p>
            <ButtonLink href="/custom-erp" variant="light" className="w-full sm:w-auto">
              Explore Custom ERP
            </ButtonLink>
          </article>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <article className={`${card} bg-surface`}>
            <div className="flex flex-col gap-3">
              <p className="text-caption text-muted">Post-Sales CRM Agent</p>
              <h3 className="text-h4 text-balance text-navy">Turn every sale into a lasting customer relationship.</h3>
            </div>
            <span aria-hidden className="h-px w-full bg-line" />
            <ul aria-label="CRM agent features" className="flex flex-wrap gap-2">
              {crm.features.map((f) => (
                <li key={f} className={`${tagClass} bg-line text-ink`}>
                  <Check aria-hidden className="size-4 shrink-0 text-blue" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-auto w-full rounded-sm bg-line p-4 text-body font-semibold text-ink">
              Runs on the official WhatsApp Business API, with the customer data you already have.
            </p>
            <ButtonLink href="/crm-agent" className="w-full sm:w-auto">
              Explore the CRM Agent
            </ButtonLink>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
