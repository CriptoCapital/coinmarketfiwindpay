import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { label: "Mercados", href: "#mercados" },
  { label: "Trading", href: "#trading" },
  { label: "Gana", href: "#gana" },
  { label: "Ayuda", href: "#faq" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" aria-label="CriptoCapital inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <Button size="sm" className="font-semibold" asChild>
              <Link to="/panel">Mi panel</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/auth">Iniciar sesión</Link>
              </Button>
              <Button size="sm" className="font-semibold" asChild>
                <Link to="/auth">Registrarse</Link>
              </Button>
            </>
          )}
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          {!user && (
            <Button variant="outline" className="mt-2 w-full sm:hidden" asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
