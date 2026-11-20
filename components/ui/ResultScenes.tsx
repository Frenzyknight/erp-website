import { Blocks, ChartColumn, Check, ChevronRight, FileText, Package, UserRound } from "lucide-react";
import { StarMark } from "@/components/ui/Logo";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import type { ModuleId } from "@/lib/content";

/*
 * The four pictures in the results section, one per outcome. Each is drawn on
 * a 16:10 panel as if it were 640px wide and scales with the panel (see
 * ".scene" in globals.css), so sizes here are in that panel's units.
 * Every name and figure is made up, and matches the dashboard preview.
 *
 * Each picture replays a short story every eight seconds: its parts take
 * their turn one after another, left to right. The "animate-scene-*" moves all
 * share that loop, and "at" says how many seconds into it a part's turn comes.
 */

const at = (seconds: number) => ({ animationDelay: `${seconds}s` });

/* On navy the wash is the lighter blue, so it shows. */
const skyGlow = "[--glow:color-mix(in_srgb,var(--color-sky)_55%,transparent)]";

function Scene({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={label} className="scene aspect-[16/10] w-full overflow-hidden rounded-sm bg-white">
      <div aria-hidden className="relative size-full text-sub text-ink">
        {children}
      </div>
    </div>
  );
}

/** The badge and small capitals that name a column. */
function Head({ icon, strong = false, children }: { icon: React.ReactNode; strong?: boolean; children: string }) {
  return (
    <p
      className={`flex flex-col items-center gap-2 text-micro font-semibold tracking-[0.08em] whitespace-nowrap uppercase ${
        strong ? "text-ink" : "text-muted"
      }`}
    >
      <span className={`grid size-8 place-items-center rounded-sm ${strong ? "bg-tint text-blue" : "bg-surface text-navy"}`}>
        {icon}
      </span>
      {children}
    </p>
  );
}

/**
 * A dashed arrow. Its dashes drift towards the head all the time. On its turn
 * a streak with a bright tip runs along the shaft, and the head kicks forward
 * in the accent colour as the streak lands.
 */
function Arrow({ turn }: { turn: number }) {
  return (
    <span className="flex w-10 shrink-0 items-center text-mist">
      {/* The shaft clips the dashes, which are a strip twice its width sliding by one dash and gap, and the streak. */}
      <span className="relative h-1.5 flex-1 overflow-hidden">
        <span className="scene-dashes absolute top-1/2 left-0 h-px w-[200%] -translate-y-1/2 animate-scene-march" />
        <span
          style={at(turn)}
          className="absolute inset-y-0 flex w-6 animate-scene-travel items-center opacity-0"
        >
          <span className="h-0.5 flex-1 rounded-full bg-linear-to-r from-blue/0 to-blue" />
          <span className="-ml-0.5 size-1 shrink-0 rounded-full bg-blue" />
        </span>
      </span>
      <ChevronRight style={at(turn)} className="-ml-1.5 size-4 shrink-0 animate-scene-arrive" strokeWidth={2.25} />
    </span>
  );
}

/** A grey bar standing in for a line of text. */
function Line({ className = "w-full" }: { className?: string }) {
  return <span className={`block h-1.5 shrink-0 rounded-full bg-line ${className}`} />;
}

/** The one value on a document that matters, picked out. It lights up on its turn. */
function Mark({ turn, children }: { turn: number; children: string }) {
  return (
    <span
      style={at(turn)}
      className="animate-scene-glow self-start rounded-[3px] bg-tint px-1.5 py-0.5 font-mono text-micro font-semibold whitespace-nowrap text-blue"
    >
      {children}
    </span>
  );
}

const checks = ["Stock check", "Approval", "Record"];
const stock = [72, 88, 45, 93, 64, 80, 31];

/**
 * Lower costs: a purchase request passes through the ERP, which checks it
 * against stock. The values are read, the ERP runs its three checks, the
 * request is stamped, and the stock chart redraws.
 */
export function CostScene() {
  return (
    <Scene label="A purchase request is checked against stock levels and approved inside the ERP">
      <div className="grid h-full grid-cols-[repeat(5,auto)] place-content-center items-center justify-items-center gap-3">
        <Head icon={<FileText className="size-4" />}>Purchase request</Head>
        <span />
        <Head strong icon={<StarMark className="size-4" />}>
          Your ERP
        </Head>
        <span />
        <Head icon={<Package className="size-4" />}>Stores</Head>

        <div className="flex h-48 w-38 flex-col gap-2 rounded-sm border border-line bg-white p-4 shadow-card">
          <Line />
          <Line className="w-3/4" />
          <Mark turn={0.3}>Steel coils</Mark>
          <Line />
          <Line className="w-5/6" />
          <Mark turn={0.7}>₹4.2 L</Mark>
          <Line className="w-2/3" />
          <span
            style={at(3.5)}
            className="mt-auto inline-flex animate-scene-pop items-center gap-1 self-start rounded-full bg-navy px-2 py-1 text-micro font-semibold text-white"
          >
            <Check className="size-3" strokeWidth={2.5} />
            Approved
          </span>
        </div>

        <Arrow turn={1.1} />

        <div className="flex h-48 w-34 flex-col rounded-sm bg-navy p-3">
          {/* The star sits in a halo, and a ring spreads from it as it turns. */}
          <div className="grid flex-1 place-items-center pb-3">
            <span className="relative grid size-14 place-items-center rounded-full bg-white/8 ring-1 ring-white/15">
              <span
                style={at(2)}
                className="absolute inset-0 animate-scene-ripple rounded-full border border-sky opacity-0 [--ripple:1.4]"
              />
              <span style={at(2)} className="block animate-scene-turn">
                <StarMark className="size-8 text-white" />
              </span>
            </span>
          </div>
          {/* One list, a row to a check. Each row lights up and is ticked again on its turn. */}
          <ul className="flex flex-col divide-y divide-white/10 overflow-hidden rounded-sm bg-white/8">
            {checks.map((c, i) => (
              <li
                key={c}
                style={at(2.2 + i * 0.4)}
                className={`flex animate-scene-glow items-center justify-between gap-2 px-2.5 py-2 text-micro font-medium whitespace-nowrap text-white ${skyGlow}`}
              >
                {c}
                <span
                  style={at(2.2 + i * 0.4)}
                  className="grid size-3.5 shrink-0 animate-scene-pop place-items-center rounded-full bg-sky text-navy"
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Arrow turn={3.5} />

        <div className="flex h-48 w-44 flex-col rounded-sm bg-navy p-4">
          <div className="flex items-center justify-between">
            <span className="text-micro font-semibold text-sky">Stock levels</span>
            <span className="rounded-[3px] bg-white/10 px-1.5 py-0.5 font-mono text-micro text-mist">Live</span>
          </div>
          <div className="relative mt-3 flex flex-1 items-end gap-1.5">
            {stock.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%`, ...at(4.4 + i * 0.07) }}
                className={`flex-1 origin-bottom animate-scene-regrow rounded-t-[2px] ${h < 65 ? "bg-white/30" : "bg-sky"}`}
              />
            ))}
            {/* The reorder level: the three bars that end under it are the ones to buy. */}
            <span className="absolute inset-x-0 bottom-[65%] border-t border-dashed border-white/40" />
          </div>
          <p className="mt-3 text-micro whitespace-nowrap text-mist">3 items below reorder level</p>
        </div>
      </div>
    </Scene>
  );
}

const stages = ["Enquiry", "Quotation", "Order", "Delivery"];

/**
 * Faster operations: the four stages of an order, all done, and the delivery
 * figure they lead to. The line runs down through the stages as each one
 * ticks, then the figure rolls in.
 */
export function FlowScene() {
  return (
    <Scene label="An order moves from enquiry through quotation and order to delivery, with 96.2% delivered on time">
      <div className="flex h-full items-center justify-center gap-4">
        <ol className="relative flex w-60 flex-col gap-4">
          <span
            style={at(0.3)}
            className="absolute top-5 bottom-5 left-4.5 w-px -translate-x-1/2 animate-scene-wipe bg-blue [--wipe-x:0%] [--wipe-y:100%]"
          />
          {stages.map((s, i) => (
            <li key={s} className="relative flex items-center gap-3">
              <span
                style={at(0.3 + i * 0.45)}
                className="grid size-9 shrink-0 animate-scene-bump place-items-center rounded-full bg-blue text-white [--bump:1.22]"
              >
                <Check className="size-4.5" strokeWidth={2.5} />
              </span>
              <span className="flex flex-1 items-center justify-between rounded-sm border border-line bg-white px-4 py-3.5 shadow-card">
                <span className="text-caption font-semibold">{s}</span>
                <Line className="w-12" />
              </span>
            </li>
          ))}
        </ol>

        <Arrow turn={2.1} />

        <div className="flex w-60 flex-col items-center rounded-md bg-navy px-5 py-10 text-center">
          <span className="block overflow-hidden text-stat text-sky">
            <span style={at(3)} className="block animate-scene-rise">
              96.2%
            </span>
          </span>
          <span className="mt-2 text-sub font-semibold tracking-[0.08em] whitespace-nowrap text-white uppercase">
            On-time delivery
          </span>
          <span className="my-6 h-px w-24 bg-white/25" />
          <span
            style={at(3.5)}
            className="inline-flex animate-scene-pop items-center gap-1.5 rounded-full bg-sky px-3 py-1.5 text-sub font-semibold whitespace-nowrap text-navy"
          >
            <Check className="size-3.5" strokeWidth={2.5} />
            No chasing
          </span>
        </div>
      </div>
    </Scene>
  );
}

/* The record that is picked out of the grid: the second in the third row. */
const picked = 11;

/**
 * Full control: many records, and the one that needs a decision in front of
 * the person who makes it. A scan line runs down the grid, the record it
 * found is picked out, the beam opens from that record to the card, its
 * values are read, and Approve is pressed.
 */
export function ControlScene() {
  return (
    <Scene label="Out of a grid of records, one purchase order is held for a manager to approve or reject">
      <div className="absolute top-1/2 left-16 -translate-y-1/2">
        {/* Five columns of 12 with gaps of 3. The scan line reaches a new row every 0.37s, and the row lights up under it. */}
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              style={at(0.24 + Math.floor(i / 5) * 0.37)}
              className="relative grid size-12 animate-scene-flash place-items-center rounded-sm border border-line bg-surface text-mist"
            >
              <FileText className="size-5" strokeWidth={1.5} />
              {i === picked && (
                <>
                  {/* The picked look lies over the plain record, so the record is plain while it is being scanned. */}
                  <span className="absolute -inset-px grid animate-scene-select place-items-center rounded-sm border border-blue bg-white text-blue ring-4 ring-blue/15">
                    <FileText className="size-5" strokeWidth={1.5} />
                  </span>
                  <span
                    style={at(1.9)}
                    className="absolute -inset-px animate-scene-ripple rounded-sm border-2 border-blue opacity-0 [--ripple:1.7]"
                  />
                </>
              )}
            </span>
          ))}
        </div>
        {/* The scan line overhangs the grid a little, and trails a wash behind it. The box clips the wash at the top. */}
        <span className="absolute -inset-x-3 -inset-y-1.5 overflow-hidden">
          <span className="absolute inset-0 animate-scene-scan">
            <span className="absolute inset-x-0 bottom-full h-12 bg-linear-to-t from-blue/20 to-blue/0" />
            <span className="absolute inset-x-0 top-0 h-0.5 -translate-y-1/2 rounded-full bg-blue" />
          </span>
        </span>
      </div>

      {/* The beam widens from the right edge of the picked record to the height of the card, and grows out of its point. */}
      <span className="absolute top-18 left-43 h-64 w-57 origin-[0_61.7%] animate-scene-beam bg-linear-to-r from-blue/30 to-blue/10 [clip-path:polygon(0_61.7%,100%_3%,100%_97%)]" />

      <div className="absolute top-18 right-16 flex h-64 w-44 flex-col gap-3 rounded-md border-2 border-navy bg-white p-3.5 shadow-float">
        <div className="flex items-center justify-between">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-white">
            <UserRound className="size-3.5" />
          </span>
          {/* The badge reads "Approval" until the button is pressed, then "Approved" for a few seconds. */}
          <span className="relative text-micro font-semibold tracking-[0.08em] whitespace-nowrap uppercase">
            <span
              style={at(4.1)}
              className="inline-flex animate-scene-swap-out items-center gap-1.5 rounded-full bg-tint px-2.5 py-1 text-blue"
            >
              <span className="size-1.5 rounded-full bg-blue" />
              Approval
            </span>
            <span
              style={at(4.1)}
              className="absolute top-0 right-0 inline-flex h-full animate-scene-swap-in items-center gap-1 rounded-full bg-blue px-2.5 text-white opacity-0"
            >
              <Check className="size-3" strokeWidth={3} />
              Approved
            </span>
          </span>
        </div>
        <span className="font-mono text-sub">purchase-order</span>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-sm border border-line p-3">
          <Line />
          <Mark turn={2.9}>Packaging</Mark>
          <Line className="w-5/6" />
          <Line className="w-3/4" />
          <Mark turn={3.3}>₹0.8 L</Mark>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={at(3.9)}
            className="relative inline-flex h-8 flex-1 animate-scene-press items-center justify-center gap-1 rounded-sm bg-blue text-sub font-semibold text-white"
          >
            <Check className="size-3.5" strokeWidth={2.5} />
            Approve
            <span
              style={at(3.9)}
              className="absolute top-1/2 left-1/2 -mt-3 -ml-3 size-6 animate-scene-ripple rounded-full border-2 border-white opacity-0"
            />
          </span>
          <span className="inline-flex h-8 items-center rounded-sm border border-line px-3 text-sub font-semibold">
            Reject
          </span>
        </div>
      </div>
    </Scene>
  );
}

const sources: { id: ModuleId; name: string }[] = [
  { id: "sales", name: "Sales" },
  { id: "inventory", name: "Stores" },
  { id: "finance", name: "Accounts" },
];

const figures = [
  { label: "Revenue", value: "₹1.84 Cr" },
  { label: "Open orders", value: "146" },
  { label: "On-time", value: "96.2%" },
];

/**
 * Clear visibility: three modules feed one live dashboard. Each module
 * reports in turn, then the figures roll over and the chart redraws.
 */
export function VisibilityScene() {
  return (
    <Scene label="Sales, stores and accounts feed one live dashboard showing revenue, open orders and on-time delivery">
      <div className="grid h-full grid-cols-[repeat(3,auto)] place-content-center items-center justify-items-center gap-3">
        <Head icon={<Blocks className="size-4" />}>Modules</Head>
        <span />
        <Head strong icon={<ChartColumn className="size-4" />}>
          One dashboard
        </Head>

        <ul className="flex h-48 w-38 flex-col justify-between">
          {sources.map(({ id, name }, i) => (
            <li
              key={id}
              style={at(0.3 + i * 0.3)}
              className="flex animate-scene-bump items-center gap-2.5 rounded-sm border border-line bg-white p-3 shadow-card [--bump:1.06]"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-navy">
                <ModuleIcon id={id} className="size-4" />
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-sub font-semibold">{name}</span>
                <Line className="w-14" />
              </span>
            </li>
          ))}
        </ul>

        <Arrow turn={1.2} />

        <div className="flex h-48 w-80 flex-col rounded-sm bg-navy p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-micro font-semibold text-sky">This month</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-micro font-semibold">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-sky" />
                <span className="relative size-1.5 rounded-full bg-sky" />
              </span>
              Live
            </span>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2">
            {figures.map((f, i) => (
              <div key={f.label} className="rounded-sm bg-white/10 p-2.5">
                <dt className="truncate text-micro text-mist">{f.label}</dt>
                <dd className="mt-1 overflow-hidden text-body font-semibold whitespace-nowrap">
                  <span style={at(2.1 + i * 0.15)} className="block animate-scene-rise">
                    {f.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <div style={at(2.7)} className="relative mt-3 min-h-0 flex-1 animate-scene-wipe text-sky">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-0 size-full">
              <path
                d="M0 24 L14 20 L28 22 L42 14 L56 16 L70 9 L84 11 L100 3 V30 H0 Z"
                fill="currentColor"
                fillOpacity="0.16"
              />
              <path
                d="M0 24 L14 20 L28 22 L42 14 L56 16 L70 9 L84 11 L100 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>
    </Scene>
  );
}
