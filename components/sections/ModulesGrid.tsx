import { Section, SectionHeader } from "@/components/ui/Section";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { StripCard } from "@/components/ui/StripCard";
import { Reveal } from "@/components/motion/Reveal";
import { erpModules } from "@/lib/content";

/** The eight modules, one card each: what it is for, then what is inside it. */
export function ModulesGrid() {
  return (
    <Section id="modules" labelledBy="modules-title">
      <SectionHeader
        id="modules-title"
        label="The modules"
        title="Eight modules. Take only the ones you need."
        body="Each one is designed around your processes, and they all connect, so the business runs on one flow."
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 xl:grid-cols-4">
        {erpModules.map((m, i) => (
          <li key={m.id}>
            <Reveal delay={(i % 4) * 0.09} className="h-full">
              <StripCard index={i} icon={<ModuleIcon id={m.id} className="size-7" />}>
                <h3 className="mt-10 text-body font-semibold text-ink">{m.name}</h3>
                <p className="mt-1.5 text-body text-slate">{m.outcome}</p>
                <span aria-hidden className="my-4 h-px w-full bg-line" />
                <p className="mt-auto text-caption text-muted">{m.features.join(", ")}</p>
              </StripCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
