import { Eyebrow, Section, columns } from "@/components/ui/Section";
import { ScrollText } from "@/components/motion/ScrollText";

/** One large paragraph on navy, to the right of its label, that lights up word by word as the visitor scrolls. */
export function Statement({ label, text }: { label: string; text: string }) {
  return (
    <Section tone="navy">
      <div className={columns}>
        <div className="lg:col-span-4 lg:pt-3">
          <Eyebrow onDark>{label}</Eyebrow>
        </div>
        <ScrollText text={text} className="font-display text-h3 text-white lg:col-span-8 lg:col-start-5" />
      </div>
    </Section>
  );
}
