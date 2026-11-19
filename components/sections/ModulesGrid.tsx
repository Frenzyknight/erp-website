import { Section, SectionHeader } from "@/components/ui/Section";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Reveal } from "@/components/motion/Reveal";
import { erpModules } from "@/lib/content";

export function ModulesGrid() {
  return (
    <Section id="modules" tone="surface" labelledBy="modules-title">
      <SectionHeader
        id="modules-title"
        label="The modules"
        title="Eight modules. Take only the ones you need."
        body="Each one is designed around your processes, and they all connect, so the business runs on one flow."
      />
      <Reveal delay={0.05}>
        <ul className="mt-14 grid border-l-4 border-t-4 border-ink sm:grid-cols-2 lg:grid-cols-4">
          {erpModules.map((m, i) => (
            <li
              key={m.id}
              className="group flex flex-col border-b-4 border-r-4 border-ink bg-white p-8 transition-colors duration-150 ease-linear hover:bg-blue"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 place-items-center border-2 border-ink text-ink transition-colors duration-150 ease-linear group-hover:border-white group-hover:text-white">
                  <ModuleIcon id={m.id} className="size-5" />
                </span>
                <span aria-hidden className="text-label text-blue transition-colors duration-150 ease-linear group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-12 text-title font-bold uppercase text-ink transition-colors duration-150 ease-linear group-hover:text-white">
                {m.name}
              </h3>
              <p className="mt-2 text-body text-slate transition-colors duration-150 ease-linear group-hover:text-white">
                {m.outcome}
              </p>
              <p className="mt-auto pt-6 text-small text-muted transition-colors duration-150 ease-linear group-hover:text-white">
                {m.features.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
