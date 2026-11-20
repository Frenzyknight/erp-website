"use client";

import { useActionState, useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { ButtonLabel, buttonClass } from "@/components/ui/Button";
import { chipClass } from "@/components/ui/Chip";
import { useBlueprint } from "@/lib/blueprint-store";
import { estimateWeeks, summarise } from "@/lib/configurator";
import { whatsappLink } from "@/lib/content";

const initialState: EnquiryState = { status: "idle" };

const interests = [
  { id: "erp", label: "Custom ERP" },
  { id: "crm", label: "CRM Agent" },
  { id: "consulting", label: "Consulting" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

type FieldName = "name" | "company" | "phone" | "email" | "message";

const labelClass = "mb-2 block text-body font-medium text-ink";

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  state,
  optional = false,
  textarea = false,
  placeholder,
}: {
  name: FieldName;
  label: string;
  type?: string;
  autoComplete?: string;
  state: EnquiryState;
  optional?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  const error = state.errors?.[name]?.[0];
  const id = `enquiry-${name}`;
  const shared = {
    id,
    name,
    placeholder,
    defaultValue: state.values?.[name],
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
    // A rounded outline that darkens on hover. Focus adds a second hairline in the same colour, with no glow.
    className: `block w-full rounded-md border bg-transparent px-5 py-4 text-body text-ink outline-none placeholder:text-muted transition-[border-color,box-shadow] duration-200 ease-out ${
      error
        ? "border-red-700 focus:shadow-[0_0_0_1px_var(--color-red-700)]"
        : "border-muted hover:border-navy focus:border-navy focus:shadow-[0_0_0_1px_var(--color-navy)]"
    }`,
  };

  return (
    <div className={textarea ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {textarea ? (
        <textarea rows={3} {...shared} />
      ) : (
        <input type={type} required={!optional} autoComplete={autoComplete} {...shared} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 px-1 text-caption text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({
  defaultInterest = "erp",
  title = "Book a free process review",
  submitLabel = "Book my free process review",
}: {
  defaultInterest?: (typeof interests)[number]["id"];
  title?: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const bp = useBlueprint();
  const [dismissed, setDismissed] = useState(false);
  const showBlueprint = bp.touched && !dismissed && bp.modules.length > 0;
  const interest = state.values?.interest ?? (showBlueprint ? "erp" : defaultInterest);

  if (state.status === "success") {
    return (
      <div role="status" className="flex min-h-[26rem] flex-col items-start justify-center p-6 sm:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-blue text-white">
          <Check aria-hidden className="size-7" strokeWidth={2.5} />
        </span>
        <h3 className="mt-8 text-h4 text-navy">Thank you. We have your details.</h3>
        <p className="mt-3 max-w-sm text-body text-muted">
          We will be in touch shortly. To speed things up, message us on WhatsApp.
        </p>
        <a
          href={whatsappLink("Hi Polaris, I just sent an enquiry from your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("outline", "mt-8 w-full sm:w-auto")}
        >
          <ButtonLabel>Continue on WhatsApp</ButtonLabel>
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="relative p-6 sm:p-10">
      <h3 className="text-h4 text-navy">{title}</h3>

      {showBlueprint && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-md bg-tint py-1.5 pl-4 pr-1.5">
          <p className="text-caption text-ink">
            <span className="font-semibold">Your blueprint is attached:</span> {bp.modules.length}{" "}
            {bp.modules.length === 1 ? "module" : "modules"}, about {estimateWeeks(bp)} weeks.
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Remove blueprint from enquiry"
            className="grid size-11 shrink-0 place-items-center rounded-sm text-ink transition-colors duration-200 ease-out hover:bg-white"
          >
            <X aria-hidden className="size-4" />
          </button>
          <input type="hidden" name="blueprint" value={summarise(bp)} />
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Your name" autoComplete="name" state={state} />
        <Field name="company" label="Company" autoComplete="organization" state={state} />
        <Field name="phone" label="Phone or WhatsApp" type="tel" autoComplete="tel" state={state} />
        <Field name="email" label="Work email" type="email" autoComplete="email" state={state} />

        <fieldset className="sm:col-span-2">
          <legend className={labelClass}>I am interested in</legend>
          <div className="flex flex-wrap gap-2" key={interest}>
            {interests.map((o) => (
              <label key={o.id} className={chipClass}>
                <input type="radio" name="interest" value={o.id} defaultChecked={interest === o.id} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          name="message"
          label="What would you like to fix first?"
          textarea
          optional
          state={state}
          placeholder="For example: we track stock in Excel and approvals over WhatsApp."
        />
      </div>

      {/* Honeypot: hidden from people, filled in by spam bots. */}
      <div aria-hidden className="absolute -left-[9999px] top-0">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-6 rounded-md bg-red-50 px-4 py-3 text-caption text-red-700">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonClass("primary", "mt-6 w-full")}>
        {pending ? (
          <>
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <ButtonLabel>{submitLabel}</ButtonLabel>
        )}
      </button>
      <p className="mt-4 text-center text-caption text-muted">Your details are only used to respond to your enquiry.</p>
    </form>
  );
}
