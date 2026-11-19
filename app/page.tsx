import { Eye, PiggyBank, ShieldCheck, Zap } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Benefits } from "@/components/sections/Benefits";
import { Process } from "@/components/sections/Process";
import { Configurator } from "@/components/configurator/Configurator";
import { CrmShowcase } from "@/components/sections/CrmShowcase";
import { Consulting } from "@/components/sections/Consulting";
import { Contact } from "@/components/sections/Contact";
import { crm, erpBenefits, statements } from "@/lib/content";

const benefitIcons = [PiggyBank, Zap, ShieldCheck, Eye];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement label="The problem" text={statements.home} />
      <Benefits
        id="benefits-title"
        label="The result"
        title="What changes when the software fits."
        items={erpBenefits.map((b, i) => ({ ...b, icon: benefitIcons[i] }))}
      />
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
      <Contact />
    </>
  );
}
