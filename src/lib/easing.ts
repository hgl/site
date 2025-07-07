export function spring(t: number): number {
  const s = 0.4;
  return --t * t * ((s + 1) * t + s) + 1;
}
