import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { tagClass } from "@/components/ui/Chip";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { crm, erpModules } from "@/lib/content";

const card = "flex h-full flex-col items-start rounded-lg p-5 md:p-8";

/**
 * The two things Polaris builds, as a pair of equal cards set close together:
 * the ERP on navy, the CRM agent on the pale panel colour. Each names the
 * product in small capitals, lists what is inside it, states its one-line
 * promise over a hairline, and links to its own page. On a phone the pair is
 * swiped through, with the edge of the second card showing beside the first.
 */
export function Offerings() {
  return (
    <Section labelledBy="offerings-title">
      <SectionHeader
        id="offerings-title"
        align="side"
        label="What we build"
        title="One team. Two things we build."
        accent="Two things we build."
        body="A custom ERP for how your teams work, and a WhatsApp agent for what happens after the sale."
      />

      <Carousel label="What we build" className="mt-12 md:mt-20" track="md:grid md:gap-2 lg:grid-cols-2 lg:gap-3">
        <Reveal className="h-full">
          <article className={`${card} bg-navy`}>
            <p className="mono-label text-mist">Custom ERP</p>
            <h3 className="mt-4 max-w-[17em] text-h4 text-balance text-white">
              An ERP designed around how your organisation actually works.
            </h3>
            <ul aria-label="ERP modules" className="mt-8 flex flex-wrap gap-1.5 md:mt-10">
              {erpModules.map((m) => (
                <li key={m.id} className={`${tagClass} bg-white/10 text-white`}>
                  <ModuleIcon id={m.id} className="size-4 shrink-0 text-sky" />
                  {m.name}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex w-full flex-col items-start gap-6 pt-10 md:pt-14">
              <p className="w-full border-t border-white/20 pt-5 text-body text-white/85">
                Live in about 3 months, for less than a standard ERP.
              </p>
              <ButtonLink href="/custom-erp" className="w-full sm:w-auto">
                Explore Custom ERP
              </ButtonLink>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.09} className="h-full">
          <article className={`${card} bg-line`}>
            <p className="mono-label text-muted">Post-Sales CRM Agent</p>
            <h3 className="mt-4 max-w-[17em] text-h4 text-balance text-navy">
              Turn every sale into a lasting customer relationship.
            </h3>
            <ul aria-label="CRM agent features" className="mt-8 flex flex-wrap gap-1.5 md:mt-10">
              {crm.features.map((f) => (
                <li key={f} className={`${tagClass} bg-white text-navy`}>
                  <Check aria-hidden className="size-4 shrink-0 text-blue" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex w-full flex-col items-start gap-6 pt-10 md:pt-14">
              <p className="w-full border-t border-navy/15 pt-5 text-body text-navy">
                Runs on the official WhatsApp Business API, with the customer data you already have.
              </p>
              <ButtonLink href="/crm-agent" variant="dark" className="w-full sm:w-auto">
                Explore the CRM Agent
              </ButtonLink>
            </div>
          </article>
        </Reveal>
      </Carousel>
    </Section>
  );
}
