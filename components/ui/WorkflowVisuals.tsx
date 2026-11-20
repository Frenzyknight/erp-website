import { Check, CheckCheck } from "lucide-react";
import { StarMark } from "@/components/ui/Logo";

/*
 * The small pictures at the top of each "How it works" card on the CRM agent
 * page. They follow one made-up bill from the billing software to the
 * customer's phone, using the same shop and customer as the chat pictures
 * elsewhere on the site. Each takes `on`, which turns true when the scroll
 * line reaches its step, and settles into its finished state then. Text uses
 * the "sub" and "micro" sizes only, so they read as screenshots.
 */

const heading = "min-w-0 truncate text-sub font-semibold text-muted";
const pill = "shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold";
const settle = "transition-[opacity,scale,translate] duration-700 ease-rise";
const sheet = "rounded-[6px] border border-line bg-white";
const stagger = (on: boolean, i: number, step = 90) => ({ transitionDelay: on ? `${i * step}ms` : "0ms" });

function Header({ title, badge, on }: { title: string; badge: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className={heading}>{title}</p>
      <span className={`${pill} ${settle} bg-navy text-white ${on ? "" : "scale-90 opacity-0"}`}>{badge}</span>
    </div>
  );
}

/** Step 1: a bill, as the billing software prints it. Its lines and total fill in when the step is reached. */
export function BillVisual({ on }: { on: boolean }) {
  const lines = ["w-[62%]", "w-[44%]", "w-[54%]"];

  return (
    <div className="flex h-full flex-col p-4">
      <Header title="Billing software" badge="Bill generated" on={on} />
      <div className={`${sheet} mt-3 flex min-h-0 flex-1 flex-col px-3 py-2.5`}>
        <div className="flex items-center justify-between gap-2 text-sub">
          <span className="font-semibold text-ink">Invoice 1042</span>
          <span className="text-muted">Priya</span>
        </div>
        <ul className="mt-2.5 space-y-2">
          {lines.map((width, i) => (
            <li key={width} className="flex items-center justify-between gap-3">
              <span
                style={stagger(on, i)}
                className={`h-1.5 origin-left rounded-full bg-line transition-[scale] duration-700 ease-rise ${width} ${
                  on ? "" : "scale-x-0"
                }`}
              />
              <span
                style={stagger(on, i)}
                className={`h-1.5 w-8 origin-right rounded-full bg-mist transition-[scale] duration-700 ease-rise ${
                  on ? "" : "scale-x-0"
                }`}
              />
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2 text-sub">
          <span className="text-muted">Total</span>
          <span style={stagger(on, 3)} className={`${settle} font-semibold text-ink ${on ? "" : "translate-y-1 opacity-0"}`}>
            ₹18,400
          </span>
        </div>
      </div>
    </div>
  );
}

/** Step 2: the fields the agent needs, ticked off one by one as they arrive. */
export function SyncVisual({ on }: { on: boolean }) {
  const fields = [
    { name: "Customer", value: "Priya" },
    { name: "Last bill", value: "₹18,400" },
    { name: "Last visit", value: "Today" },
    { name: "Birthday", value: "14 March" },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <Header title="Customer and bill data" badge="Synced" on={on} />
      <ul className="mt-3 space-y-1.5">
        {fields.map((f, i) => (
          <li key={f.name} className={`${sheet} flex items-center gap-2 px-2.5 py-1 text-sub`}>
            <span
              style={stagger(on, i)}
              className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-500 ease-out ${
                on ? "bg-blue text-white" : "bg-line text-muted"
              }`}
            >
              <Check
                style={stagger(on, i)}
                className={`size-2.5 transition-opacity duration-500 ease-out ${on ? "" : "opacity-0"}`}
                strokeWidth={3}
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-muted">{f.name}</span>
            <span className="shrink-0 font-medium text-ink">{f.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 3: the agent's decision: who the customer is, what set it off, and which message goes out. */
export function AgentVisual({ on }: { on: boolean }) {
  const rules = [
    { name: "Segment", value: "Repeat customer" },
    { name: "Trigger", value: "After the bill" },
    { name: "Template", value: "Thank-you note" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-2">
        <span className="grid size-5 place-items-center rounded-full bg-navy text-white">
          <StarMark className="size-3" />
        </span>
        <span className="text-micro font-semibold text-ink">Polaris agent</span>
        <span className={`${pill} ${settle} ml-auto bg-tint text-blue-deep ${on ? "" : "scale-90 opacity-0"}`}>Running</span>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col justify-center gap-2 p-4">
        {rules.map((r, i) => (
          <li key={r.name} className="flex items-center justify-between gap-2 text-sub">
            <span className="text-muted">{r.name}</span>
            <span aria-hidden className="h-px flex-1 border-t border-dashed border-mist" />
            <span
              style={stagger(on, i, 140)}
              className={`${pill} ${settle} border ${
                on ? "border-blue bg-white text-blue-deep" : "scale-90 border-dashed border-mist text-transparent"
              }`}
            >
              {r.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 4: the approved template, and the send going out through the API. */
export function SendVisual({ on }: { on: boolean }) {
  return (
    <div className="flex h-full flex-col p-4">
      <Header title="WhatsApp Business API" badge="Sent" on={on} />
      <div className={`${sheet} mt-3 flex min-h-0 flex-1 flex-col px-3 py-2.5`}>
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-micro font-semibold text-ink">Thank-you note</span>
          <span className={`${pill} inline-flex items-center gap-1 bg-tint text-blue-deep`}>
            <Check className="size-3" strokeWidth={2.5} />
            Approved template
          </span>
        </div>
        <p className="mt-2 text-sub text-pretty text-ink">
          Thank you for shopping with us, <span className="rounded-[3px] bg-tint px-1 font-medium text-blue-deep">name</span>.
          Your invoice is attached.
        </p>
        <span aria-hidden className="mt-auto block h-1 overflow-hidden rounded-full bg-line">
          <span
            className={`block h-full origin-left rounded-full bg-blue transition-[scale] duration-1000 ease-rise ${
              on ? "" : "scale-x-0"
            }`}
          />
        </span>
      </div>
    </div>
  );
}

/** Step 5: the message on the customer's phone, with its ticks turning blue and the reply coming back. */
export function CustomerVisual({ on }: { on: boolean }) {
  const statuses = ["Delivered", "Read", "Replied"];

  return (
    <div className="flex h-full flex-col p-4">
      <ul className="flex flex-wrap gap-1.5">
        {statuses.map((s, i) => (
          <li
            key={s}
            style={stagger(on, i, 220)}
            className={`${pill} inline-flex items-center gap-1 transition-colors duration-500 ease-out ${
              on ? "bg-navy text-white" : "bg-line text-muted"
            }`}
          >
            <Check className="size-3" strokeWidth={2.5} />
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
        <div className="max-w-[86%] rounded-md rounded-bl-[3px] bg-white px-2.5 py-2 text-sub text-ink shadow-card">
          <p>Thank you for shopping with us, Priya. Your invoice is attached.</p>
          <p className="mt-0.5 flex items-center justify-end gap-1 text-micro text-muted">
            11:02
            <CheckCheck
              style={stagger(on, 1, 220)}
              className={`size-3.5 transition-colors duration-500 ease-out ${on ? "text-blue" : "text-mist"}`}
            />
          </p>
        </div>
        <div
          style={stagger(on, 2, 220)}
          className={`${settle} max-w-[86%] self-end rounded-md rounded-br-[3px] bg-blue px-2.5 py-2 text-sub text-white ${
            on ? "" : "translate-y-1 opacity-0"
          }`}
        >
          Excellent, very helpful staff.
        </div>
      </div>
    </div>
  );
}
