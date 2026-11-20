import { BadgeCheck, Blocks, CalendarClock, Receipt } from "lucide-react";
import { PageHero, type HeroFact } from "@/components/sections/PageHero";
import { ProductPair } from "@/components/ui/ProductGlance";

/* Two facts for each product: the ERP first, then the CRM agent. */
const facts: HeroFact[] = [
  { icon: CalendarClock, title: "Live in about 3 months", body: "From kick-off to an ERP your team can use" },
  { icon: Blocks, title: "Only the modules you need", body: "For less than a standard ERP" },
  { icon: BadgeCheck, title: "Official WhatsApp Business API", body: "Approved message templates" },
  { icon: Receipt, title: "Works with your billing software", body: "Uses the customer data you already have" },
];

/** The homepage opening. It introduces both products at once, and each action leads to one of them. */
export function Hero() {
  return (
    <PageHero
      label="Custom ERP + Post-Sales CRM Agent"
      title="Software that fits your business, and keeps customers coming back."
      body="We build custom ERP around the way your teams actually work, and a WhatsApp agent that follows up after every sale."
      primary={{ href: "/custom-erp", label: "Explore Custom ERP" }}
      secondary={{ href: "/crm-agent", label: "Explore the CRM Agent" }}
      media={<ProductPair />}
      factsTitle="Built around the way your business already runs"
      facts={facts}
    />
  );
}
