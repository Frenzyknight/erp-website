import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { company, navLinks, whatsappLink } from "@/lib/content";

const heading = "text-caption text-white/50";
const link = "text-caption text-white transition-colors duration-200 ease-out hover:text-sky";
const smallPrint = "mono-label text-white/80 transition-colors duration-200 ease-out hover:text-white";

const actions = [
  { href: "/#build", label: "Build your ERP" },
  { href: "/#contact", label: "Book a review" },
];

const reviewMessage = "Hi Polaris, I'd like a free process review for my business.";

/**
 * The page's navy, continued. The name on the left and three short columns of
 * links on the right; under those the tagline, set large, with the two ways
 * to start; then a hairline and the small print.
 */
export function Footer() {
  return (
    <footer data-tone="dark" className="bg-navy text-white">
      <div className="px-page pt-8 md:pt-10">
        <div className="grid gap-x-6 gap-y-12 border-t border-white/15 pt-8 md:pt-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Logo />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-6">
            <nav aria-label="Pages">
              <p className={heading}>What we build</p>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Get started">
              <p className={heading}>Get started</p>
              <ul className="mt-4 space-y-2.5">
                {actions.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-2 sm:col-span-1">
              <p className={heading}>Contact</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={`tel:+${company.phoneE164}`} className={link}>
                    {company.phoneDisplay}
                  </a>
                </li>
                <li>
                  {/* An address may break anywhere on a narrow column. */}
                  <a href={`mailto:${company.email}`} className={`${link} wrap-anywhere`}>
                    {company.email}
                  </a>
                </li>
                <li>
                  <a href={whatsappLink(reviewMessage)} target="_blank" rel="noopener noreferrer" className={link}>
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
            <p className="max-w-[34rem] font-display text-h4 text-balance text-white">
              {company.tagline}. Custom ERP, post-sales CRM agents and process consulting.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row md:mt-8">
              <ButtonLink href="/#contact">Book a free review</ButtonLink>
              <ButtonLink href={whatsappLink(reviewMessage)} variant="ghost" external>
                Chat on WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p className="text-caption text-white">2026 &copy; {company.name}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={smallPrint}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#contact" className={smallPrint}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
