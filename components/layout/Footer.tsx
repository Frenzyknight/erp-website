import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { StarMark } from "@/components/ui/Logo";
import { company, navLinks, whatsappLink } from "@/lib/content";

const bigLink = "text-h5 whitespace-nowrap text-white md:text-h4 transition-colors duration-200 ease-out hover:text-sky";
const smallLink = "text-body text-white transition-colors duration-200 ease-out hover:text-sky";
const finePrint = "text-sub text-white/55";

const actions = [
  { href: "/#build", label: "Build your ERP" },
  { href: "/#contact", label: "Book a review" },
];

/**
 * A navy panel inset from the page edges, then the name set very large and
 * running right to left as an endless line. The line is pinned to the bottom
 * of the screen behind the panel, so the panel uncovers it as it scrolls up.
 */
export function Footer() {
  return (
    <footer className="relative bg-white">
      {/* Full width and opaque, so nothing of the line shows beside the panel while it is covered. */}
      <div className="relative z-[2] bg-white px-4 pt-6 md:px-12 md:pt-12">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 rounded-md bg-navy px-6 py-8 md:grid-cols-4 md:gap-x-12 md:gap-y-40 md:rounded-lg md:p-16">
          <nav aria-label="Pages">
            <ul className="space-y-2 md:space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={bigLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Get started" className="justify-self-end md:justify-self-start">
            <ul className="space-y-2 md:space-y-3">
              {actions.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={bigLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul aria-label="Contact" className="col-span-2 space-y-3 md:col-span-1">
            <li>
              {/* An address may break anywhere on a narrow column. */}
              <a href={`mailto:${company.email}`} className={`${smallLink} break-all`}>
                {company.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${company.phoneE164}`} className={smallLink}>
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hi Polaris, I'd like to discuss a custom ERP for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className={smallLink}
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>

          <p className="col-span-2 text-md font-medium text-white/85 md:col-span-1">{company.tagline}.</p>

          <p className={`col-span-2 self-end md:col-span-1 ${finePrint}`}>
            Business consulting and technology solutions: custom ERP, post-sales CRM agents and process consulting.
          </p>
          <p className={`col-span-2 self-end md:col-span-3 ${finePrint}`}>
            &copy; 2026 {company.name}. All rights reserved.
          </p>
        </div>
        {/* The white gap between the panel and the line travels with the panel. */}
        <div className="h-2 md:h-8" />
      </div>

      <div className="sticky bottom-0 z-[1] pb-6">
        <div aria-hidden className="overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-[4vw] pr-[4vw] text-[26vw] leading-[1.15] font-medium tracking-[-0.06em] whitespace-nowrap text-navy md:text-[13.5vw]"
              >
                {company.name}
                <StarMark className="size-[0.5em] text-blue" />
              </span>
            ))}
          </div>
        </div>
        {/* The pair of actions sits over the line, dead centre, while the name runs behind it. */}
        <div className="absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-[calc(50%+12px)] items-center gap-3 md:gap-4">
          <ButtonLink href="/#contact" variant="accent" size="lg" className="shadow-float">
            Book a free review
          </ButtonLink>
          {/* One action is all a phone has room for; the second joins from "sm". */}
          <div className="hidden sm:block">
            <ButtonLink
              href={whatsappLink("Hi Polaris, I'd like a free process review for my business.")}
              variant="outline"
              size="lg"
              external
              className="shadow-float"
            >
              Chat on WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
