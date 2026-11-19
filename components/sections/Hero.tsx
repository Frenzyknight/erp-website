import { PageHero } from "@/components/sections/PageHero";
import { container } from "@/components/ui/Section";
import { DashboardPreview } from "@/components/configurator/DashboardPreview";
import { company } from "@/lib/content";
import { defaultBlueprint } from "@/lib/configurator";

export function Hero() {
  return (
    <PageHero
      size="mega"
      label={company.tagline}
      title={
        <>
          ERP software that <span className="text-blue">fits</span> the way you work.
        </>
      }
      body="We map how your business actually runs, fix the process, then build only the modules you need."
      primary={{ href: "#build", label: "Build your ERP" }}
      secondary={{ href: "#contact", label: "Book a free process review" }}
      note="Live in about 3 months, for less than a standard ERP."
    >
      {/* The product preview sits flat on a gridded band, in front of a composition of plain shapes. */}
      <div className="overflow-hidden border-t-4 border-ink bg-surface swiss-grid-pattern">
        <div className={`${container} py-12 lg:py-20`}>
          <div className="relative lg:px-12">
            <div aria-hidden className="hidden lg:block">
              <span className="absolute -top-10 right-0 size-40 rounded-full bg-blue shadow-[0_0_0_10px_rgb(43_92_240/0.12)]" />
              <span className="absolute -bottom-10 left-0 size-32 bg-ink" />
              <span className="absolute -bottom-10 left-40 h-1 w-48 bg-ink" />
              <span className="absolute -top-10 right-48 size-16 border-4 border-ink bg-white swiss-diagonal" />
            </div>
            <div className="relative">
              <DashboardPreview modules={defaultBlueprint.modules} size={defaultBlueprint.size} mobileLimit={3} />
            </div>
          </div>
        </div>
      </div>
    </PageHero>
  );
}
