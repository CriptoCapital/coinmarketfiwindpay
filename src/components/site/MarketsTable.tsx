import { useState } from "react";
import type { Coin } from "@/lib/markets.functions";
import { fmtCompact, fmtPct, fmtPrice } from "@/lib/format";
import { Sparkline } from "./Sparkline";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "populares", label: "Populares" },
  { id: "ganadores", label: "Ganadores" },
  { id: "perdedores", label: "Perdedores" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function MarketsTable({ coins, error }: { coins: Coin[]; error: string | null }) {
  const [tab, setTab] = useState<TabId>("populares");

  const list = [...coins]
    .sort((a, b) =>
      tab === "ganadores"
        ? b.change24h - a.change24h
        : tab === "perdedores"
          ? a.change24h - b.change24h
          : b.marketCap - a.marketCap,
    )
    .slice(0, 10);

  return (
    <section id="mercados" className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Mercados en vivo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Precios reales actualizados cada 30 segundos.
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0">
          Ver todo
        </Button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          {error}. Vuelve a intentarlo en unos minutos.
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="hidden grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_auto] gap-4 border-b border-border px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground md:grid">
          <span>Par</span>
          <span className="text-right">Precio</span>
          <span className="text-right">24h</span>
          <span className="text-right">Volumen 24h</span>
          <span className="text-right">Gráfico 7d</span>
          <span className="text-right">Acción</span>
        </div>
        {list.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-4 py-3 last:border-0 md:grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_auto] md:px-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img src={c.image} alt={c.name} className="h-7 w-7 shrink-0 rounded-full" loading="lazy" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {c.symbol}<span className="text-muted-foreground">/USDT</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">{c.name}</p>
              </div>
            </div>
            <div className="text-right md:order-none">
              <p className="num text-sm font-semibold">{fmtPrice(c.price)}</p>
              <p className={`num text-xs md:hidden ${c.change24h >= 0 ? "text-up" : "text-down"}`}>
                {fmtPct(c.change24h)}
              </p>
            </div>
            <p
              className={`num hidden text-right text-sm font-medium md:block ${
                c.change24h >= 0 ? "text-up" : "text-down"
              }`}
            >
              {fmtPct(c.change24h)}
            </p>
            <p className="num hidden text-right text-sm text-muted-foreground md:block">
              ${fmtCompact(c.volume24h)}
            </p>
            <div className="hidden justify-end md:flex">
              <Sparkline data={c.sparkline} up={c.change24h >= 0} />
            </div>
            <div className="hidden justify-end md:flex">
              <Button size="sm" variant="secondary">
                Operar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
