"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, PiggyBank, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Section, SectionHeader, columns } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ControlScene, CostScene, FlowScene, VisibilityScene } from "@/components/ui/ResultScenes";
import { erpBenefits } from "@/lib/content";

const icons: LucideIcon[] = [PiggyBank, Zap, ShieldCheck, Eye];
const scenes = [CostScene, FlowScene, ControlScene, VisibilityScene];
/* The panel behind each picture, alternating so the white pictures sit on navy, then on the pale panel colour. */
const panels = ["bg-navy", "bg-line", "bg-navy", "bg-line"];

/**
 * The four outcomes. On the left their names are set large and stay on screen
 * while the right side scrolls: one picture per outcome on a panel, then its
 * name in small capitals and its sentence. The name of the outcome on screen
 * is dark and the others are faint; each name jumps to its picture. Below
 * "lg" the list of names is dropped and the outcomes simply stack.
 */
export function Results({ id, label, title, accent }: { id: string; label: string; title: string; accent?: string }) {
  const [active, setActive] = useState(0);
  const blocks = useRef<(HTMLElement | null)[]>([]);

  // The outcome crossing the middle of the screen is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocks.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Section labelledBy={id}>
      <SectionHeader id={id} label={label} title={title} accent={accent} />

      <div className={`${columns} mt-14 md:mt-24`}>
        <nav aria-label="Outcomes" className="hidden lg:col-span-5 lg:block">
          <ol className="sticky top-[calc(var(--header-h)+2rem)]">
            {erpBenefits.map((b, i) => (
              <li key={b.title}>
                <a
                  href={`#${id}-${i}`}
                  aria-current={i === active ? "true" : undefined}
                  className={`block py-0.5 font-display text-h4 transition-colors duration-300 ease-out ${
                    i === active ? "text-navy" : "text-mist hover:text-muted"
                  }`}
                >
                  {b.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-14 md:gap-24 lg:col-span-6 lg:col-start-7">
          {erpBenefits.map((b, i) => {
            const Icon = icons[i];
            const Scene = scenes[i];
            return (
              <article
                key={b.title}
                id={`${id}-${i}`}
                data-index={i}
                ref={(el) => {
                  blocks.current[i] = el;
                }}
              >
                <Reveal>
                  <div className={`rounded-lg p-3 md:p-6 ${panels[i]}`}>
                    <Scene />
                  </div>
                  <p className="mono-label mt-5 flex items-center gap-2 text-navy md:mt-6">
                    <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
                    {b.title}
                  </p>
                  <h3 className="mt-3 max-w-[21em] text-h5 text-pretty text-navy">{b.body}</h3>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
