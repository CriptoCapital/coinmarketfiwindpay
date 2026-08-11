import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/site/Logo";
import { getCartera, moverFondos } from "@/lib/cartera.functions";
import { getMarkets } from "@/lib/markets.functions";
import { fmtPct, fmtPrice } from "@/lib/format";
import { Sparkline } from "@/components/site/Sparkline";

export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({
    meta: [
      { title: "Mi panel | CriptoCapital" },
      {
        name: "description",
        content: "Tu cuenta de CriptoCapital: perfil, saldo de práctica y accesos rápidos.",
      },
      { property: "og:title", content: "Mi panel | CriptoCapital" },
      {
        property: "og:description",
        content: "Tu cuenta de CriptoCapital: perfil y saldo de práctica.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Panel,
});

function Panel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [monto, setMonto] = useState("");

  const fetchCartera = useServerFn(getCartera);
  const enviarFondos = useServerFn(moverFondos);

  const carteraQuery = useQuery({
    queryKey: ["cartera"],
    queryFn: () => fetchCartera(),
  });

  const marketsQuery = useQuery({
    queryKey: ["markets"],
    queryFn: () => getMarkets(),
    refetchInterval: 30_000,
  });

  const mutation = useMutation({
    mutationFn: (vars: { tipo: "deposito" | "retiro"; cantidad: number }) =>
      enviarFondos({ data: vars }),
    onSuccess: (_d, vars) => {
      toast.success(vars.tipo === "deposito" ? "Fondos añadidos" : "Retiro realizado");
      setMonto("");
      queryClient.invalidateQueries({ queryKey: ["cartera"] });
    },
    onError: (error: Error) => toast.error(error.message || "No se pudo completar la operación"),
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!active || !userData.user) return;
      setEmail(userData.user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("nombre")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (active) setNombre(data?.nombre ?? null);
    })();
    return () => {
      active = false;
    };
  }, []);

  const precios = useMemo(() => {
    const map = new Map<string, { price: number; change24h: number; sparkline: number[] }>();
    for (const c of marketsQuery.data?.coins ?? []) {
      map.set(c.symbol, { price: c.price, change24h: c.change24h, sparkline: c.sparkline });
    }
    return map;
  }, [marketsQuery.data]);

  const saldos = carteraQuery.data?.saldos ?? [];
  const transacciones = carteraQuery.data?.transacciones ?? [];

  const posiciones = saldos.map((s) => {
    const info = precios.get(s.activo);
    const precio = s.activo === "USDT" ? 1 : (info?.price ?? 0);
    return {
      ...s,
      precio,
      valor: s.cantidad * precio,
      change24h: s.activo === "USDT" ? 0 : (info?.change24h ?? 0),
      sparkline: info?.sparkline ?? [],
    };
  });

  const total = posiciones.reduce((acc, p) => acc + p.valor, 0);
  const disponible = posiciones.find((p) => p.activo === "USDT")?.valor ?? 0;
  const invertido = total - disponible;

  const onLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" aria-label="CriptoCapital inicio">
            <Logo />
          </Link>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Hola, <span className="text-primary">{nombre ?? "trader"}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{email}</p>

        <section aria-label="Resumen de cartera" className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor total</p>
            <p className="num mt-2 text-2xl font-extrabold text-primary">
              {carteraQuery.isPending ? "—" : fmtPrice(total)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Disponible (USDT)
            </p>
            <p className="num mt-2 text-2xl font-extrabold">
              {carteraQuery.isPending ? "—" : fmtPrice(disponible)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">En cripto</p>
            <p className="num mt-2 text-2xl font-extrabold">
              {carteraQuery.isPending ? "—" : fmtPrice(invertido)}
            </p>
          </div>
        </section>

        <section
          aria-label="Depósitos y retiros de práctica"
          className="mt-6 rounded-xl border border-border bg-surface p-6"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Wallet className="h-4 w-4 text-primary" /> Fondos de práctica
          </h2>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({ tipo: "deposito", cantidad: Number(monto) });
            }}
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="Cantidad en USDT"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              aria-label="Cantidad en USDT"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 font-semibold" disabled={mutation.isPending}>
                <ArrowDownToLine className="mr-1 h-4 w-4" /> Depositar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ tipo: "retiro", cantidad: Number(monto) })}
              >
                <ArrowUpFromLine className="mr-1 h-4 w-4" /> Retirar
              </Button>
            </div>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Saldos simulados: no hay dinero real ni movimientos bancarios.
          </p>
        </section>

        <section aria-label="Mis saldos" className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Mis saldos</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
            {posiciones.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                {carteraQuery.isPending ? "Cargando cartera…" : "Todavía no tienes saldos."}
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {posiciones.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{p.activo}</p>
                      <p className="num text-xs text-muted-foreground">
                        {p.cantidad.toLocaleString("es-ES", { maximumFractionDigits: 8 })} {p.activo}
                      </p>
                    </div>
                    {p.sparkline.length > 1 && (
                      <div className="hidden sm:block">
                        <Sparkline data={p.sparkline} up={p.change24h >= 0} />
                      </div>
                    )}
                    <div className="text-right">
                      <p className="num font-semibold">{fmtPrice(p.valor)}</p>
                      {p.activo !== "USDT" && (
                        <p
                          className={`num text-xs ${p.change24h >= 0 ? "text-up" : "text-down"}`}
                        >
                          {fmtPct(p.change24h)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section aria-label="Historial de movimientos" className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Historial</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
            {transacciones.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                {carteraQuery.isPending ? "Cargando movimientos…" : "Sin movimientos todavía."}
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {transacciones.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold capitalize">
                        {t.tipo} · {t.activo}
                      </p>
                      <p className="num text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <p
                      className={`num text-sm font-semibold ${
                        t.tipo === "deposito" || t.tipo === "compra" ? "text-up" : "text-down"
                      }`}
                    >
                      {t.tipo === "deposito" || t.tipo === "compra" ? "+" : "−"}
                      {t.cantidad.toLocaleString("es-ES", { maximumFractionDigits: 8 })} {t.activo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
