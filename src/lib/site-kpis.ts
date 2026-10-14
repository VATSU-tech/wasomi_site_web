import { DEFAULT_SITE_KPIS, type SiteKpiItem, type SiteKpis } from "@/types/domain";

export function normalizeSiteKpis(raw: unknown): SiteKpis {
  const items = Array.isArray((raw as SiteKpis | undefined)?.items)
    ? (raw as SiteKpis).items
    : Array.isArray(raw)
      ? (raw as SiteKpiItem[])
      : [];

  const cleaned = items
    .map((item, index) => ({
      key: String(item?.key || `kpi-${index + 1}`).trim() || `kpi-${index + 1}`,
      label: String(item?.label || "").trim() || `Indicateur ${index + 1}`,
      value: Number.isFinite(Number(item?.value)) ? Number(item.value) : 0,
      suffix: typeof item?.suffix === "string" ? item.suffix : "",
    }))
    .filter((item) => item.label.length > 0);

  return {
    items: cleaned.length > 0 ? cleaned : DEFAULT_SITE_KPIS.items.map((k) => ({ ...k })),
  };
}

export { DEFAULT_SITE_KPIS };
