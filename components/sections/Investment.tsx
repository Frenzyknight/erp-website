import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { erpInvestment } from "@/lib/content";

/** The heading on one side; on the other, the one figure on the page on navy, with the three reasons under it. */
export function Investment() {
  return (
    <Section labelledBy="investment-title">
      <div className="grid items-center gap-x-16 gap-y-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <SectionHeader
          id="investment-title"
          label="The investment"
          title="A custom ERP for less than a standard one."
        />

        <dl className="grid gap-4 sm:grid-cols-2">
          <Reveal className="flex flex-col gap-3 rounded-md bg-navy px-6 py-7 sm:col-span-2 md:rounded-lg">
            <dt className="flex flex-wrap items-baseline gap-x-3 text-sky">
              <span className="text-stat-lg">3</span>
              <span className="text-h3">months</span>
            </dt>
            <dd className="text-md font-semibold text-white">From kick-off to an ERP your team can use.</dd>
          </Reveal>

          {erpInvestment.map((item, i) => (
            <Reveal
              key={item.title}
              delay={0.09 * (i + 1)}
              // The third card would sit alone on its row, so it takes the full width.
              className={`flex flex-col gap-3 rounded-md bg-surface px-6 py-7 md:rounded-lg ${
                i === erpInvestment.length - 1 && erpInvestment.length % 2 === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <dt className="text-body font-semibold text-ink">{item.title}</dt>
              <dd className="text-caption text-muted">{item.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
