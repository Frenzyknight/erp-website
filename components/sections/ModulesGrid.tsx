import { Section, SectionHeader } from "@/components/ui/Section";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Reveal } from "@/components/motion/Reveal";
import { erpModules } from "@/lib/content";

/**
 * Hover colour for each icon tile: navy or brand blue, alternating. In the
 * two-column layout this makes a checkerboard; in the single-column mobile
 * layout it simply alternates.
 */
function hoverTone(i: number) {
  if (i % 2 === 1) {
    // Odd: blue on mobile; blue on md only when it falls on the checkerboard.
    return i % 4 === 1
      ? "group-hover:bg-blue"
      : "group-hover:bg-blue md:group-hover:bg-navy";
  }
  return i % 4 === 2
    ? "group-hover:bg-navy md:group-hover:bg-blue"
    : "group-hover:bg-navy";
}

/**
 * The eight modules, two to a row. Each is a pale card with its icon on a
 * tile at the left, which turns navy or blue on hover; beside it the name, what the
 * module is for, and what is inside it in small capitals.
 */
export function ModulesGrid() {
  return (
    <Section id="modules" labelledBy="modules-title">
      <SectionHeader
        id="modules-title"
        label="The modules"
        title="Eight modules. Take only the ones you need."
        accent="Take only the ones you need."
        body="Each one is designed around your processes, and they all connect, so the business runs on one flow."
      />
      <ul className="mt-12 grid gap-2 md:mt-20 md:grid-cols-2 lg:gap-3">
        {erpModules.map((m, i) => (
          <li key={m.id}>
            <Reveal delay={(i % 2) * 0.06} className="h-full">
              <article className="group flex h-full gap-4 rounded-lg bg-surface p-2.5 md:gap-6">
                <span
                  className={`grid w-20 shrink-0 place-items-center rounded-md bg-line text-navy transition-colors duration-300 ease-out group-hover:text-white sm:w-28 ${
                    hoverTone(i)
                  }`}
                >
                  <ModuleIcon id={m.id} className="size-7" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col py-2.5 pr-2.5">
                  <h3 className="text-h5 text-navy">{m.name}</h3>
                  <p className="mt-1.5 text-caption text-muted">{m.outcome}</p>
                  <p className="mono-label mt-auto pt-6 text-navy/70">{m.features.join(" / ")}</p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
