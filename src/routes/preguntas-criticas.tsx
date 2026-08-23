import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { indicadores, locales, preguntas } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { colorBarra, LeyendaSemaforo, NivelBadge } from "@/components/NivelBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/preguntas-criticas")({
  head: () => ({
    meta: [
      { title: "Preguntas Críticas — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Listado desplegable de las preguntas con menor cumplimiento en la evaluación, con filtro por local.",
      },
      { property: "og:title", content: "Preguntas Críticas — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "Preguntas de menor cumplimiento y su porcentaje por local.",
      },
    ],
  }),
  component: PreguntasCriticas,
});

function PreguntasCriticas() {
  const { localId, local, setLocalId } = useSeleccion();
  const [ambito, setAmbito] = useState<"red" | "local">("red");

  const lista = [...preguntas]
    .map((p) => ({
      ...p,
      valor: ambito === "red" ? p.cumplimientoGlobal : (p.cumplimientoPorLocal[localId] ?? 0),
    }))
    .sort((a, b) => a.valor - b.valor);

  return (
    <div className="space-y-6">
      <section className="card-suave animar-entrada px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Preguntas de menor cumplimiento</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {ambito === "red"
                ? "Promedio de toda la red de locales."
                : `Resultados de ${local.nombre}.`}
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            {(
              [
                { id: "red", label: "Toda la red" },
                { id: "local", label: "Local seleccionado" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setAmbito(t.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  ambito === t.id
                    ? "bg-navy text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-5">
          {lista.map((p, i) => {
            const ind = indicadores.find((x) => x.id === p.indicadorId)!;
            return (
              <AccordionItem key={p.id} value={p.id} className="border-border">
                <AccordionTrigger className="gap-4 py-4 hover:no-underline">
                  <span className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-left">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.texto}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{ind.nombre}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="hidden h-2 w-24 overflow-hidden rounded-full bg-muted sm:block">
                        <span
                          className={cn("block h-full rounded-full", colorBarra(p.valor))}
                          style={{ width: `${p.valor}%` }}
                        />
                      </span>
                      <span className="w-11 text-right text-sm font-semibold tabular-nums">
                        {p.valor}%
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3.5 w-3.5 text-primary" aria-hidden />
                    Cumplimiento por local · haz clic para seleccionar
                  </div>
                  <ul className="mt-3 grid gap-2 md:grid-cols-2">
                    {locales
                      .map((l) => ({ l, v: p.cumplimientoPorLocal[l.id] ?? 0 }))
                      .sort((a, b) => a.v - b.v)
                      .map(({ l, v }) => (
                        <li key={l.id}>
                          <button
                            type="button"
                            onClick={() => setLocalId(l.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                              l.id === localId
                                ? "border-primary bg-primary/5"
                                : "border-border hover:bg-muted/60",
                            )}
                          >
                            <span className="min-w-0 flex-1 truncate">{l.nombre}</span>
                            <span className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                              <span
                                className={cn("block h-full rounded-full", colorBarra(v))}
                                style={{ width: `${v}%` }}
                              />
                            </span>
                            <span className="w-10 shrink-0 text-right font-semibold tabular-nums">
                              {v}%
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <NivelBadge valor={p.valor} />
                    <span className="text-xs text-muted-foreground">
                      Promedio de la red: {p.cumplimientoGlobal}%
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <LeyendaSemaforo className="mt-5" />
      </section>
    </div>
  );
}
