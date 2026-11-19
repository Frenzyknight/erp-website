import {
  BadgeCheck,
  ChartColumn,
  Factory,
  Handshake,
  Landmark,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ModuleId } from "@/lib/content";

const icons: Record<ModuleId, LucideIcon> = {
  sales: Handshake,
  purchase: ShoppingCart,
  inventory: Package,
  production: Factory,
  quality: BadgeCheck,
  finance: Landmark,
  hr: Users,
  dashboards: ChartColumn,
};

export function ModuleIcon({ id, className = "size-5" }: { id: ModuleId; className?: string }) {
  const Icon = icons[id];
  return <Icon aria-hidden className={className} />;
}
