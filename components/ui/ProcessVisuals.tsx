import { Check, Clock, X } from "lucide-react";

/*
 * The small product-style pictures at the top of each "How we work" card. They
 * follow one made-up order process through the three steps: mapped as it runs
 * today, then trimmed, then built. Each takes `on`, which turns true when the
 * scroll line reaches its step, and settles into its finished state then.
 * Text uses the "sub" and "micro" sizes only, so they read as screenshots.
 */

const heading = "min-w-0 truncate text-sub font-semibold text-muted";
const pill = "shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold";
const settle = "transition-[opacity,scale,translate] duration-700 ease-rise";

/** Step 1: the process as it runs today, with who owns each stage and where it stalls. */
export function UnderstandVisual({ on }: { on: boolean }) {
  const stages = [
    { name: "Enquiry", owner: "Sales" },
    { name: "Quotation", owner: "Sales" },
    { name: "Approval", owner: "Owner", stall: "Waits 3 days" },
    { name: "Dispatch", owner: "Stores" },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <p className={heading}>Order process, as it runs today</p>
      <ul className="mt-3 space-y-1.5">
        {stages.map((s) => (
          <li
            key={s.name}
            className={`flex items-center gap-2 rounded-[6px] border bg-white px-2.5 py-1 text-sub transition-colors duration-700 ease-out ${
              s.stall && on ? "border-blue" : "border-line"
            }`}
          >
            <span className="min-w-0 flex-1 truncate font-medium text-ink">{s.name}</span>
            {s.stall ? (
              <span
                className={`${pill} ${settle} inline-flex items-center gap-1 bg-tint text-blue-deep ${
                  on ? "" : "scale-90 opacity-0"
                }`}
              >
                <Clock className="size-3" strokeWidth={2.25} />
                {s.stall}
              </span>
            ) : (
              <span className="shrink-0 text-muted">{s.owner}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 2: the same process with the wasted steps struck out. */
export function ImproveVisual({ on }: { on: boolean }) {
  const steps = [
    { name: "Enquiry logged", keep: true },
    { name: "Re-typed into a sheet", keep: false },
    { name: "Quotation sent", keep: true },
    { name: "Approval chased on chat", keep: false },
    { name: "Order confirmed", keep: true },
  ];

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between gap-2">
        <p className={heading}>Order process, improved</p>
        <span className={`${pill} ${settle} bg-navy text-white ${on ? "" : "scale-90 opacity-0"}`}>5 → 3 steps</span>
      </div>
      <ul className="mt-3 space-y-2">
        {steps.map((s, i) => {
          const Icon = s.keep ? Check : X;
          const delay = { transitionDelay: on ? `${i * 90}ms` : "0ms" };
          return (
            <li key={s.name} className="flex items-center gap-2 text-sub">
              <span
                style={delay}
                className={`grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-500 ease-out ${
                  on && s.keep ? "bg-blue text-white" : "bg-line text-muted"
                }`}
              >
                <Icon
                  style={delay}
                  className={`size-2.5 transition-opacity duration-500 ease-out ${on ? "" : "opacity-0"}`}
                  strokeWidth={3}
                />
              </span>
              <span
                style={delay}
                className={`relative truncate transition-colors duration-500 ease-out ${
                  on && !s.keep ? "text-muted/60" : "font-medium text-ink"
                }`}
              >
                {s.name}
                {!s.keep && (
                  <span
                    style={delay}
                    className={`absolute inset-x-0 top-1/2 h-px origin-left bg-muted transition-[scale] duration-700 ease-rise ${
                      on ? "" : "scale-x-0"
                    }`}
                  />
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Step 3: the improved process as a working ERP screen. Until the step is
 * reached the screen is only a plan, dashed outlines where the tiles will go;
 * then the tiles fill in. All figures are illustrative.
 */
export function BuildVisual({ on }: { on: boolean }) {
  const tile = `rounded-[6px] border px-2.5 py-2 transition-colors duration-700 ease-out ${
    on ? "border-line bg-white" : "border-dashed border-mist"
  }`;
  const filled = `${settle} ${on ? "" : "translate-y-1 opacity-0"}`;
  const figures = [
    { label: "Open orders", value: "146" },
    { label: "On-time delivery", value: "96.2%" },
  ];
  const stock = [72, 88, 45, 93, 64, 80, 31, 76, 58];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-line bg-white px-3 py-2">
        <span className="size-2 rounded-full bg-blue" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="ml-2 text-micro font-semibold text-ink">Your ERP</span>
        <span className={`${pill} ${settle} ml-auto bg-tint text-blue-deep ${on ? "" : "scale-90 opacity-0"}`}>Live</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[auto_minmax(0,1fr)] gap-2 p-3">
        {figures.map((f, i) => {
          const delay = { transitionDelay: on ? `${i * 90}ms` : "0ms" };
          return (
            <div key={f.label} style={delay} className={tile}>
              <div style={delay} className={filled}>
                <p className="truncate text-micro text-muted">{f.label}</p>
                <p className="text-caption font-semibold text-ink">{f.value}</p>
              </div>
            </div>
          );
        })}
        <div style={{ transitionDelay: on ? "180ms" : "0ms" }} className={`col-span-2 flex min-h-0 flex-col ${tile}`}>
          <p style={{ transitionDelay: on ? "180ms" : "0ms" }} className={`text-micro text-muted ${filled}`}>
            Stock levels
          </p>
          <div className="mt-1.5 flex min-h-0 flex-1 items-end gap-1">
            {stock.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%`, transitionDelay: on ? `${260 + i * 40}ms` : "0ms" }}
                className={`flex-1 origin-bottom rounded-t-[3px] transition-[scale] duration-700 ease-rise ${
                  h < 50 ? "bg-sky" : "bg-blue"
                } ${on ? "" : "scale-y-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
