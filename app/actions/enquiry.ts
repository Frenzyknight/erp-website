"use server";

import { z } from "zod";
import { Resend } from "resend";
import { company } from "@/lib/content";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().min(2, "Please enter your company name").max(160),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number")
    .refine((v) => v.length <= 25, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email").max(200),
  interest: z.enum(["erp", "crm", "consulting", "not-sure"]),
  message: z.string().trim().max(2000).optional(),
  blueprint: z.string().max(2000).optional(),
});

type Fields = z.infer<typeof schema>;

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof Fields, string[]>>;
  values?: Partial<Record<keyof Fields, string>>;
};

const interestLabel: Record<Fields["interest"], string> = {
  erp: "Custom ERP",
  crm: "Post-Sales CRM Agent",
  consulting: "Process consulting",
  "not-sure": "Not sure yet",
};

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  if (formData.get("website")) {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    interest: String(formData.get("interest") ?? "not-sure"),
    message: String(formData.get("message") ?? ""),
    blueprint: String(formData.get("blueprint") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
    };
  }

  const lead = parsed.data;
  const text = [
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Interested in: ${interestLabel[lead.interest]}`,
    lead.message ? `\nMessage:\n${lead.message}` : null,
    lead.blueprint ? `\nERP blueprint from the website configurator:\n${lead.blueprint}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[enquiry] RESEND_API_KEY not set, logging lead instead:\n" + text);
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.ENQUIRY_FROM_EMAIL ?? "Polaris Website <onboarding@resend.dev>",
      to: process.env.ENQUIRY_TO_EMAIL ?? company.email,
      replyTo: lead.email,
      subject: `New enquiry: ${lead.company} (${interestLabel[lead.interest]})`,
      text,
    });
    if (error) throw new Error(error.message);
    return { status: "success" };
  } catch (err) {
    console.error("[enquiry] failed to send", err);
    return {
      status: "error",
      message: "Something went wrong sending your enquiry. Please try again, or reach us on WhatsApp.",
      values: raw,
    };
  }
}
