import * as Icons from "lucide-react";
import {LucideIcon} from "lucide-react";
import type {IconNames} from "@/types/categories";

export function getIconByName(name: string): LucideIcon {
  const icon = Icons[name as IconNames];
  return (typeof icon === "object" ? icon : Icons.HelpCircle) as LucideIcon;
}