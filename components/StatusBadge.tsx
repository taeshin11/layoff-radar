"use client";
import { useTranslations } from "next-intl";

interface StatusBadgeProps {
  status: "hiring" | "freeze" | "layoffs";
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const t = useTranslations("status");
  const configs = {
    hiring: {
      emoji: "🟢",
      label: t("hiring"),
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    freeze: {
      emoji: "🟡",
      label: t("freeze"),
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    layoffs: {
      emoji: "🔴",
      label: t("layoffs"),
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };
  const cfg = configs[status];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${cfg.className} ${sizeClass}`}>
      <span>{cfg.emoji}</span>
      {cfg.label}
    </span>
  );
}
