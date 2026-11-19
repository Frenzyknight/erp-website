"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { LayoutDashboard } from "lucide-react";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { erpModules, type ModuleId } from "@/lib/content";
import type { TeamSize } from "@/lib/configurator";

/*
 * A mock ERP screen that shows one widget per selected module. All figures are
 * illustrative and scale with team size. Text inside the mock uses the "micro"
 * and "small" sizes only, so it reads as a product screenshot. It is drawn
 * flat: ink borders, square corners, no shadow. Charts and tiles move on
 * short ease-out tweens, never springs.
 */

const scale: Record<TeamSize, number> = { "1-25": 0.3, "26-100": 1, "101-250": 2.2, "250+": 4.5 };
const ease = "easeOut" as const;
const cardTitle = "text-micro font-bold uppercase tracking-wider text-muted";

const n = (v: number, k: number) => Math.max(1, Math.round(v * k));
const inr = (lakhs: number) => (lakhs >= 100 ? `₹${(lakhs / 100).toFixed(2)} Cr` : `₹${lakhs.toFixed(1)} L`);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="h-full border-2 border-ink bg-white p-4">
      <p className={cardTitle}>{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden bg-tint">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4, ease }}
        className="h-full bg-blue"
      />
    </div>
  );
}

function Figure({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <>
      <p className="text-small font-bold text-ink">{children}</p>
      {note && <p className="mt-2 text-micro text-muted">{note}</p>}
    </>
  );
}

function Widget({ id, k }: { id: ModuleId; k: number }) {
  switch (id) {
    case "dashboards":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { l: "Revenue this month", v: inr(184 * k) },
            { l: "Open orders", v: String(n(146, k)) },
            { l: "On-time delivery", v: "96.2%" },
          ].map((x, i) => (
            // Two figures fit a phone without truncating; the third joins from "sm" up.
            <div key={x.l} className={`border-2 border-ink bg-white p-4 ${i === 2 ? "hidden sm:block" : ""}`}>
              <p className={`truncate ${cardTitle}`}>{x.l}</p>
              <p className="mt-1 whitespace-nowrap text-title font-black tracking-tight text-ink">{x.v}</p>
            </div>
          ))}
        </div>
      );
    case "sales":
      return (
        <Card title="Sales pipeline">
          <div className="space-y-2.5">
            {[
              { l: "Leads", v: n(128, k), w: 100 },
              { l: "Quoted", v: n(46, k), w: 52 },
              { l: "Won", v: n(19, k), w: 26 },
            ].map((s) => (
              <div key={s.l}>
                <div className="mb-1 flex justify-between text-micro text-muted">
                  <span>{s.l}</span>
                  <span className="font-bold text-ink">{s.v}</span>
                </div>
                <Bar value={s.w} />
              </div>
            ))}
          </div>
        </Card>
      );
    case "purchase":
      return (
        <Card title="Waiting for approval">
          <ul className="space-y-2.5">
            {[
              { v: "Steel coils", a: "₹4.2 L" },
              { v: "Packaging", a: "₹0.8 L" },
              { v: "Spares", a: "₹1.1 L" },
            ].map((r) => (
              <li key={r.v} className="flex items-center gap-2 text-micro">
                <span className="flex-1 truncate text-slate">{r.v}</span>
                <span className="font-bold text-ink">{r.a}</span>
                <span className="bg-ink px-2 py-0.5 font-bold uppercase tracking-wider text-white">Approve</span>
              </li>
            ))}
          </ul>
        </Card>
      );
    case "inventory":
      return (
        <Card title="Stock levels">
          <div className="flex h-12 items-end gap-1.5">
            {[72, 88, 45, 93, 64, 80, 31].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.4, delay: i * 0.03, ease }}
                className={`flex-1 ${h < 50 ? "bg-sky" : "bg-blue"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-micro text-muted">{n(3, Math.sqrt(k))} items below reorder level</p>
        </Card>
      );
    case "production":
      return (
        <Card title="Work orders">
          <div className="space-y-2.5">
            {[
              { id: "WO-1042", p: 68 },
              { id: "WO-1043", p: 34 },
              { id: "WO-1044", p: 91 },
            ].map((w) => (
              <div key={w.id} className="flex items-center gap-3 text-micro">
                <span className="shrink-0 text-muted">{w.id}</span>
                <Bar value={w.p} />
                <span className="w-8 shrink-0 text-right font-bold text-ink">{w.p}%</span>
              </div>
            ))}
          </div>
        </Card>
      );
    case "quality":
      return (
        <Card title="First-pass yield">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 36 36" className="size-12 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-tint)" strokeWidth="4" />
              <motion.circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.974 }}
                transition={{ duration: 0.5, ease }}
              />
            </svg>
            <div>
              <Figure note="Rejections down 38%">97.4%</Figure>
            </div>
          </div>
        </Card>
      );
    case "finance":
      return (
        <Card title="Receivables">
          <Figure>{inr(18.6 * k)}</Figure>
          <svg viewBox="0 0 100 24" className="mt-2 h-6 w-full" aria-hidden>
            <motion.path
              d="M0 20 L14 16 L28 18 L42 11 L56 13 L70 7 L84 9 L100 3"
              fill="none"
              stroke="var(--color-blue)"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease }}
            />
          </svg>
          <p className="mt-2 text-micro text-muted">Collected this week: {inr(6.4 * k)}</p>
        </Card>
      );
    case "hr":
      return (
        <Card title="Attendance today">
          <Figure>
            {n(142, k)} <span className="font-normal text-muted">of {n(150, k)} present</span>
          </Figure>
          <div className="mt-3">
            <Bar value={94} />
          </div>
          <p className="mt-2 text-micro text-muted">Payroll ready for this month</p>
        </Card>
      );
  }
}

export function DashboardPreview({
  modules,
  size,
  mobileLimit,
}: {
  modules: ModuleId[];
  size: TeamSize;
  /** On phones, show only this many widgets (used by the hero, where the preview is a teaser). */
  mobileLimit?: number;
}) {
  const k = scale[size];
  const selected = erpModules.filter((m) => modules.includes(m.id));
  const widgets = [...selected].sort((a, b) => Number(b.id === "dashboards") - Number(a.id === "dashboards"));
  // The KPI row is always full width. If the remaining widgets are an odd
  // number, the last one is too, so the grid never ends on an empty slot.
  const tiles = widgets.filter((m) => m.id !== "dashboards").length;
  const isWide = (id: ModuleId, index: number) =>
    id === "dashboards" || (tiles % 2 === 1 && index === widgets.length - 1);

  return (
    <div className="overflow-hidden border-4 border-ink bg-surface">
      <div className="flex items-center gap-1.5 border-b-4 border-ink bg-white px-4 py-3">
        <span className="size-2.5 bg-blue" />
        <span className="size-2.5 bg-ink" />
        <span className="size-2.5 bg-ink" />
        <span className="ml-3 text-micro font-black uppercase tracking-wider text-ink">Your ERP</span>
        <span className={`ml-auto text-micro font-medium text-muted ${mobileLimit ? "hidden sm:inline" : ""}`}>
          {selected.length} of {erpModules.length} modules
        </span>
      </div>

      <LayoutGroup>
        {/* The module list joins from "lg": on tablets the figures need the full width for their labels. */}
        <div className={`grid grid-cols-1 sm:min-h-[26rem] lg:grid-cols-[12rem_minmax(0,1fr)] ${mobileLimit ? "" : "min-h-[16rem]"}`}>
          <aside className="hidden border-r-4 border-ink bg-white p-2.5 lg:block">
            <ul className="space-y-0.5">
              <AnimatePresence initial={false}>
                {selected.map((m) => (
                  <motion.li
                    key={m.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease }}
                    className="flex items-center gap-2.5 px-2 py-2 text-micro font-medium text-ink"
                  >
                    <ModuleIcon id={m.id} className="size-3.5 shrink-0 text-blue" />
                    <span className="truncate">{m.name}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </aside>

          <div className="relative p-3 sm:p-4">
            {selected.length === 0 && (
              <div className="absolute inset-0 grid place-items-center p-6 text-center">
                <div>
                  <LayoutDashboard aria-hidden className="mx-auto size-7 text-muted" />
                  <p className="mt-3 text-small text-muted">Pick a module to start building your ERP.</p>
                </div>
              </div>
            )}
            <ul className="grid gap-3 sm:grid-cols-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {widgets.map((m, i) => (
                  <motion.li
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.2, ease }}
                    className={`${isWide(m.id, i) ? "sm:col-span-2" : ""} ${
                      mobileLimit && i >= mobileLimit ? "hidden sm:block" : ""
                    }`}
                  >
                    <Widget id={m.id} k={k} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}
