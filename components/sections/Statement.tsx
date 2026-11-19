import { Section, SectionLabel } from "@/components/ui/Section";
import { ScrollText } from "@/components/motion/ScrollText";

/** One large paragraph, offset to the right of its label, that fills in word by word as the visitor scrolls. */
export function Statement({ label, text }: { label: string; text: string }) {
  return (
    <Section>
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <SectionLabel className="lg:col-span-3 lg:pt-2">{label}</SectionLabel>
        <ScrollText text={text} className="text-lead text-ink lg:col-span-9" />
      </div>
    </Section>
  );
}
