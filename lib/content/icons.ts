import type { LucideIcon } from "lucide-react";
import {
  Smartphone,
  Layers,
  Workflow,
  Wrench,
  Cloud,
  ShieldCheck,
  Globe,
  Search,
  Palette,
  Frame,
  Megaphone,
  Sparkles,
  Receipt,
  Calculator,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users,
  Calendar,
  Trophy,
  Award,
} from "lucide-react";

export const ICON_KEYS = [
  "smartphone",
  "layers",
  "workflow",
  "wrench",
  "cloud",
  "shield",
  "globe",
  "search",
  "palette",
  "frame",
  "megaphone",
  "sparkles",
  "receipt",
  "calculator",
  "graduation",
  "phone",
  "mail",
  "map-pin",
  "clock",
  "users",
  "calendar",
  "trophy",
  "award",
] as const;

export const ICON_MAP: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  layers: Layers,
  workflow: Workflow,
  wrench: Wrench,
  cloud: Cloud,
  shield: ShieldCheck,
  globe: Globe,
  search: Search,
  palette: Palette,
  frame: Frame,
  megaphone: Megaphone,
  sparkles: Sparkles,
  receipt: Receipt,
  calculator: Calculator,
  graduation: GraduationCap,
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
  clock: Clock,
  users: Users,
  calendar: Calendar,
  trophy: Trophy,
  award: Award,
};

export function iconForKey(key?: string): LucideIcon {
  if (!key) return Sparkles;
  return ICON_MAP[key] ?? Sparkles;
}

export function keyOfIcon(icon: LucideIcon): string {
  for (const [key, cmp] of Object.entries(ICON_MAP)) {
    if (cmp === icon) return key;
  }
  return "sparkles";
}
