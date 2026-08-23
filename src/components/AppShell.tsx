import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Grid3x3,
  LayoutDashboard,
  ListChecks,
  MessageSquareQuote,
  Scale,
} from "lucide-react";
import type { ReactNode } from "react";
import { SelectorLocal } from "@/components/SelectorLocal";
import { PanelComentarios } from "@/components/PanelComentarios";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Panel Ejecutivo", icon: LayoutDashboard },
  { to: "/benchmark", label: "Benchmark y Ranking", icon: BarChart3 },
  { to: "/mapa-de-calor", label: "Mapa de Calor", icon: Grid3x3 },
  { to: "/preguntas-criticas", label: "Preguntas Críticas", icon: ListChecks },
  { to: "/comentarios", label: "Comentarios", icon: MessageSquareQuote },
  { to: "/fortalezas-oportunidades", label: "Fortalezas vs Oportunidades", icon: Scale },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const mostrarPanel = pathname !== "/comentarios";
  const actual = nav.find((n) => n.to === pathname);

  return (
    <div className="min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy text-primary-foreground lg:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold">
            M
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Maquinarias</p>
            <p className="truncate text-[0.7rem] opacity-65">Evaluación de red 2026</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary-foreground/75 transition-colors duration-200 hover:bg-navy-deep hover:text-primary-foreground"
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "bg-navy-deep !text-primary-foreground font-medium shadow-[inset_3px_0_0_0_var(--primary)]",
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        <p className="px-6 py-5 text-[0.7rem] leading-relaxed opacity-55">
          Datos de demostración con fines ilustrativos.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:flex sm:justify-between">
            <div className="min-w-0">
              <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Dashboard institucional
              </p>
              <h1 className="truncate text-base font-semibold sm:text-lg">
                {actual?.label ?? "Panel Ejecutivo"}
              </h1>
            </div>
            <SelectorLocal />
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-navy !text-primary-foreground font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <div
          className={cn(
            "mx-auto flex max-w-[100rem] flex-col gap-6 px-5 py-7",
            mostrarPanel && "2xl:flex-row",
          )}
        >
          <main className="min-w-0 flex-1">{children}</main>
          {mostrarPanel && (
            <div className="w-full 2xl:w-[22rem] 2xl:shrink-0">
              <PanelComentarios className="2xl:sticky 2xl:top-28" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
