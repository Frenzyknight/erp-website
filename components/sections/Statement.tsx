import { Eyebrow, Section, columns } from "@/components/ui/Section";
import { ScrollText } from "@/components/motion/ScrollText";

/**
 * One large paragraph on navy, to the right of its label, that lights up word by word as the visitor scrolls.
 * `scribble` is a phrase from the text that is written in by hand, in the accent colour.
 */
export function Statement({ label, text, scribble }: { label: string; text: string; scribble?: string }) {
  return (
    <Section tone="navy">
      <div className={columns}>
        <div className="lg:col-span-4 lg:pt-3">
          <Eyebrow onDark>{label}</Eyebrow>
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <ScrollText text={text} scribble={scribble} className="font-display text-h3 text-white" />
        </div>
      </div>
    </Section>
  );
}
