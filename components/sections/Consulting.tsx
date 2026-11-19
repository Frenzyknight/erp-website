import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { consultingServices } from "@/lib/content";

export function Consulting() {
  return (
    <Section id="consulting" labelledBy="consulting-title">
      <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <SectionHeader
            id="consulting-title"
            label="Consulting"
            title="Not ready for software yet? Start with the process."
            body="Many engagements begin here. We review how the work gets done, remove what slows it down, and prepare the business for what comes next."
            layout="stacked"
          />
          <Reveal delay={0.05}>
            <ButtonLink href="#contact" variant="secondary" arrow className="mt-9 w-full sm:w-auto">
              Ask for a gap assessment
            </ButtonLink>
          </Reveal>
        </div>

        <dl className="border-b-4 border-ink lg:col-span-7">
          {consultingServices.map((s, i) => (
            <Reveal
              key={s.title}
              className="group grid gap-x-6 gap-y-2 border-t-4 border-ink px-4 py-6 transition-colors duration-150 ease-linear hover:bg-ink sm:grid-cols-[16rem_1fr]"
            >
              <dt className="flex gap-4 text-body font-bold uppercase text-ink transition-colors duration-150 ease-linear group-hover:text-white">
                <span aria-hidden className="text-label leading-[inherit] text-blue transition-colors duration-150 ease-linear group-hover:text-sky">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </dt>
              <dd className="text-body text-slate transition-colors duration-150 ease-linear group-hover:text-white">
                {s.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
