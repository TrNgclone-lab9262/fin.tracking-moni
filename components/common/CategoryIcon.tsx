import React from "react";
import {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  HeartPulse,
  Zap,
  Film,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Award,
  TrendingUp,
  CreditCard,
  Folder,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  HeartPulse,
  Zap,
  Film,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Award,
  TrendingUp,
  CreditCard,
};

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export function CategoryIcon({ name, className = "w-4 h-4" }: CategoryIconProps) {
  if (!name || !ICON_MAP[name]) {
    return <Folder className={className} />;
  }
  const IconComponent = ICON_MAP[name];
  return <IconComponent className={className} />;
}
