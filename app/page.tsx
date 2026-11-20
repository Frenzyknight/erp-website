import { Hero } from "@/components/sections/Hero";
import { Offerings } from "@/components/sections/Offerings";
import { Statement } from "@/components/sections/Statement";
import { ResultsBento } from "@/components/sections/ResultsBento";
import { Process } from "@/components/sections/Process";
import { Configurator } from "@/components/configurator/Configurator";
import { CrmShowcase } from "@/components/sections/CrmShowcase";
import { Consulting } from "@/components/sections/Consulting";
import { Contact } from "@/components/sections/Contact";
import { crm, statements } from "@/lib/content";

/* Both products are introduced first; the ERP story follows, then the CRM agent, then consulting. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Offerings />
      <Statement label="The problem" text={statements.home} />
      <ResultsBento id="benefits-title" title="What changes when the software fits." />
      <Process />
      <Configurator />
      <CrmShowcase
        label="Post-Sales CRM Agent"
        title="Keep customers coming back, on WhatsApp."
        body="Our agent connects to your billing software and follows up after every sale, automatically."
        items={crm.teaser}
        cta={{ href: "/crm-agent", label: "See how the agent works" }}
      />
      <Consulting />
      <Contact title="Ready for software that fits the way you work?" />
    </>
  );
}
