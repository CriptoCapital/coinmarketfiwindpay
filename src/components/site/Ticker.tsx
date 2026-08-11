import type { Coin } from "@/lib/markets.functions";
import { fmtPct, fmtPrice } from "@/lib/format";

export function Ticker({ coins }: { coins: Coin[] }) {
  if (coins.length === 0) return null;
  const items = [...coins, ...coins];
  return (
    <div className="overflow-hidden border-y border-border bg-surface">
      <div className="flex w-max animate-[ticker_45s_linear_infinite] gap-8 py-2.5">
        {items.map((c, i) => (
          <span key={`${c.id}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="font-semibold">{c.symbol}</span>
            <span className="num text-muted-foreground">{fmtPrice(c.price)}</span>
            <span className={`num ${c.change24h >= 0 ? "text-up" : "text-down"}`}>
              {fmtPct(c.change24h)}
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
