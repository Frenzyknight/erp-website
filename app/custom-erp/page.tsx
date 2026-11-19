import type { Metadata } from "next";
import { Eye, PiggyBank, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Statement } from "@/components/sections/Statement";
import { ModulesGrid } from "@/components/sections/ModulesGrid";
import { Benefits } from "@/components/sections/Benefits";
import { Investment } from "@/components/sections/Investment";
import { Configurator } from "@/components/configurator/Configurator";
import { Contact } from "@/components/sections/Contact";
import { erpBenefits, statements } from "@/lib/content";

export const metadata: Metadata = {
  title: "Custom ERP",
  description:
    "Custom ERP modules for Sales & CRM, Purchase, Inventory, Production, Quality, Finance, HR and Dashboards, built around how your organisation works. Live in about 3 months, for less than a standard ERP.",
};

const benefitIcons = [PiggyBank, Zap, ShieldCheck, Eye];

export default function CustomErpPage() {
  return (
    <>
      <PageHero
        label="Custom ERP"
        title="An ERP designed around how your organisation actually works."
        body="We fix the process first, then build only the modules your business runs on."
        primary={{ href: "#build", label: "Build your ERP" }}
        secondary={{ href: "#contact", label: "Book a free process review" }}
      />
      <Statement label="The problem" text={statements.erp} />
      <ModulesGrid />
      <Benefits
        id="erp-benefits-title"
        label="The result"
        title="What a custom ERP changes for you."
        items={erpBenefits.map((b, i) => ({ ...b, icon: benefitIcons[i] }))}
      />
      <Investment />
      <Configurator />
      <Contact />
    </>
  );
}
