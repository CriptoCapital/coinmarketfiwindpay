export const fmtPrice = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 6 : 2,
  }).format(n);

export const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(n)}%`;

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
