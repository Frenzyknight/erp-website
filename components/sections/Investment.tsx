import { Plus } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { erpInvestment } from "@/lib/content";

export function Investment() {
  return (
    <Section tone="surface" pattern="diagonal" labelledBy="investment-title">
      <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeader
            id="investment-title"
            label="The investment"
            title="A custom ERP for less than a standard one."
            layout="stacked"
          />
          {/* The one figure on the page: a navy block that snaps to blue on hover. */}
          <Reveal delay={0.05} className="group mt-12 bg-navy p-8 transition-colors duration-150 ease-linear hover:bg-blue sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <p className="flex origin-left flex-wrap items-baseline gap-x-4 uppercase text-white transition-transform duration-200 ease-out group-hover:scale-105">
                <span className="text-mega">3</span>
                <span className="text-heading">months</span>
              </p>
              <Plus
                aria-hidden
                strokeWidth={2.5}
                className="size-8 shrink-0 text-white transition-transform duration-200 ease-out group-hover:rotate-90"
              />
            </div>
            <p className="mt-4 text-body text-mist transition-colors duration-150 ease-linear group-hover:text-white">
              From kick-off to an ERP your team can use.
            </p>
          </Reveal>
        </div>

        <dl className="border-b-4 border-ink lg:col-span-5 lg:self-end">
          {erpInvestment.map((item) => (
            <Reveal key={item.title} className="border-t-4 border-ink py-7">
              <dt className="text-title font-bold uppercase text-ink">{item.title}</dt>
              <dd className="mt-2 text-body text-slate">{item.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
