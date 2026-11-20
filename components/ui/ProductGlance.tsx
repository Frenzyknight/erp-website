import { CheckCheck } from "lucide-react";
import { StarMark } from "@/components/ui/Logo";

/*
 * Small, static pictures of the two products, for the heroes. They echo
 * the interactive dashboard and the phone further down the page, and use the
 * same illustrative figures. The shop, the customer and every number are made up.
 */

const kpis = [
  { label: "Revenue this month", value: "₹1.84 Cr" },
  { label: "Open orders", value: "146" },
  { label: "On-time delivery", value: "96.2%" },
];

const pipeline = [
  { label: "Leads", value: 128, width: 100 },
  { label: "Quoted", value: 46, width: 52 },
  { label: "Won", value: 19, width: 26 },
];

const stock = [72, 88, 45, 93, 64, 80, 31];

const messages = [
  { from: "brand", label: "After the bill", text: "Thank you for shopping with us, Priya. Your invoice is attached." },
  { from: "customer", text: "Excellent, very helpful staff." },
  { from: "brand", label: "Birthday greeting", text: "Happy birthday, Priya! Enjoy 15% off this week." },
] as const;

const tile = "rounded-sm bg-white p-2.5";
const tileTitle = "truncate text-micro font-semibold text-muted";

/** The label that names a product, sitting just above its picture. The pictures sit on navy, so the labels are white or blue. */
export function GlanceTag({ children, tone = "white" }: { children: React.ReactNode; tone?: "white" | "blue" }) {
  return (
    <p
      className={`mono-label mb-2 inline-flex rounded-sm px-2 py-1 ${
        tone === "white" ? "bg-white text-navy" : "bg-blue text-white"
      }`}
    >
      {children}
    </p>
  );
}

/** An ERP window: three figures, a sales pipeline and a stock chart. */
export function ErpGlance({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-line bg-white shadow-float ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span className="size-2 rounded-full bg-blue" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="ml-2 text-micro font-semibold text-ink">Your ERP</span>
        <span className="ml-auto text-micro text-muted">6 of 8 modules</span>
      </div>

      <div className="grid gap-2 bg-surface p-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {kpis.map((k, i) => (
            // Two figures fit a phone without truncating; the third joins from "sm" up.
            <div key={k.label} className={`${tile} ${i === 2 ? "hidden sm:block" : ""}`}>
              <p className={tileTitle}>{k.label}</p>
              <p className="mt-1 text-body font-semibold whitespace-nowrap text-ink">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className={tile}>
            <p className={tileTitle}>Sales pipeline</p>
            <div className="mt-2 space-y-1.5">
              {pipeline.map((p, i) => (
                <div key={p.label}>
                  <div className="mb-1 flex justify-between text-micro text-muted">
                    <span>{p.label}</span>
                    <span className="font-semibold text-ink">{p.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-tint">
                    <div
                      style={{ width: `${p.width}%`, animationDelay: `${0.3 + i * 0.12}s` }}
                      className="h-full origin-left animate-grow-x rounded-full bg-blue"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${tile} flex flex-col`}>
            <p className={tileTitle}>Stock levels</p>
            <div className="mt-2 flex min-h-12 flex-1 items-end gap-1">
              {stock.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%`, animationDelay: `${0.3 + i * 0.06}s` }}
                  className={`flex-1 origin-bottom animate-grow-y rounded-t-[3px] ${h < 50 ? "bg-sky" : "bg-blue"}`}
                />
              ))}
            </div>
            <p className="mt-2 truncate text-micro text-muted">3 items below reorder level</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A phone showing three automated WhatsApp messages, arriving one after another.
 * "short" drops the last message below "sm", where the phone is narrow enough
 * that three wrapped messages would make it taller than the picture it sits in.
 */
export function ChatGlance({ className = "", short = false }: { className?: string; short?: boolean }) {
  return (
    // The hairline ring keeps the navy handset visible where it sits on the navy hero.
    <div className={`rounded-2xl bg-navy p-1.5 shadow-float ring-1 ring-white/25 ${className}`}>
      <div className="overflow-hidden rounded-xl bg-surface">
        <div className="flex items-center gap-2 bg-navy px-3 pb-2.5 pt-2 text-white">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white">
            <StarMark className="size-3.5 text-blue" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sub font-semibold">Sharma Jewellers</p>
            <p className="text-micro text-mist">Business account</p>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5 px-2 pb-3 pt-2.5">
          {messages.map((m, i) => {
            const mine = m.from === "customer";
            return (
              <li
                key={i}
                style={{ animationDelay: `${0.5 + i * 0.55}s` }}
                className={`animate-pop ${mine ? "justify-end" : "justify-start"} ${
                  short && i === messages.length - 1 ? "hidden sm:flex" : "flex"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-md px-2.5 py-2 text-sub ${
                    mine ? "rounded-br-[3px] bg-blue text-white" : "rounded-bl-[3px] bg-white text-ink shadow-card"
                  }`}
                >
                  {"label" in m && <p className="mb-0.5 text-micro font-semibold text-blue">{m.label}</p>}
                  <p>{m.text}</p>
                  {!mine && (
                    <p className="mt-1 flex justify-end">
                      <CheckCheck aria-hidden className="size-3 text-blue" />
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Both products together: the ERP window behind, the phone in front and drifting slowly. */
export function ProductPair() {
  return (
    <div className="relative aspect-[10/9] w-full sm:aspect-[10/7.6]">
      <span aria-hidden className="absolute bottom-[8%] right-[2%] size-[52%] rounded-full bg-blue/30 blur-3xl" />
      <div className="absolute left-0 top-0 w-[86%] sm:w-[80%]">
        <GlanceTag>Custom ERP</GlanceTag>
        <ErpGlance />
      </div>
      <div className="absolute bottom-0 right-0 w-[50%] animate-float sm:w-[40%]">
        <GlanceTag tone="blue">CRM Agent</GlanceTag>
        <ChatGlance short />
      </div>
    </div>
  );
}
