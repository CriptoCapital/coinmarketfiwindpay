import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Saldo = { id: string; activo: string; cantidad: number };
export type Transaccion = {
  id: string;
  tipo: string;
  activo: string;
  cantidad: number;
  precio_usd: number;
  total_usd: number;
  created_at: string;
};

export const getCartera = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ saldos: Saldo[]; transacciones: Transaccion[] }> => {
    const { supabase, userId } = context;

    const [saldosRes, txRes] = await Promise.all([
      supabase.from("saldos").select("id, activo, cantidad").eq("user_id", userId).order("activo"),
      supabase
        .from("transacciones")
        .select("id, tipo, activo, cantidad, precio_usd, total_usd, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (saldosRes.error) throw new Error(saldosRes.error.message);
    if (txRes.error) throw new Error(txRes.error.message);

    return {
      saldos: (saldosRes.data ?? []).map((s) => ({
        id: s.id,
        activo: s.activo,
        cantidad: Number(s.cantidad),
      })),
      transacciones: (txRes.data ?? []).map((t) => ({
        id: t.id,
        tipo: t.tipo,
        activo: t.activo,
        cantidad: Number(t.cantidad),
        precio_usd: Number(t.precio_usd),
        total_usd: Number(t.total_usd),
        created_at: t.created_at,
      })),
    };
  });

export const moverFondos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { tipo: "deposito" | "retiro"; cantidad: number }) => {
    if (data.tipo !== "deposito" && data.tipo !== "retiro") throw new Error("Tipo no válido");
    const cantidad = Number(data.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) throw new Error("Cantidad no válida");
    if (cantidad > 1_000_000) throw new Error("Cantidad demasiado alta");
    return { tipo: data.tipo, cantidad };
  })
  .handler(async ({ data, context }): Promise<{ ok: true; cantidad: number }> => {
    const { supabase, userId } = context;

    const { data: actual, error: readError } = await supabase
      .from("saldos")
      .select("id, cantidad")
      .eq("user_id", userId)
      .eq("activo", "USDT")
      .maybeSingle();
    if (readError) throw new Error(readError.message);

    const disponible = Number(actual?.cantidad ?? 0);
    const delta = data.tipo === "deposito" ? data.cantidad : -data.cantidad;
    if (disponible + delta < 0) throw new Error("Saldo insuficiente");
    const nuevo = disponible + delta;

    if (actual) {
      const { error } = await supabase
        .from("saldos")
        .update({ cantidad: nuevo })
        .eq("id", actual.id)
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("saldos")
        .insert({ user_id: userId, activo: "USDT", cantidad: nuevo });
      if (error) throw new Error(error.message);
    }

    const { error: txError } = await supabase.from("transacciones").insert({
      user_id: userId,
      tipo: data.tipo,
      activo: "USDT",
      cantidad: data.cantidad,
      precio_usd: 1,
      total_usd: data.cantidad,
    });
    if (txError) throw new Error(txError.message);

    return { ok: true, cantidad: nuevo };
  });
