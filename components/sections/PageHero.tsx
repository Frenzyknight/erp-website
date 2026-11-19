import { ButtonLink } from "@/components/ui/Button";
import { container } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

type Cta = { href: string; label: string };

/**
 * The opening of every page: a label, a headline large enough to act as the
 * image, then a ruled band that splits 7:5 between the supporting line and
 * the calls to action. Anything passed as children follows as a final band.
 */
export function PageHero({
  label,
  title,
  body,
  primary,
  secondary,
  note,
  size = "display",
  children,
}: {
  label: string;
  title: React.ReactNode;
  body: string;
  primary: Cta;
  secondary?: Cta;
  note?: string;
  size?: "mega" | "display";
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b-4 border-ink">
      <Reveal className={`${container} pb-12 pt-14 sm:pt-20 lg:pb-16`}>
        <p className="text-label uppercase text-blue">{label}</p>
        <h1 className={`mt-6 text-balance uppercase text-ink ${size === "mega" ? "text-mega" : "text-display"}`}>
          {title}
        </h1>
      </Reveal>

      <div className="border-t-4 border-ink">
        <div className={`${container} grid lg:grid-cols-12`}>
          <p className="max-w-2xl py-10 text-pretty text-title font-medium text-ink lg:col-span-7 lg:border-r-4 lg:border-ink lg:py-14 lg:pr-12">
            {body}
          </p>
          <div className="flex flex-col justify-center gap-4 pb-12 lg:col-span-5 lg:py-14 lg:pl-12">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={primary.href} arrow className="sm:flex-1">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="secondary" className="sm:flex-1">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            {note && <p className="text-small font-medium text-slate">{note}</p>}
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
