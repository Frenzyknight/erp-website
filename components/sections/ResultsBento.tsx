import { Eye, PiggyBank, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ControlScene, CostScene, FlowScene, VisibilityScene } from "@/components/ui/ResultScenes";
import { erpBenefits } from "@/lib/content";

const icons: LucideIcon[] = [PiggyBank, Zap, ShieldCheck, Eye];

/* From "lg" up a row splits 3:4, both between two cards and between a wide card's text and picture. */
const split = "lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]";

/**
 * One outcome: its name with an icon, the sentence set large, and a picture.
 * A "wide" card puts the text beside the picture; a "tall" one puts the
 * picture on top. Below "lg" every card is stacked with the picture first.
 */
function BentoCard({
  index,
  layout,
  fill,
  children,
}: {
  index: number;
  layout: "wide" | "tall";
  fill: string;
  children: React.ReactNode;
}) {
  const { title, body } = erpBenefits[index];
  const Icon = icons[index];
  const wide = layout === "wide";

  return (
    <article
      className={`flex h-full flex-col gap-4 overflow-hidden rounded-md p-2 md:gap-6 md:rounded-lg md:p-4 ${fill} ${
        wide ? `lg:grid lg:items-start lg:gap-12 ${split}` : ""
      }`}
    >
      <div className={wide ? "lg:order-last" : ""}>{children}</div>
      <div className={`flex flex-col gap-3 px-4 pb-4 md:px-8 md:pb-8 ${wide ? "lg:p-8" : ""}`}>
        <h3 className="flex items-center gap-2 text-caption font-semibold text-navy">
          <Icon aria-hidden className="size-5 shrink-0" strokeWidth={1.5} />
          {title}
        </h3>
        <p className={`text-h4 text-pretty text-navy ${wide ? "lg:text-h3" : ""}`}>{body}</p>
      </div>
    </article>
  );
}

/**
 * The four outcomes as a bento on navy: a wide card, a narrow and a broad
 * card side by side, then another wide card. The band's rounded top rides up
 * over the section before it.
 */
export function ResultsBento({ id, title }: { id: string; title: string }) {
  return (
    <Section tone="navy" lifted labelledBy={id}>
      <SectionHeader id={id} title={title} onDark />
      <div className="mt-8 flex flex-col gap-4 md:mt-12 md:gap-6">
        <Reveal>
          <BentoCard index={0} layout="wide" fill="bg-line">
            <CostScene />
          </BentoCard>
        </Reveal>
        <div className={`grid gap-4 md:gap-6 ${split}`}>
          <Reveal className="h-full">
            <BentoCard index={1} layout="tall" fill="bg-mist">
              <FlowScene />
            </BentoCard>
          </Reveal>
          <Reveal delay={0.09} className="h-full">
            <BentoCard index={2} layout="tall" fill="bg-surface">
              <ControlScene />
            </BentoCard>
          </Reveal>
        </div>
        <Reveal>
          <BentoCard index={3} layout="wide" fill="bg-line">
            <VisibilityScene />
          </BentoCard>
        </Reveal>
      </div>
    </Section>
  );
}
