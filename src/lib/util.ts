// place files you want to import through the `$lib` alias in this folder.

export function resolveCSSValue(v: string, base: number): number {
  if (v.endsWith("%")) {
    return (parseFloat(v) / 100) * base;
  }
  return parseFloat(v);
}
