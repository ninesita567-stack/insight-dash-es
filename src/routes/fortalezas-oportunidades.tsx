import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { fortalezasOportunidades } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/fortalezas-oportunidades")({
  head: () => ({
    meta: [
      { title: "Fortalezas vs Oportunidades — Dashboard Maquinarias" },
      {
        name: "description",
        content:
          "Tabla comparativa de fortalezas consolidadas y oportunidades de mejora por tema evaluado.",
      },
      { property: "og:title", content: "Fortalezas vs Oportunidades — Dashboard Maquinarias" },
      {
        property: "og:description",
        content: "Comparativa de fortalezas y brechas de la red con nivel de impacto.",
      },
    ],
  }),
  component: FortalezasOportunidades,
});

const impacto = {
  Alto: "bg-bajo-suave text-bajo",
  Medio: "bg-medio-suave text-[oklch(0.55_0.14_72)]",
  Bajo: "bg-alto-suave text-alto",
} as const;

function FortalezasOportunidades() {
  return (
    <section className="card-suave animar-entrada overflow-hidden">
      <div className="px-5 py-5">
        <h2 className="text-base font-semibold">Fortalezas vs Oportunidades</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Síntesis cualitativa del ciclo de evaluación de la red.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-sm">
          <thead>
            <tr className="bg-navy text-primary-foreground">
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                Tema
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                Fortaleza
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                Oportunidad
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                Impacto
              </th>
            </tr>
          </thead>
          <tbody>
            {fortalezasOportunidades.map((f, i) => (
              <tr
                key={f.tema}
                className={cn(
                  "border-t border-border transition-colors hover:bg-muted/50",
                  i % 2 === 1 && "bg-muted/25",
                )}
              >
                <td className="px-5 py-4 font-medium">{f.tema}</td>
                <td className="px-5 py-4">
                  <span className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-alto" aria-hidden />
                    <span className="text-foreground/85">{f.fortaleza}</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex gap-2.5">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="text-foreground/85">{f.oportunidad}</span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      impacto[f.impacto],
                    )}
                  >
                    {f.impacto}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
