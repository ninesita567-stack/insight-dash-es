import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { indicadores, locales, nivel, promedioLocal, type IndicadorId } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { LeyendaSemaforo } from "@/components/NivelBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mapa-de-calor")({
  head: () => ({
    meta: [
      { title: "Mapa de Calor — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Grilla interactiva de locales por indicador con tooltip de detalle y selección de local.",
      },
      { property: "og:title", content: "Mapa de Calor — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "Visualiza el cumplimiento de cada local por indicador en una grilla interactiva.",
      },
    ],
  }),
  component: MapaCalor,
});

const fondoNivel = {
  alto: "bg-alto text-primary-foreground",
  medio: "bg-medio text-navy",
  bajo: "bg-bajo text-primary-foreground",
} as const;

function MapaCalor() {
  const { localId, setLocalId } = useSeleccion();
  const [hover, setHover] = useState<{ localId: string; indicadorId: IndicadorId } | null>(null);

  const localHover = hover ? locales.find((l) => l.id === hover.localId) : null;
  const indHover = hover ? indicadores.find((i) => i.id === hover.indicadorId) : null;

  return (
    <div className="space-y-6">
      <section className="card-suave animar-entrada px-5 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Mapa de calor de locales por indicador</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pasa el cursor sobre una celda para ver el detalle. Haz clic para seleccionar el local.
            </p>
          </div>
          <LeyendaSemaforo className="hidden lg:flex" />
        </div>

        <div className="relative mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-44 px-2 pb-2 text-left text-xs font-medium text-muted-foreground">
                  Local
                </th>
                {indicadores.map((ind) => (
                  <th
                    key={ind.id}
                    className="px-1 pb-2 text-center text-xs font-medium text-muted-foreground"
                  >
                    {ind.abrev}
                  </th>
                ))}
                <th className="px-2 pb-2 text-center text-xs font-medium text-muted-foreground">
                  Promedio
                </th>
              </tr>
            </thead>
            <tbody>
              {locales.map((l) => {
                const activo = l.id === localId;
                return (
                  <tr key={l.id} className={cn(activo && "relative")}>
                    <th scope="row" className="px-0 py-0 text-left">
                      <button
                        type="button"
                        onClick={() => setLocalId(l.id)}
                        className={cn(
                          "w-full truncate rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                          activo
                            ? "bg-navy text-primary-foreground"
                            : "bg-muted/60 hover:bg-muted text-foreground",
                        )}
                      >
                        {l.nombre}
                      </button>
                    </th>
                    {indicadores.map((ind) => {
                      const v = l.puntajes[ind.id];
                      const esHover = hover?.localId === l.id && hover?.indicadorId === ind.id;
                      return (
                        <td key={ind.id} className="p-0">
                          <button
                            type="button"
                            onClick={() => setLocalId(l.id)}
                            onMouseEnter={() => setHover({ localId: l.id, indicadorId: ind.id })}
                            onMouseLeave={() => setHover(null)}
                            onFocus={() => setHover({ localId: l.id, indicadorId: ind.id })}
                            onBlur={() => setHover(null)}
                            aria-label={`${l.nombre}, ${ind.nombre}: ${v} puntos`}
                            className={cn(
                              "h-11 w-full rounded-lg text-sm font-semibold tabular-nums transition-all duration-200",
                              fondoNivel[nivel(v)],
                              esHover ? "scale-[1.06] shadow-elevada" : "opacity-90",
                              activo && "ring-2 ring-navy ring-offset-1 ring-offset-card",
                            )}
                          >
                            {v}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-0">
                      <div className="grid h-11 place-items-center rounded-lg border border-border bg-card text-sm font-semibold tabular-nums">
                        {promedioLocal(l)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 min-h-[4.5rem]">
          {localHover && indHover ? (
            <div className="animar-entrada rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-sm font-semibold">
                {localHover.nombre} · {indHover.nombre}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Puntaje {localHover.puntajes[indHover.id]} · promedio del local{" "}
                {promedioLocal(localHover)} · {localHover.evaluaciones} evaluaciones ·{" "}
                {localHover.ciudad}, zona {localHover.zona}
              </p>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
              Sin celda activa. El detalle del indicador aparecerá aquí al pasar el cursor.
            </p>
          )}
        </div>

        <LeyendaSemaforo className="mt-4 lg:hidden" />
      </section>
    </div>
  );
}
