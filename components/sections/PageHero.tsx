import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { HeroArt } from "@/components/ui/HeroArt";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

type Cta = { href: string; label: string };
export type HeroFact = { icon: LucideIcon; title: string; body: string };

/**
 * The opening of every page, filling the screen on navy. The headline sits
 * low on the left over the artwork, which takes a little more than half the
 * width and stops at a hard edge. The right side holds a picture of the
 * product, then the supporting line and the two actions, level with the
 * headline's foot. A hairline and a row of short facts can close it. On
 * phones the artwork backs the headline only, and the rest stacks under it.
 */
export function PageHero({
  label,
  title,
  accent,
  body,
  primary,
  secondary,
  note,
  media,
  factsTitle,
  facts,
}: {
  label: string;
  title: string;
  /** A phrase from the title to set in the accent colour. */
  accent?: string;
  body: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
  media?: React.ReactNode;
  factsTitle?: string;
  facts?: HeroFact[];
}) {
  return (
    <section
      data-tone="dark"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-navy pb-[var(--sheet-r)] text-white"
    >
      <div className="grid flex-1 lg:grid-cols-[56fr_44fr]">
        {/* Positioned on phones, so the artwork fills this block; from "lg" the artwork fills the section's left side instead. */}
        <div className="relative flex min-h-[26rem] flex-col justify-end px-page pt-[calc(var(--header-h)+3rem)] pb-10 lg:static lg:min-h-0 lg:pb-12">
          <HeroArt className="absolute top-0 left-0 size-full lg:w-[56%]" />
          {/* On phones the headline runs across the bright folds, so they are dimmed behind it. */}
          <span aria-hidden className="absolute inset-0 bg-linear-to-r from-navy/90 via-navy/60 to-navy/10 lg:hidden" />
          <div className="relative flex flex-col gap-5 lg:gap-7">
            <Reveal>
              <Eyebrow onDark>{label}</Eyebrow>
            </Reveal>
            <h1 className="max-w-[13em] text-h1 text-balance">
              <SplitText text={title} accent={accent} accentClass="text-sky" />
            </h1>
          </div>
        </div>

        <div className="relative flex flex-col justify-end gap-8 px-page pt-8 pb-10 lg:pt-[calc(var(--header-h)+2rem)] lg:pb-12 lg:pl-16 xl:pl-24">
          {media && (
            <div aria-hidden className="order-last w-full max-w-[27rem] self-center lg:order-none lg:self-start">
              {media}
            </div>
          )}
          <Reveal delay={0.09} className="flex max-w-[27rem] flex-col gap-6">
            <p className="text-md text-pretty text-white/90">{body}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href={primary.href}>{primary.label}</ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="ghost">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            {note && <p className="text-caption text-mist">{note}</p>}
          </Reveal>
        </div>
      </div>

      {facts && (
        <div className="relative px-page">
          <div className="grid gap-x-6 gap-y-8 border-t border-white/20 py-8 lg:grid-cols-5 lg:py-10">
            {factsTitle && <p className="mono-label max-w-[15rem] text-white/70">{factsTitle}</p>}
            <ul className={`grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 ${factsTitle ? "lg:col-span-4" : "lg:col-span-5"}`}>
              {facts.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex flex-col gap-3">
                  <Icon aria-hidden className="size-5 text-sky" strokeWidth={1.5} />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-medium text-white">{title}</span>
                    <span className="text-caption text-white/65">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* A band of dots closes the hero; the first sheet rides up over its foot. */}
      <div aria-hidden className="relative h-14 dot-grid md:h-20" />
    </section>
  );
}
