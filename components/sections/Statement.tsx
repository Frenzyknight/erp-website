import { Eyebrow, Section } from "@/components/ui/Section";
import { ScrollText } from "@/components/motion/ScrollText";

/** One large paragraph, offset to the right of its pill, that fills in word by word as the visitor scrolls. */
export function Statement({ label, text }: { label: string; text: string }) {
  return (
    <Section tone="surface">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-3 lg:pt-1.5">
          <Eyebrow>{label}</Eyebrow>
        </div>
        <ScrollText text={text} className="text-h3 text-navy lg:col-span-9" />
      </div>
    </Section>
  );
}
