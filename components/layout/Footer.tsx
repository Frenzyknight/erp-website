import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { container } from "@/components/ui/Section";
import { company, navLinks, whatsappLink } from "@/lib/content";

const plainLinkClass = "text-small font-bold text-ink transition-colors duration-150 ease-linear hover:text-blue";
const linkClass = `${plainLinkClass} uppercase tracking-wide`;
const headingClass = "mb-5 text-label uppercase text-blue";
const cellClass = "border-t-2 border-ink py-10 lg:border-l-2 lg:border-t-0 lg:px-10 lg:py-14";

export function Footer() {
  return (
    <footer>
      <div className={`${container} grid lg:grid-cols-12`}>
        <div className="py-10 lg:col-span-5 lg:py-14 lg:pr-10">
          <Logo />
          <p className="mt-5 max-w-xs text-body text-slate">
            Business consulting and technology solutions. {company.tagline}.
          </p>
        </div>

        <nav aria-labelledby="footer-pages" className={`${cellClass} lg:col-span-3`}>
          <h2 id="footer-pages" className={headingClass}>
            Pages
          </h2>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#build" className={linkClass}>
                Build your ERP
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`${cellClass} lg:col-span-4 lg:pr-0`}>
          <h2 className={headingClass}>Contact</h2>
          <ul className="space-y-3">
            <li>
              {/* An address reads better in its own case, and may break anywhere on a narrow column. */}
              <a href={`mailto:${company.email}`} className={`${plainLinkClass} break-all`}>
                {company.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${company.phoneE164}`} className={linkClass}>
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hi Polaris, I'd like to discuss a custom ERP for my business.")}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t-4 border-ink">
        <p className={`${container} py-6 text-label uppercase text-ink`}>
          &copy; 2026 Polaris Consulting. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
