import { ArrowRight, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Eyebrow, Section, columns } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { EnquiryForm } from "@/components/EnquiryForm";
import { company, whatsappLink } from "@/lib/content";

/** A row between hairlines. On hover it turns sky and its arrow turns from diagonal to level. */
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
      className="group flex items-center gap-4 border-b border-white/15 py-4 text-white transition-colors duration-200 ease-out hover:text-sky"
    >
      <Icon aria-hidden className="size-5 shrink-0 text-sky" strokeWidth={1.5} />
      {/* The email address may break anywhere where the column is narrow. */}
      <span className="min-w-0 flex-1 text-md wrap-anywhere">{children}</span>
      <ArrowRight
        aria-hidden
        strokeWidth={1.5}
        className="size-5 shrink-0 -rotate-45 transition-transform duration-300 ease-swift group-hover:rotate-0"
      />
    </a>
  );
}

/**
 * The last section, on navy, running on into the footer. The invitation and
 * the direct lines on the left; the form on a white card on the right.
 */
export function Contact({
  title = "Ready for an ERP that fits the way you work?",
  accent = "fits the way you work?",
  body = "Let us understand your business first. Tell us a little about it and we will set up a free process review.",
  defaultInterest,
  formTitle,
  submitLabel,
}: {
  title?: string;
  /** A phrase from the title to set in the accent colour. */
  accent?: string;
  body?: string;
  defaultInterest?: "erp" | "crm" | "consulting" | "not-sure";
  formTitle?: string;
  submitLabel?: string;
}) {
  return (
    <Section id="contact" tone="navy" labelledBy="contact-title">
      <div className={columns}>
        <div className="flex flex-col items-start gap-6 lg:col-span-5">
          <Eyebrow onDark>Contact</Eyebrow>
          <h2 id="contact-title" className="text-h3 text-balance text-white">
            <SplitText text={title} accent={accent} accentClass="text-sky" />
          </h2>
          <Reveal>
            <p className="max-w-[30rem] text-lead text-pretty text-white/70">{body}</p>
          </Reveal>

          <Reveal delay={0.09} className="mt-auto w-full pt-6">
            <ul className="border-t border-white/15">
              <li>
                <ContactLink
                  href={whatsappLink("Hi Polaris, I'd like a free process review for my business.")}
                  icon={MessageCircle}
                  external
                >
                  Chat on WhatsApp
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
        </div>

        <div className="rounded-lg bg-white lg:col-span-6 lg:col-start-7">
          <EnquiryForm defaultInterest={defaultInterest} title={formTitle} submitLabel={submitLabel} />
        </div>
      </div>
    </Section>
  );
}
