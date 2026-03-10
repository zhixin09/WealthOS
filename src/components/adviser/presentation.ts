import type { ImpactManifest, SeededEvent } from "@/components/adviser/contracts";

export function formatSgd(value: number, compact = false) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getWellnessTone(score: number) {
  if (score >= 80) {
    return {
      badge: "border border-emerald/30 bg-emerald/15 text-emerald",
      dot: "bg-emerald",
      text: "text-emerald",
      bar: "bg-emerald",
      stroke: "oklch(0.72 0.17 162)",
    };
  }

  if (score >= 60) {
    return {
      badge: "border border-amber/30 bg-amber/15 text-amber",
      dot: "bg-amber",
      text: "text-amber",
      bar: "bg-amber",
      stroke: "oklch(0.8 0.15 80)",
    };
  }

  return {
    badge: "border border-rose/30 bg-rose/15 text-rose",
    dot: "bg-rose",
    text: "text-rose",
    bar: "bg-rose",
    stroke: "oklch(0.65 0.2 15)",
  };
}

export function getSeverityTone(severity: ImpactManifest["severity"]) {
  switch (severity) {
    case "CRITICAL":
      return "border border-rose/30 bg-rose text-white";
    case "HIGH":
      return "border border-orange-400/30 bg-orange-500 text-white";
    case "MODERATE":
      return "border border-amber/30 bg-amber text-black";
    case "LOW":
    default:
      return "border border-emerald/30 bg-emerald text-zinc-950";
  }
}

export function getEventTypeTone(eventType: SeededEvent["event_type"]) {
  switch (eventType) {
    case "regulatory":
      return "border border-rose/30 bg-rose/15 text-rose";
    case "rate_decision":
      return "border border-amber/30 bg-amber/15 text-amber";
    case "trade_policy":
    default:
      return "border border-violet/30 bg-violet/15 text-violet";
  }
}

export function getUrgencyTone(urgency: "HIGH" | "MEDIUM" | "LOW") {
  switch (urgency) {
    case "HIGH":
      return "border border-rose/30 bg-rose/15 text-rose";
    case "MEDIUM":
      return "border border-amber/30 bg-amber/15 text-amber";
    case "LOW":
    default:
      return "border border-emerald/30 bg-emerald/15 text-emerald";
  }
}

export function scoreToStroke(score: number) {
  const circumference = 2 * Math.PI * 50;
  const filled = (score / 100) * circumference;
  return `${filled} ${circumference - filled}`;
}

export function sentenceCase(value: string) {
  return value.replaceAll("_", " ");
}
