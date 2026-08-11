import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ShieldCheck, Zap, Coins, Wallet, LineChart, Smartphone } from "lucide-react";
import { getMarkets } from "@/lib/markets.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Ticker } from "@/components/site/Ticker";
import { MarketsTable } from "@/components/site/MarketsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const marketsQuery = queryOptions({
  queryKey: ["markets"],
  queryFn: () => getMarkets(),
  refetchInterval: 30_000,
  staleTime: 20_000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CriptoCapital — Compra y opera criptomonedas en segundos" },
      {
        name: "description",
        content:
          "Opera Bitcoin, Ethereum y más de 500 criptomonedas con precios en tiempo real, comisiones bajas y trading simulado sin riesgo.",
      },
      { property: "og:title", content: "CriptoCapital — Exchange de criptomonedas" },
      {
        property: "og:description",
        content:
          "Precios en tiempo real, spot, futuros y trading simulado. Empieza gratis en CriptoCapital.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(marketsQuery),
  errorComponent: ({ error }) => (
    <div role="alert" className="p-8 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">Página no encontrada</div>,
  component: Home,
});

const ventajas = [
  {
    icon: ShieldCheck,
    title: "Seguridad de nivel institucional",
    text: "Almacenamiento en frío, autenticación en dos pasos y fondo de protección para usuarios.",
  },
  {
    icon: Zap,
    title: "Motor ultrarrápido",
    text: "Hasta 100.000 órdenes por segundo con latencia inferior a 5 ms.",
  },
  {
    icon: Coins,
    title: "Comisiones desde 0,05%",
    text: "Tarifas competitivas en spot y futuros, con descuentos para usuarios VIP.",
  },
];

const pasos = [
  { icon: Wallet, title: "Crea tu cuenta", text: "Regístrate con tu correo en menos de un minuto." },
  { icon: Coins, title: "Añade saldo", text: "Recibe saldo de práctica para operar sin riesgo." },
  { icon: LineChart, title: "Empieza a operar", text: "Compra y vende con precios reales del mercado." },
];

const faqs = [
  {
    q: "¿CriptoCapital usa dinero real?",
    a: "No. Los precios provienen del mercado real, pero los saldos y las órdenes son simulados, pensados para practicar sin riesgo.",
  },
  {
    q: "¿Cuánto cuesta abrir una cuenta?",
    a: "Nada. El registro es gratuito y recibes saldo de práctica al instante.",
  },
  {
    q: "¿Qué criptomonedas puedo operar?",
    a: "Las principales del mercado: Bitcoin, Ethereum, Solana, XRP y cientos de pares más frente a USDT.",
  },
  {
    q: "¿Puedo usarlo desde el móvil?",
    a: "Sí, la plataforma está optimizada para móvil y funciona directamente en el navegador.",
  },
];

function Home() {
  const { data } = useSuspenseQuery(marketsQuery);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--primary)" }}
          />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Más de 500 criptomonedas disponibles
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Opera cripto como los <span className="text-primary">profesionales</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Precios reales en tiempo real, spot y futuros, y una experiencia diseñada para que
              domines el mercado desde el primer día.
            </p>

            <form
              className="mt-8 grid max-w-md gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                required
                placeholder="Correo electrónico"
                aria-label="Correo electrónico"
                className="h-12 bg-surface"
              />
              <Button type="submit" size="lg" className="h-12 shrink-0 font-semibold">
                Registrarse
              </Button>
            </form>

            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                ["Volumen 24h", "$4.8B"],
                ["Usuarios", "2,1M"],
                ["Activos listados", "540+"],
                ["Países", "180"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="num mt-1 text-2xl font-extrabold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Ticker coins={data.coins} />

        <MarketsTable coins={data.coins} error={data.error} />

        <section id="trading" className="border-y border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Por qué CriptoCapital</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {ventajas.map((v) => (
                <div key={v.title} className="rounded-xl border border-border bg-surface-2 p-6">
                  <v.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gana" className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Empieza en 3 pasos</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {pasos.map((p, i) => (
              <li key={p.title} className="rounded-xl border border-border p-6">
                <span className="num text-sm font-bold text-primary">0{i + 1}</span>
                <p.icon className="mt-3 h-6 w-6 text-primary" />
                <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid items-center gap-8 rounded-2xl border border-border bg-surface p-8 md:grid-cols-2">
            <div className="min-w-0">
              <Smartphone className="h-6 w-6 text-primary" />
              <h2 className="mt-3 text-2xl font-extrabold">Tu exchange, en el bolsillo</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Opera, sigue tus posiciones y recibe alertas de precio desde cualquier dispositivo.
                Sin instalaciones: funciona en el navegador de tu móvil.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button className="font-semibold">Crear cuenta gratis</Button>
                <Button variant="outline">Ver mercados</Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-5">
              {data.coins.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <img src={c.image} alt="" className="h-6 w-6 shrink-0 rounded-full" loading="lazy" />
                    <span className="truncate text-sm font-medium">{c.symbol}/USDT</span>
                  </span>
                  <span
                    className={`num text-sm font-semibold ${
                      c.change24h >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {c.change24h >= 0 ? "+" : ""}
                    {c.change24h.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-3xl px-4 pb-20">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center">
            <h2 className="text-2xl font-extrabold sm:text-4xl">
              Empieza a operar hoy con <span className="text-primary">CriptoCapital</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Crea tu cuenta gratuita y recibe saldo de práctica para dominar el mercado sin riesgo.
            </p>
            <Button size="lg" className="mt-6 font-semibold">
              Registrarse gratis
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
