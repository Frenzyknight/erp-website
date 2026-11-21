import { HeroFilm } from "@/components/hero/HeroFilm";
import type { HeroLook } from "@/components/hero/scene";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { process } from "@/lib/content";

type Cta = { href: string; label: string };

/**
 * The opening of every page but the homepage, laid out the same way as the
 * homepage's. The ribbon picture fills the screen in the page's own look;
 * the headline sits at its foot on the left, and the supporting line and the
 * two actions sit level with it on the right. Holding the pointer down on
 * the picture plays its film, which shows the page's three words on the way
 * to the star.
 */
export function PageHero({
  label,
  title,
  accent,
  body,
  primary,
  secondary,
  note,
  look,
  words = process.map((step) => step.title),
}: {
  label: string;
  title: string;
  /** A phrase from the title to set in the accent colour. */
  accent?: string;
  body: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
  /** The picture behind the headline. The homepage's hoops unless the page has its own. */
  look?: HeroLook;
  /** The three words the film shows. The steps of the process unless the page has its own. */
  words?: string[];
}) {
  return (
    <HeroFilm look={look} words={words}>
      {/* The ribbons run behind the text, so the foot of the picture is darkened a little under it. */}
      <span
        aria-hidden
        className="absolute inset-x-0 -top-32 -bottom-[var(--sheet-r)] bg-linear-to-t from-night/70 via-night/25 to-transparent"
      />
      <div className="relative grid items-end gap-x-16 gap-y-8 px-page pt-[calc(var(--header-h)+2rem)] pb-10 lg:grid-cols-[minmax(0,1fr)_27rem] lg:pb-14">
        <div className="flex flex-col gap-5 lg:gap-7">
          <Reveal>
            <Eyebrow onDark>{label}</Eyebrow>
          </Reveal>
          <h1 className="max-w-[13em] text-h1 text-balance">
            <SplitText text={title} accent={accent} accentClass="text-sky" />
          </h1>
        </div>

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
    </HeroFilm>
  );
}
