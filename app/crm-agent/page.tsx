import type { Metadata } from "next";
import { Heart, Repeat, Star, Store } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CrmCompare } from "@/components/sections/crm/CrmCompare";
import { CrmShowcase } from "@/components/sections/CrmShowcase";
import { CrmWorkflow } from "@/components/sections/crm/CrmWorkflow";
import { Benefits } from "@/components/sections/Benefits";
import { CrmRollout } from "@/components/sections/crm/CrmRollout";
import { Contact } from "@/components/sections/Contact";
import { crm } from "@/lib/content";

export const metadata: Metadata = {
  title: "Post-Sales CRM Agent",
  description:
    "Automate post-billing thank-yous, birthday and festival greetings, targeted offers and feedback on WhatsApp through the official WhatsApp Business API. Connects to your existing billing software.",
};

const gainIcons = [Repeat, Heart, Store, Star];

export default function CrmAgentPage() {
  return (
    <>
      <PageHero
        label="Post-Sales CRM Agent"
        title="Turn every sale into a lasting customer relationship."
        body="Our agent connects to your billing software and keeps the conversation going on WhatsApp: automatically, personally and on time."
        primary={{ href: "#contact", label: "Get a demo" }}
        secondary={{ href: "#how-it-works", label: "See how it works" }}
      />
      <CrmCompare />
      <CrmShowcase
        label="The solution"
        title="One agent for everything after the sale."
        body="It runs on the official WhatsApp Business API and uses the customer data you already have."
        items={crm.solution}
      />
      <CrmWorkflow />
      <Benefits
        id="crm-gains-title"
        label="The result"
        title="What your business gains."
        items={crm.gains.map((g, i) => ({ ...g, icon: gainIcons[i] }))}
        tone="surface"
      />
      <CrmRollout />
      <Contact
        title="Ready to turn every sale into a lasting relationship?"
        body="Tell us which billing software you use and we will show you how the agent would work for your business."
        defaultInterest="crm"
        formTitle="Get a demo"
        submitLabel="Request my demo"
      />
    </>
  );
}
