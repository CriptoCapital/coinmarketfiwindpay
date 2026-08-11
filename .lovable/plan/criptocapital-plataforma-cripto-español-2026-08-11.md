# CriptoCapital — Plataforma cripto (español)

Sitio de trading estilo KuCoin/Bitget, en español, tema negro y amarillo, mobile-first. Se construye por etapas; esta primera entrega es la **homepage**.

## Identidad visual
- Negro profundo como base (#0A0A0A / #121212 para superficies), amarillo eléctrico (#F5C518 / #FFD31A) como único acento.
- Tipografía técnica y densa: titulares condensados, números tabulares para precios.
- Verde/rojo solo en las variaciones de precio (mínimo necesario para legibilidad de mercado); todo lo demás en negro/amarillo/grises.
- Tokens semánticos en `src/styles.css` (oklch), sin colores fijos en componentes.

## Etapa 1 — Homepage (esta entrega)
- Header fijo: logo CriptoCapital, navegación (Mercados, Trading, Gana, Ayuda), botones "Iniciar sesión" y "Registrarse"; menú hamburguesa en móvil.
- Hero: propuesta de valor, campo de correo con CTA de registro, métricas (volumen 24h, usuarios, activos listados).
- Cinta de precios en vivo (ticker) con datos reales de CoinGecko.
- Tabla/lista de mercados: top monedas con precio, cambio 24h, volumen y mini-gráfico sparkline; pestañas Populares / Ganadores / Perdedores; en móvil se convierte en tarjetas.
- Secciones: "Por qué CriptoCapital" (seguridad, comisiones bajas, liquidez), "Cómo empezar" en 3 pasos, apps móviles, preguntas frecuentes, CTA final.
- Footer completo con columnas (Productos, Servicios, Soporte, Legal) y avisos de riesgo.
- SEO en español: título, descripción, og/twitter propios de la ruta.

## Datos de mercado
- Precios reales desde la API pública de CoinGecko (sin clave), consultados en el servidor mediante una función de servidor y cacheados con TanStack Query; refresco automático cada ~30 s.
- Si la API falla, la interfaz muestra un estado degradado en vez de romperse.

## Etapas siguientes (acordadas, se construyen después)
2. Registro/inicio de sesión con Lovable Cloud (correo + contraseña, más Google), perfil de usuario, recuperación de contraseña.
3. Dashboard: resumen de cartera, saldos, historial.
4. Trading simulado: par spot con gráfico, libro de órdenes, órdenes de mercado/límite, ejecución contra el precio real, saldos ficticios persistidos en la base de datos.
5. Extras estilo exchange: lista de mercados con búsqueda, detalle de moneda, depósitos/retiros simulados, historial de órdenes, notificaciones, referidos.

## Notas técnicas
- TanStack Start; rutas separadas por sección (`/`, luego `/mercados`, `/auth`, `/panel`, `/trading/$par`).
- Precios: `createServerFn` que llama a CoinGecko + `ensureQueryData`/`useSuspenseQuery`.
- Etapa 2 en adelante requiere activar Lovable Cloud (base de datos, autenticación) con RLS por usuario.
- Todo el texto de la interfaz en español; formato de números y moneda en `es-ES` (USD como divisa de cotización).
