CREATE TABLE public.saldos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activo text NOT NULL,
  cantidad numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, activo)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saldos TO authenticated;
GRANT ALL ON public.saldos TO service_role;

ALTER TABLE public.saldos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios gestionan sus propios saldos"
ON public.saldos FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_saldos_updated_at
BEFORE UPDATE ON public.saldos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.transacciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('deposito','retiro','compra','venta')),
  activo text NOT NULL,
  cantidad numeric NOT NULL,
  precio_usd numeric NOT NULL DEFAULT 0,
  total_usd numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.transacciones TO authenticated;
GRANT ALL ON public.transacciones TO service_role;

ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios gestionan sus propias transacciones"
ON public.transacciones FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_transacciones_user_created ON public.transacciones (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nombre, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nombre', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.saldos (user_id, activo, cantidad)
  VALUES (NEW.id, 'USDT', 10000)
  ON CONFLICT (user_id, activo) DO NOTHING;

  INSERT INTO public.transacciones (user_id, tipo, activo, cantidad, precio_usd, total_usd)
  VALUES (NEW.id, 'deposito', 'USDT', 10000, 1, 10000);

  RETURN NEW;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

INSERT INTO public.saldos (user_id, activo, cantidad)
SELECT id, 'USDT', 10000 FROM auth.users
ON CONFLICT (user_id, activo) DO NOTHING;
