import { ArrowRight, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { EnquiryForm } from "@/components/EnquiryForm";
import { company, whatsappLink } from "@/lib/content";

/** A row that lightens on hover, while its arrow turns from diagonal to level. */
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
      className="group flex items-center gap-4 rounded-md px-3 py-3 text-white transition-colors duration-200 ease-out hover:bg-white/15 focus-visible:outline-white"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15">
        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      </span>
      {/* The email address may break anywhere where the column is narrow. */}
      <span className="min-w-0 flex-1 text-body font-semibold wrap-anywhere">{children}</span>
      <ArrowRight
        aria-hidden
        strokeWidth={2}
        className="hidden size-5 shrink-0 -rotate-45 transition-transform duration-300 ease-swift group-hover:rotate-0 sm:block"
      />
    </a>
  );
}

/** The one panel in the accent colour: the invitation and the direct lines on blue, the form on a white card. */
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
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-2 rounded-md bg-blue p-2 md:rounded-lg md:p-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-4">
        <div className="flex flex-col items-start gap-6 px-4 py-8 md:p-8 lg:gap-8">
          <Eyebrow onDark>Contact</Eyebrow>
          <h2 id="contact-title" className="text-h2 text-balance text-white">
            <SplitText text={title} />
          </h2>
          <Reveal>
            <p className="text-md text-pretty text-white/90 lg:text-lead">{body}</p>
          </Reveal>

          <Reveal delay={0.09} className="mt-auto w-full">
            <ul className="-mx-3">
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

        <div className="rounded-sm bg-white md:rounded-md">
          <EnquiryForm defaultInterest={defaultInterest} title={formTitle} submitLabel={submitLabel} />
        </div>
      </div>
    </Section>
  );
}
