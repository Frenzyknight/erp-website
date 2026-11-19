import { erpModules, type ModuleId } from "@/lib/content";

export const industries = [
  { id: "manufacturing", label: "Manufacturing" },
  { id: "trading", label: "Trading" },
  { id: "retail", label: "Retail" },
  { id: "services", label: "Services" },
] as const;

export const teamSizes = [
  { id: "1-25", label: "1–25" },
  { id: "26-100", label: "26–100" },
  { id: "101-250", label: "101–250" },
  { id: "250+", label: "250+" },
] as const;

export type Industry = (typeof industries)[number]["id"];
export type TeamSize = (typeof teamSizes)[number]["id"];

export type Blueprint = {
  industry: Industry;
  modules: ModuleId[];
  size: TeamSize;
  /** True once the visitor has changed something, or arrived with a shared link. */
  touched: boolean;
};

export const suggestedModules: Record<Industry, ModuleId[]> = {
  manufacturing: ["sales", "purchase", "inventory", "production", "quality", "dashboards"],
  trading: ["sales", "purchase", "inventory", "finance", "dashboards"],
  retail: ["sales", "inventory", "finance", "dashboards"],
  services: ["sales", "finance", "hr", "dashboards"],
};

export const defaultBlueprint: Blueprint = {
  industry: "manufacturing",
  modules: suggestedModules.manufacturing,
  size: "26-100",
  touched: false,
};

const moduleOrder = erpModules.map((m) => m.id);
const moduleIds = new Set<string>(moduleOrder);

export function sortModules(ids: ModuleId[]) {
  return [...new Set(ids)].sort((a, b) => moduleOrder.indexOf(a) - moduleOrder.indexOf(b));
}

/** Build effort of each module, in weeks of a single team. */
const moduleWeight: Record<ModuleId, number> = {
  sales: 2,
  purchase: 1.5,
  inventory: 2,
  production: 3,
  quality: 1.5,
  finance: 2.5,
  hr: 2,
  dashboards: 1,
};

const sizeFactor: Record<TeamSize, number> = {
  "1-25": 0.85,
  "26-100": 1,
  "101-250": 1.15,
  "250+": 1.3,
};

/**
 * Indicative weeks from kick-off to go-live. Understand and Improve run first,
 * then Build and Training each overlap the previous phase by a week.
 */
export function estimateWeeks(bp: Blueprint) {
  const effort = bp.modules.reduce((sum, id) => sum + moduleWeight[id], 0);
  const large = bp.size === "101-250" || bp.size === "250+";
  const understand = large ? 3 : 2;
  const improve = bp.modules.length >= 5 ? 3 : 2;
  const build = Math.max(2, Math.round(effort * 0.7 * sizeFactor[bp.size]));
  const train = 2;
  return understand + improve + build + train - 2;
}

const labelOf = <T extends { id: string; label: string }>(list: readonly T[], id: string) =>
  list.find((x) => x.id === id)?.label ?? id;

export function summarise(bp: Blueprint) {
  const names = bp.modules.map((id) => erpModules.find((m) => m.id === id)?.name ?? id);
  return [
    `Industry: ${labelOf(industries, bp.industry)}`,
    `Team size: ${labelOf(teamSizes, bp.size)} people`,
    `Modules (${names.length}): ${names.join(", ") || "none yet"}`,
    `Indicative rollout: about ${estimateWeeks(bp)} weeks`,
  ].join("\n");
}

export function toSearch(bp: Blueprint) {
  const p = new URLSearchParams();
  p.set("industry", bp.industry);
  p.set("modules", bp.modules.join(","));
  p.set("size", bp.size);
  return p.toString();
}

export function fromSearch(search: string): Blueprint | null {
  const p = new URLSearchParams(search);
  if (!p.has("modules")) return null;
  const pick = <T extends string>(value: string | null, list: readonly { id: T }[], fallback: T): T =>
    list.find((x) => x.id === value)?.id ?? fallback;

  return {
    industry: pick(p.get("industry"), industries, defaultBlueprint.industry),
    modules: sortModules(
      (p.get("modules") ?? "").split(",").filter((m): m is ModuleId => moduleIds.has(m)),
    ),
    size: pick(p.get("size"), teamSizes, defaultBlueprint.size),
    touched: true,
  };
}
