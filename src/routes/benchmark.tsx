import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { benchmark, indicadores, promedioLocal, ranking } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { colorBarra, LeyendaSemaforo, NivelBadge } from "@/components/NivelBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/benchmark")({
  head: () => ({
    meta: [
      { title: "Benchmark y Ranking — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Comparativa Maquinarias vs Competencia por indicador y ranking de desempeño de los locales de la red.",
      },
      { property: "og:title", content: "Benchmark y Ranking — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "Barras dinámicas y colores tipo semáforo para comparar la red con la competencia.",
      },
    ],
  }),
  component: Benchmark,
});

function Benchmark() {
  const { localId, setLocalId } = useSeleccion();
  const [vista, setVista] = useState<"comparativa" | "ranking">("comparativa");

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-lg border border-border bg-card p-1 shadow-suave">
        {(
          [
            { id: "comparativa", label: "Maquinarias vs Competencia" },
            { id: "ranking", label: "Ranking de locales" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setVista(t.id)}
            className={cn(
              "rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              vista === t.id
                ? "bg-navy text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {vista === "comparativa" ? (
        <section className="card-suave animar-entrada px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Maquinarias vs Competencia</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Puntaje por indicador · escala 0 a 100
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Maquinarias
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-navy/40" /> Competencia
              </span>
            </div>
          </div>

          <ul className="mt-6 space-y-6">
            {benchmark.map((b) => {
              const ind = indicadores.find((i) => i.id === b.indicadorId)!;
              const dif = b.maquinarias - b.competencia;
              const Icono = dif > 0 ? TrendingUp : dif < 0 ? TrendingDown : Minus;
              return (
                <li key={b.indicadorId}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium">{ind.nombre}</span>
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 text-xs font-medium tabular-nums",
                        dif > 0 ? "text-alto" : dif < 0 ? "text-bajo" : "text-muted-foreground",
                      )}
                    >
                      <Icono className="h-3.5 w-3.5" aria-hidden />
                      {dif > 0 ? `+${dif}` : dif} pts
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <Barra valor={b.maquinarias} clase="bg-primary" etiqueta="Maquinarias" />
                    <Barra valor={b.competencia} clase="bg-navy/40" etiqueta="Competencia" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className="card-suave animar-entrada px-5 py-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Ranking de locales</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Haz clic en un local para actualizar el panel de comentarios.
              </p>
            </div>
            <LeyendaSemaforo className="hidden sm:flex" />
          </div>

          <ol className="mt-5 space-y-2.5">
            {ranking.map((l, i) => {
              const p = promedioLocal(l);
              const activo = l.id === localId;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => setLocalId(l.id)}
                    aria-current={activo}
                    className={cn(
                      "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 sm:gap-4",
                      activo
                        ? "border-primary bg-primary/5 shadow-suave"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-semibold",
                        i < 3 ? "bg-navy text-primary-foreground" : "bg-muted text-foreground/70",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-medium">{l.nombre}</span>
                        {activo && (
                          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                            Seleccionado
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-muted">
                        <span
                          className={cn(
                            "block h-full rounded-full transition-[width] duration-700",
                            colorBarra(p),
                          )}
                          style={{ width: `${p}%` }}
                        />
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {l.ciudad} · {l.evaluaciones} evaluaciones
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-xl font-semibold tabular-nums">{p}</span>
                      <NivelBadge valor={p} className="mt-1" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <LeyendaSemaforo className="mt-5 sm:hidden" />
        </section>
      )}
    </div>
  );
}

function Barra({ valor, clase, etiqueta }: { valor: number; clase: string; etiqueta: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[0.7rem] text-muted-foreground">{etiqueta}</span>
      <span className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
        <span
          className={cn("block h-full rounded-full transition-[width] duration-700 ease-out", clase)}
          style={{ width: `${valor}%` }}
        />
      </span>
      <span className="w-8 shrink-0 text-right text-xs font-medium tabular-nums">{valor}</span>
    </div>
  );
}
