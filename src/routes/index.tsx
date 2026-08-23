import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronDown,
  ClipboardCheck,
  Gauge,
  ThumbsDown,
  Trophy,
} from "lucide-react";
import {
  indicadores,
  indicadoresCriticos,
  locales,
  mejorLocal,
  peorLocal,
  promedioLocal,
  puntajeGlobal,
  totalEvaluaciones,
} from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import { colorBarra, LeyendaSemaforo, NivelBadge } from "@/components/NivelBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panel Ejecutivo — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Panel ejecutivo con puntaje global, evaluaciones e indicadores críticos de la red de locales Maquinarias.",
      },
      { property: "og:title", content: "Panel Ejecutivo — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "KPIs, benchmark y mapa de calor de la evaluación institucional de locales.",
      },
    ],
  }),
  component: PanelEjecutivo,
});

type KpiId = "global" | "evaluaciones" | "mejor" | "peor" | "criticos";

function PanelEjecutivo() {
  const [abierto, setAbierto] = useState<KpiId | null>("global");
  const criticos = indicadoresCriticos();
  const { local, setLocalId } = useSeleccion();

  const kpis = [
    {
      id: "global" as KpiId,
      etiqueta: "Puntaje Global",
      valor: `${puntajeGlobal}`,
      sufijo: "/ 100",
      detalle: "Promedio ponderado de 6 indicadores en 8 locales",
      icono: Gauge,
    },
    {
      id: "evaluaciones" as KpiId,
      etiqueta: "Evaluaciones",
      valor: `${totalEvaluaciones}`,
      sufijo: "visitas",
      detalle: "Ciclo enero – agosto 2026",
      icono: ClipboardCheck,
    },
    {
      id: "mejor" as KpiId,
      etiqueta: "Mejor Evaluación",
      valor: `${promedioLocal(mejorLocal)}`,
      sufijo: mejorLocal.nombre.replace("Maquinarias ", ""),
      detalle: mejorLocal.nombre,
      icono: Trophy,
    },
    {
      id: "peor" as KpiId,
      etiqueta: "Peor Evaluación",
      valor: `${promedioLocal(peorLocal)}`,
      sufijo: peorLocal.nombre.replace("Maquinarias ", ""),
      detalle: peorLocal.nombre,
      icono: ThumbsDown,
    },
    {
      id: "criticos" as KpiId,
      etiqueta: "Indicadores Críticos",
      valor: `${criticos.length}`,
      sufijo: "bajo 65 pts",
      detalle: "Requieren plan de acción inmediato",
      icono: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="animar-entrada">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
          {kpis.map((kpi) => {
            const activo = abierto === kpi.id;
            return (
              <button
                key={kpi.id}
                type="button"
                onClick={() => setAbierto(activo ? null : kpi.id)}
                aria-expanded={activo}
                className={cn(
                  "card-suave card-interactiva px-4 py-4 text-left",
                  activo && "border-primary/45 shadow-elevada",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    {kpi.etiqueta}
                  </p>
                  <kpi.icono
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      activo ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                </div>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tabular-nums">{kpi.valor}</span>
                  <span className="truncate text-xs text-muted-foreground">{kpi.sufijo}</span>
                </p>
                <p className="mt-2 flex items-center gap-1 text-[0.7rem] text-muted-foreground">
                  <ChevronDown
                    className={cn("h-3 w-3 transition-transform duration-300", activo && "rotate-180")}
                    aria-hidden
                  />
                  {activo ? "Ocultar desglose" : "Ver desglose"}
                </p>
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            abierto ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            {abierto && <Desglose id={abierto} onSeleccionar={setLocalId} />}
          </div>
        </div>
      </section>

      <section className="card-suave animar-entrada px-5 py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Promedio por indicador</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Red completa · comparado con {local.nombre}
            </p>
          </div>
          <LeyendaSemaforo className="hidden sm:flex" />
        </div>

        <ul className="mt-5 space-y-4">
          {indicadores.map((ind) => {
            const red = Math.round(
              locales.reduce((a, l) => a + l.puntajes[ind.id], 0) / locales.length,
            );
            const localVal = local.puntajes[ind.id];
            return (
              <li key={ind.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium">{ind.nombre}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    red {red} · local{" "}
                    <span className="font-semibold text-foreground">{localVal}</span>
                  </span>
                </div>
                <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-700", colorBarra(red))}
                    style={{ width: `${red}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-navy"
                    style={{ left: `calc(${localVal}% - 1.5px)` }}
                    title={`${local.nombre}: ${localVal}`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <LeyendaSemaforo className="mt-5 sm:hidden" />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/mapa-de-calor"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explorar mapa de calor
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          to="/preguntas-criticas"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Revisar preguntas críticas
        </Link>
      </div>
    </div>
  );
}

function Desglose({ id, onSeleccionar }: { id: KpiId; onSeleccionar: (id: string) => void }) {
  const criticos = indicadoresCriticos();

  if (id === "criticos") {
    return (
      <div className="card-suave animar-entrada px-5 py-5">
        <h3 className="text-sm font-semibold">Indicadores bajo el umbral crítico (65 puntos)</h3>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {criticos.map((c) => (
            <li key={`${c.local.id}-${c.indicadorId}`}>
              <button
                type="button"
                onClick={() => onSeleccionar(c.local.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.local.nombre}</span>
                  <span className="text-xs text-muted-foreground">
                    {indicadores.find((i) => i.id === c.indicadorId)?.nombre}
                  </span>
                </span>
                <span className="shrink-0 text-base font-semibold tabular-nums text-bajo">
                  {c.valor}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (id === "evaluaciones") {
    return (
      <div className="card-suave animar-entrada px-5 py-5">
        <h3 className="text-sm font-semibold">Evaluaciones realizadas por local</h3>
        <ul className="mt-4 space-y-3">
          {locales.map((l) => (
            <li key={l.id} className="flex items-center gap-3 text-sm">
              <span className="w-48 min-w-0 truncate">{l.nombre}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-navy transition-[width] duration-700"
                  style={{ width: `${(l.evaluaciones / 12) * 100}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right tabular-nums">{l.evaluaciones}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (id === "mejor" || id === "peor") {
    const l = id === "mejor" ? mejorLocal : peorLocal;
    return (
      <div className="card-suave animar-entrada px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">
            {id === "mejor" ? "Mejor evaluación" : "Peor evaluación"} · {l.nombre}
          </h3>
          <button
            type="button"
            onClick={() => onSeleccionar(l.id)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            Seleccionar este local
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {indicadores.map((ind) => (
            <div key={ind.id} className="rounded-lg border border-border bg-muted/50 px-3 py-2.5">
              <p className="truncate text-xs text-muted-foreground">{ind.nombre}</p>
              <p className="mt-1 flex items-center justify-between gap-2">
                <span className="text-xl font-semibold tabular-nums">{l.puntajes[ind.id]}</span>
                <NivelBadge valor={l.puntajes[ind.id]} />
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-suave animar-entrada px-5 py-5">
      <h3 className="text-sm font-semibold">Composición del puntaje global</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Distribución de locales por nivel de cumplimiento.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {(
          [
            { n: "alto", t: "Óptimo", clase: "text-alto", fondo: "bg-alto-suave" },
            { n: "medio", t: "En observación", clase: "text-medio", fondo: "bg-medio-suave" },
            { n: "bajo", t: "Crítico", clase: "text-bajo", fondo: "bg-bajo-suave" },
          ] as const
        ).map((g) => {
          const grupo = locales.filter((l) => {
            const p = promedioLocal(l);
            return g.n === "alto" ? p >= 85 : g.n === "medio" ? p >= 70 && p < 85 : p < 70;
          });
          return (
            <div key={g.n} className={cn("rounded-lg px-4 py-3", g.fondo)}>
              <p className="text-xs font-medium text-foreground/70">{g.t}</p>
              <p className={cn("mt-1 text-2xl font-semibold tabular-nums", g.clase)}>
                {grupo.length}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-foreground/75">
                {grupo.map((l) => (
                  <li key={l.id} className="truncate">
                    {l.nombre}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
