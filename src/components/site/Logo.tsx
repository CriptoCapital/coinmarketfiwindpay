export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary font-display text-lg font-extrabold text-primary-foreground">
        C
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight">
        Cripto<span className="text-primary">Capital</span>
      </span>
    </span>
  );
}
