import { nivel } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const clases = {
  alto: "bg-alto-suave text-alto",
  medio: "bg-medio-suave text-[oklch(0.55_0.14_72)]",
  bajo: "bg-bajo-suave text-bajo",
} as const;

const etiquetas = { alto: "Óptimo", medio: "En observación", bajo: "Crítico" } as const;

export function NivelBadge({ valor, className }: { valor: number; className?: string }) {
  const n = nivel(valor);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        clases[n],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {etiquetas[n]}
    </span>
  );
}

export function LeyendaSemaforo({ className }: { className?: string }) {
  const items = [
    { color: "bg-alto", texto: "Óptimo · ≥ 85" },
    { color: "bg-medio", texto: "En observación · 70 – 84" },
    { color: "bg-bajo", texto: "Crítico · < 70" },
  ];
  return (
    <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)}>
      {items.map((i) => (
        <span key={i.texto} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("h-2.5 w-2.5 rounded-sm", i.color)} />
          {i.texto}
        </span>
      ))}
    </div>
  );
}

export function colorBarra(valor: number) {
  const n = nivel(valor);
  return n === "alto" ? "bg-alto" : n === "medio" ? "bg-medio" : "bg-bajo";
}
