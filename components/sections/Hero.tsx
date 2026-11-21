import { HeroFilm } from "@/components/hero/HeroFilm";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { process } from "@/lib/content";

/**
 * The homepage opening. The ribbon picture fills the screen; the headline
 * sits at its foot on the left, and the supporting line and the two actions,
 * one for each product, sit level with it on the right. Holding the pointer
 * down on the picture plays its film, which names the three steps of the
 * process on the way to the star.
 */
export function Hero() {
  return (
    <HeroFilm words={process.map((step) => step.title)}>
      {/* The ribbons run behind the text, so the foot of the picture is darkened a little under it. */}
      <span
        aria-hidden
        className="absolute inset-x-0 -top-32 -bottom-[var(--sheet-r)] bg-linear-to-t from-night/70 via-night/25 to-transparent"
      />
      <div className="relative grid items-end gap-x-16 gap-y-8 px-page pt-[calc(var(--header-h)+2rem)] pb-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:pb-14">
        <div className="flex flex-col gap-5 lg:gap-7">
          <Reveal>
            <Eyebrow onDark>Custom ERP + Post-Sales CRM Agent</Eyebrow>
          </Reveal>
          <h1 className="max-w-[13em] text-h1 text-balance">
            <SplitText
              text="Software that fits your business, and keeps customers coming back."
              accent="fits your business,"
              accentClass="text-sky"
            />
          </h1>
        </div>

        <Reveal delay={0.09} className="flex max-w-[27rem] flex-col gap-6">
          <p className="text-md text-pretty text-white/90">
            We build custom ERP around the way your teams actually work, and a WhatsApp agent that follows up after
            every sale.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/custom-erp">Explore Custom ERP</ButtonLink>
            <ButtonLink href="/crm-agent" variant="ghost">
              Explore the CRM Agent
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </HeroFilm>
  );
}
