import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

type Cta = { href: string; label: string };
export type HeroFact = { icon: LucideIcon; title: string; body: string };

/**
 * The opening of every page. A navy block carries the pill, the headline, the
 * supporting line and two actions; beside it a gridded panel holds a picture
 * of the product, and together they fill the screen under the navigation bar.
 * A white strip of short facts can close it. Without a picture the navy block
 * takes the full width.
 */
export function PageHero({
  label,
  title,
  body,
  primary,
  secondary,
  note,
  media,
  factsTitle,
  facts,
}: {
  label: string;
  title: React.ReactNode;
  body: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
  media?: React.ReactNode;
  factsTitle?: string;
  facts?: HeroFact[];
}) {
  return (
    <section className="flex flex-col bg-surface lg:min-h-[calc(100svh-var(--header-h))]">
      <div className={`grid flex-1 ${media ? "lg:grid-cols-2" : ""}`}>
        {/* On phones and tablets the picture comes first and everything in the block is centred. */}
        <div
          className={`order-2 flex flex-col items-center justify-center gap-6 bg-navy px-page py-12 text-center md:py-16 lg:order-1 lg:gap-12 lg:py-20 ${
            media ? "lg:items-start lg:text-left" : "min-h-[70svh]"
          }`}
        >
          <Reveal className={`flex flex-col items-center gap-3 lg:gap-6 ${media ? "lg:items-start" : ""}`}>
            <Eyebrow onDark>{label}</Eyebrow>
            <h1 className="max-w-4xl text-h1 text-pretty text-white">{title}</h1>
            <p className="max-w-3xl text-lead text-pretty text-white lg:text-white/70">{body}</p>
          </Reveal>

          <Reveal
            delay={0.09}
            className={`flex w-full flex-col items-center gap-4 ${media ? "lg:items-start" : ""}`}
          >
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href={primary.href} variant="light">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="ghost">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            {note && <p className="text-caption text-mist">{note}</p>}
          </Reveal>
        </div>

        {media && (
          <div
            aria-hidden
            className="relative order-1 grid min-h-[375px] place-items-center overflow-hidden bg-surface py-8 grid-pattern md:min-h-[440px] lg:order-2"
          >
            {media}
          </div>
        )}
      </div>

      {facts && (
        <div className="bg-white">
          <div className="flex flex-col items-center gap-6 px-page py-12 lg:flex-row lg:gap-12 lg:py-8">
            {factsTitle && (
              <p className="max-w-[17rem] text-center text-md font-medium text-balance text-ink lg:shrink-0 lg:text-left">
                {factsTitle}
              </p>
            )}
            {/* "min-w-0" lets the four fixed-width facts narrow on a small laptop instead of pushing the page wide. */}
            <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 lg:flex lg:min-w-0 lg:flex-1 lg:justify-between">
              {facts.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex flex-col items-center gap-3 text-center lg:w-[200px] lg:gap-4">
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-surface text-navy">
                    <Icon aria-hidden className="size-7" strokeWidth={1.5} />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-body font-semibold text-ink">{title}</span>
                    <span className="text-caption text-muted">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
