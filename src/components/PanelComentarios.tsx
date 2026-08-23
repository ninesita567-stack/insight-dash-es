import { CalendarDays, ClipboardList, Lightbulb, MessageSquareQuote, UserRound } from "lucide-react";
import { comentarios, indicadores, promedioLocal } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { NivelBadge } from "@/components/NivelBadge";
import { cn } from "@/lib/utils";

export function PanelComentarios({ className }: { className?: string }) {
  const { local } = useSeleccion();
  const c = comentarios[local.id];
  const promedio = promedioLocal(local);

  const peor = [...indicadores].sort((a, b) => local.puntajes[a.id] - local.puntajes[b.id])[0]!;

  return (
    <section
      key={local.id}
      className={cn("card-suave animar-entrada overflow-hidden", className)}
      aria-label="Comentarios del evaluador"
    >
      <header className="border-b border-border bg-navy px-5 py-4 text-primary-foreground">
        <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase opacity-70">
          <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden />
          Comentarios del evaluador
        </p>
        <h2 className="mt-2 truncate text-lg font-semibold">{local.nombre}</h2>
        <p className="mt-1 text-xs opacity-75">
          {local.ciudad} · Zona {local.zona} · {local.evaluaciones} evaluaciones
        </p>
      </header>

      <div className="space-y-5 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Puntaje del local</p>
            <p className="text-3xl font-semibold tabular-nums text-foreground">{promedio}</p>
          </div>
          <NivelBadge valor={promedio} />
        </div>

        {c ? (
          <>
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Resumen
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{c.resumen}</p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                <Lightbulb className="h-3.5 w-3.5 text-primary" aria-hidden />
                Recomendaciones
              </p>
              <ul className="mt-2 space-y-2">
                {c.recomendaciones.map((r) => (
                  <li
                    key={r}
                    className="rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm leading-relaxed"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                <ClipboardList className="h-3.5 w-3.5 text-primary" aria-hidden />
                Observaciones
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed">
                {c.observaciones.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-foreground/85">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              Indicador más débil:{" "}
              <span className="font-medium text-foreground">
                {peor.nombre} ({local.puntajes[peor.id]})
              </span>
            </div>

            <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                Evaluador: {c.evaluador}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {c.fecha}
              </span>
            </footer>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Sin comentarios registrados.</p>
        )}
      </div>
    </section>
  );
}
