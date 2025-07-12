import { Temporal } from "temporal-polyfill";

export function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toDateString(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toReadingTimeString(dur: Temporal.Duration): string {
  const df = new Intl.DurationFormat("en-US", { style: "short" });
  return (
    df
      .formatToParts({
        days: dur.days,
        hours: dur.hours,
        minutes: dur.minutes,
      })
      .map((p) => p.value)
      .join(" ") + " read"
  );
}
