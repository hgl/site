import { Temporal } from "temporal-polyfill";

export function resolveCSSValue(v: string, base: number): number {
  if (v.endsWith("%")) {
    return (parseFloat(v) / 100) * base;
  }
  return parseFloat(v);
}

export async function raf() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve(true)));
}

export function toDuration(ms: number): Temporal.Duration {
  return Temporal.Duration.from({
    milliseconds: ms,
  }).round({
    largestUnit: "days",
    smallestUnit: "minutes",
  });
}

export function toDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toSlug(s: string): string {
  return s.toLowerCase().replace(/\s/, "-");
}

export function trimPrefix(s: string, prefix: string): string {
  if (s.startsWith(prefix)) {
    return s.slice(prefix.length);
  }
  return s;
}

export async function asyncMap<T extends readonly any[], U>(
  arr: T,
  fn: (v: T[number], i: number, arr: T) => U | PromiseLike<U>,
): Promise<{ [K in keyof T]: U }> {
  const promises = arr.map((v, i) => fn(v, i, arr));
  return Promise.all(promises) as Promise<{ [K in keyof T]: U }>;
}

export function objectMap<T extends Record<string, any>, U>(
  obj: T,
  fn: (v: T[keyof T], k: keyof T, obj: T) => U,
): { [K in keyof T]: U } {
  const entries = Object.entries(obj).map(
    ([k, v]) => [k as keyof T, fn(v, k, obj)] as const,
  );
  return Object.fromEntries(entries) as { [K in keyof T]: U };
}

export function objectEntryMap<
  O extends Record<string, any>,
  V,
  R extends Record<string, V>,
>(
  obj: O,
  fn: (v: O[keyof O], k: keyof O, obj: O) => [string, V],
): { [K in keyof R]: V } {
  const entries = Object.entries(obj).map(([k, v]) => fn(v, k, obj));
  return Object.fromEntries(entries) as { [K in keyof R]: V };
}

export async function objectAsyncMap<T extends Record<string, any>, U>(
  obj: T,
  fn: (v: T[keyof T], k: keyof T, obj: T) => U | PromiseLike<U>,
): Promise<{ [K in keyof T]: U }> {
  const promises = Object.entries(obj).map(
    async ([k, v]) => [k as keyof T, await fn(v, k, obj)] as const,
  );
  return Object.fromEntries(await Promise.all(promises)) as {
    [K in keyof T]: U;
  };
}

export function pageTitle(title: string) {
  return `${title} | Glen Huang`;
}
