export function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  if (data.length < 2) return <div className="h-8 w-24" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / range) * 26}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-24" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        stroke={up ? "var(--up)" : "var(--down)"}
      />
    </svg>
  );
}
