import { Section, SectionHeader, columns } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { erpInvestment } from "@/lib/content";

/** The heading on one side; on the other, the one figure on the page on navy, with the three reasons under it. */
export function Investment() {
  return (
    <Section labelledBy="investment-title">
      <div className={`${columns} items-end`}>
        <div className="lg:col-span-5">
          <SectionHeader
            id="investment-title"
            label="The investment"
            title="A custom ERP for less than a standard one."
            accent="less than a standard one."
            align="left"
          />
        </div>

        <dl className="grid gap-2 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:gap-3">
          <Reveal className="flex flex-col gap-6 rounded-lg bg-navy p-6 sm:col-span-2 md:p-8">
            <dt className="flex flex-wrap items-baseline gap-x-3 font-display">
              <span className="text-stat-lg text-white">3</span>
              <span className="text-h3 text-sky">months</span>
            </dt>
            <dd className="border-t border-white/20 pt-5 text-body text-white/85">
              From kick-off to an ERP your team can use.
            </dd>
          </Reveal>

          {erpInvestment.map((item, i) => (
            <Reveal
              key={item.title}
              delay={0.09 * (i + 1)}
              // The third card would sit alone on its row, so it takes the full width.
              className={`flex flex-col gap-3 rounded-lg bg-surface p-6 ${
                i === erpInvestment.length - 1 && erpInvestment.length % 2 === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <dt className="font-display text-h5 text-navy">{item.title}</dt>
              <dd className="text-caption text-muted">{item.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
