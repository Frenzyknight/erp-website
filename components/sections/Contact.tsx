import { ArrowRight, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { company, whatsappLink } from "@/lib/content";

/** A ruled row that inverts to white on hover, while its arrow turns from diagonal to level. */
function ContactLink({
  href,
  icon: Icon,
  external = false,
  children,
}: {
  href: string;
  icon: LucideIcon;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-4 border-t-2 border-white px-3 py-5 text-white transition-colors duration-150 ease-linear hover:bg-white hover:text-ink focus-visible:outline-sky sm:px-4"
    >
      <span className="grid size-11 shrink-0 place-items-center border-2 border-current">
        <Icon aria-hidden className="size-5" strokeWidth={2} />
      </span>
      {/*
        Sized so the email address stays on one line where the row is narrow: on phones, and in the
        five-column layout between "lg" and "xl". It may still break anywhere on the narrowest screens.
      */}
      <span className="min-w-0 flex-1 text-small font-bold wrap-anywhere sm:text-body lg:text-small xl:text-body">
        {children}
      </span>
      <ArrowRight
        aria-hidden
        strokeWidth={2.5}
        className="hidden size-5 shrink-0 -rotate-45 transition-transform duration-200 ease-out group-hover:rotate-0 sm:block lg:hidden xl:block"
      />
    </a>
  );
}

export function Contact({
  title = "Ready for an ERP that fits the way you work?",
  body = "Let us understand your business first. Tell us a little about it and we will set up a free process review.",
  defaultInterest,
  formTitle,
  submitLabel,
}: {
  title?: string;
  body?: string;
  defaultInterest?: "erp" | "crm" | "consulting" | "not-sure";
  formTitle?: string;
  submitLabel?: string;
}) {
  return (
    <Section id="contact" tone="navy" labelledBy="contact-title">
      <SectionHeader id="contact-title" label="Contact" title={title} body={body} onDark />

      <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <ul className="border-b-2 border-white">
            <li>
              <ContactLink
                href={whatsappLink("Hi Polaris, I'd like a free process review for my business.")}
                icon={MessageCircle}
                external
              >
                <span className="uppercase tracking-wide">Chat on WhatsApp</span>
              </ContactLink>
            </li>
            <li>
              <ContactLink href={`tel:+${company.phoneE164}`} icon={Phone}>
                {company.phoneDisplay}
              </ContactLink>
            </li>
            <li>
              <ContactLink href={`mailto:${company.email}`} icon={Mail}>
                {company.email}
              </ContactLink>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.05} className="lg:col-span-7">
          <EnquiryForm defaultInterest={defaultInterest} title={formTitle} submitLabel={submitLabel} />
        </Reveal>
      </div>
    </Section>
  );
}
