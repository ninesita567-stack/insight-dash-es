import { createFileRoute } from "@tanstack/react-router";
import { comentarios, locales, promedioLocal } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { PanelComentarios } from "@/components/PanelComentarios";
import { NivelBadge } from "@/components/NivelBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comentarios")({
  head: () => ({
    meta: [
      { title: "Comentarios del Evaluador — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Panel contextual con resumen, recomendaciones y observaciones del evaluador para cada local.",
      },
      { property: "og:title", content: "Comentarios del Evaluador — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "Resumen, recomendaciones y observaciones por local evaluado.",
      },
    ],
  }),
  component: Comentarios,
});

function Comentarios() {
  const { localId, setLocalId } = useSeleccion();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="card-suave animar-entrada px-5 py-5">
        <h2 className="text-base font-semibold">Locales evaluados</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Selecciona un local para ver los comentarios de su última visita.
        </p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {locales.map((l) => {
            const p = promedioLocal(l);
            const activo = l.id === localId;
            return (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setLocalId(l.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
                    activo
                      ? "border-primary bg-primary/5 shadow-suave"
                      : "border-border hover:border-primary/40 hover:bg-muted/60",
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-medium">{l.nombre}</span>
                    <span className="shrink-0 text-lg font-semibold tabular-nums">{p}</span>
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-2">
                    <NivelBadge valor={p} />
                    <span className="text-xs text-muted-foreground">
                      {comentarios[l.id]?.fecha ?? "Sin visita"}
                    </span>
                  </span>
                  <span className="mt-2 block line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {comentarios[l.id]?.resumen}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <PanelComentarios className="lg:sticky lg:top-28 lg:self-start" />
    </div>
  );
}
