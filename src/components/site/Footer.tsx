import { Logo } from "./Logo";

const columns = [
  {
    title: "Productos",
    links: ["Spot", "Futuros", "Copy Trading", "Bots de trading", "Staking"],
  },
  { title: "Servicios", links: ["Comprar cripto", "Referidos", "VIP", "API", "Listados"] },
  { title: "Soporte", links: ["Centro de ayuda", "Tarifas", "Estado del sistema", "Contacto"] },
  { title: "Legal", links: ["Términos", "Privacidad", "AML/KYC", "Aviso de riesgo"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Plataforma de trading de criptomonedas con precios en tiempo real y ejecución
              simulada para aprender sin riesgo.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Aviso de riesgo: operar con criptomonedas conlleva un alto riesgo de pérdida. Los
            saldos de CriptoCapital son simulados y no representan dinero real.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} CriptoCapital. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
