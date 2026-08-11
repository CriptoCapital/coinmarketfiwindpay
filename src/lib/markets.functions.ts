import { createServerFn } from "@tanstack/react-start";

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
};

const FALLBACK: Coin[] = [];

export const getMarkets = createServerFn({ method: "GET" }).handler(async (): Promise<{
  coins: Coin[];
  error: string | null;
}> => {
  try {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h";
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) return { coins: FALLBACK, error: "Servicio de precios no disponible" };
    const raw = (await res.json()) as Array<Record<string, unknown>>;
    const coins: Coin[] = raw.map((c) => ({
      id: String(c["id"]),
      symbol: String(c["symbol"] ?? "").toUpperCase(),
      name: String(c["name"] ?? ""),
      image: String(c["image"] ?? ""),
      price: Number(c["current_price"] ?? 0),
      change24h: Number(c["price_change_percentage_24h"] ?? 0),
      volume24h: Number(c["total_volume"] ?? 0),
      marketCap: Number(c["market_cap"] ?? 0),
      sparkline: (
        ((c["sparkline_in_7d"] as { price?: number[] } | undefined)?.price ?? []) as number[]
      ).filter((_, i) => i % 6 === 0),
    }));
    return { coins, error: null };
  } catch {
    return { coins: FALLBACK, error: "Servicio de precios no disponible" };
  }
});
