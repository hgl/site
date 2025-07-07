import { Temporal } from "temporal-polyfill";

export function toISODate(s: string): string {
  const date = parseDate(s);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toDate(s: string): string {
  const date = parseDate(s);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toReadingTime(ms: number): string {
  const d = Temporal.Duration.from({
    milliseconds: ms,
  }).round({
    largestUnit: "days",
    smallestUnit: "minutes",
  });
  const df = new Intl.DurationFormat("en-US", { style: "short" });
  return df
    .formatToParts({
      days: d.days,
      hours: d.hours,
      minutes: d.minutes,
    })
    .map((p) => p.value)
    .join(" ");
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
