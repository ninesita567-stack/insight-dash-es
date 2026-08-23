export type IndicadorId =
  | "limpieza"
  | "atencion"
  | "exhibicion"
  | "inventario"
  | "seguridad"
  | "postventa";

export const indicadores: { id: IndicadorId; nombre: string; abrev: string }[] = [
  { id: "limpieza", nombre: "Limpieza e Imagen", abrev: "Limpieza" },
  { id: "atencion", nombre: "Atención al Cliente", abrev: "Atención" },
  { id: "exhibicion", nombre: "Exhibición de Producto", abrev: "Exhibición" },
  { id: "inventario", nombre: "Control de Inventario", abrev: "Inventario" },
  { id: "seguridad", nombre: "Seguridad y Orden", abrev: "Seguridad" },
  { id: "postventa", nombre: "Servicio Postventa", abrev: "Postventa" },
];

export type Local = {
  id: string;
  nombre: string;
  ciudad: string;
  zona: string;
  evaluaciones: number;
  puntajes: Record<IndicadorId, number>;
};

export const locales: Local[] = [
  {
    id: "l-01",
    nombre: "Maquinarias Centro",
    ciudad: "Santiago",
    zona: "Metropolitana",
    evaluaciones: 12,
    puntajes: {
      limpieza: 94,
      atencion: 91,
      exhibicion: 88,
      inventario: 85,
      seguridad: 92,
      postventa: 89,
    },
  },
  {
    id: "l-02",
    nombre: "Maquinarias Providencia",
    ciudad: "Santiago",
    zona: "Metropolitana",
    evaluaciones: 11,
    puntajes: {
      limpieza: 89,
      atencion: 86,
      exhibicion: 82,
      inventario: 78,
      seguridad: 88,
      postventa: 84,
    },
  },
  {
    id: "l-03",
    nombre: "Maquinarias Maipú",
    ciudad: "Santiago",
    zona: "Metropolitana",
    evaluaciones: 10,
    puntajes: {
      limpieza: 78,
      atencion: 74,
      exhibicion: 71,
      inventario: 68,
      seguridad: 80,
      postventa: 72,
    },
  },
  {
    id: "l-04",
    nombre: "Maquinarias Viña del Mar",
    ciudad: "Viña del Mar",
    zona: "Costa",
    evaluaciones: 9,
    puntajes: {
      limpieza: 84,
      atencion: 80,
      exhibicion: 77,
      inventario: 74,
      seguridad: 83,
      postventa: 79,
    },
  },
  {
    id: "l-05",
    nombre: "Maquinarias Concepción",
    ciudad: "Concepción",
    zona: "Sur",
    evaluaciones: 8,
    puntajes: {
      limpieza: 72,
      atencion: 66,
      exhibicion: 61,
      inventario: 58,
      seguridad: 70,
      postventa: 63,
    },
  },
  {
    id: "l-06",
    nombre: "Maquinarias Temuco",
    ciudad: "Temuco",
    zona: "Sur",
    evaluaciones: 7,
    puntajes: {
      limpieza: 66,
      atencion: 58,
      exhibicion: 54,
      inventario: 49,
      seguridad: 64,
      postventa: 55,
    },
  },
  {
    id: "l-07",
    nombre: "Maquinarias Antofagasta",
    ciudad: "Antofagasta",
    zona: "Norte",
    evaluaciones: 9,
    puntajes: {
      limpieza: 87,
      atencion: 83,
      exhibicion: 79,
      inventario: 81,
      seguridad: 86,
      postventa: 82,
    },
  },
  {
    id: "l-08",
    nombre: "Maquinarias La Serena",
    ciudad: "La Serena",
    zona: "Norte",
    evaluaciones: 8,
    puntajes: {
      limpieza: 80,
      atencion: 76,
      exhibicion: 73,
      inventario: 70,
      seguridad: 78,
      postventa: 75,
    },
  },
];

export function promedioLocal(local: Local) {
  const vals = indicadores.map((i) => local.puntajes[i.id]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export const ranking = [...locales].sort((a, b) => promedioLocal(b) - promedioLocal(a));

export const puntajeGlobal = Math.round(
  locales.reduce((acc, l) => acc + promedioLocal(l), 0) / locales.length,
);

export const totalEvaluaciones = locales.reduce((acc, l) => acc + l.evaluaciones, 0);

export const mejorLocal = ranking[0]!;
export const peorLocal = ranking[ranking.length - 1]!;

export const UMBRAL_CRITICO = 65;

export function indicadoresCriticos() {
  const out: { local: Local; indicadorId: IndicadorId; valor: number }[] = [];
  for (const local of locales) {
    for (const ind of indicadores) {
      const valor = local.puntajes[ind.id];
      if (valor < UMBRAL_CRITICO) out.push({ local, indicadorId: ind.id, valor });
    }
  }
  return out.sort((a, b) => a.valor - b.valor);
}

export function nivel(valor: number): "alto" | "medio" | "bajo" {
  if (valor >= 85) return "alto";
  if (valor >= 70) return "medio";
  return "bajo";
}

export const nivelEtiqueta: Record<"alto" | "medio" | "bajo", string> = {
  alto: "Cumplimiento óptimo (≥ 85)",
  medio: "En observación (70 – 84)",
  bajo: "Crítico (< 70)",
};

export const benchmark: { indicadorId: IndicadorId; maquinarias: number; competencia: number }[] =
  indicadores.map((ind) => {
    const maquinarias = Math.round(
      locales.reduce((a, l) => a + l.puntajes[ind.id], 0) / locales.length,
    );
    const ajustes: Record<IndicadorId, number> = {
      limpieza: -5,
      atencion: 3,
      exhibicion: 6,
      inventario: -2,
      seguridad: -7,
      postventa: 4,
    };
    return { indicadorId: ind.id, maquinarias, competencia: maquinarias + ajustes[ind.id] };
  });

export type Pregunta = {
  id: string;
  texto: string;
  indicadorId: IndicadorId;
  cumplimientoGlobal: number;
  cumplimientoPorLocal: Record<string, number>;
};

const textosPreguntas: { id: string; texto: string; indicadorId: IndicadorId; base: number }[] = [
  {
    id: "p1",
    texto: "¿El inventario físico coincide con el registro del sistema?",
    indicadorId: "inventario",
    base: 48,
  },
  {
    id: "p2",
    texto: "¿Se ofrece el plan de mantenimiento preventivo en cada venta?",
    indicadorId: "postventa",
    base: 52,
  },
  {
    id: "p3",
    texto: "¿Las máquinas en exhibición cuentan con ficha técnica y precio visible?",
    indicadorId: "exhibicion",
    base: 56,
  },
  {
    id: "p4",
    texto: "¿El asesor realiza demostración funcional del equipo al cliente?",
    indicadorId: "atencion",
    base: 59,
  },
  {
    id: "p5",
    texto: "¿Se registra el seguimiento postventa dentro de las 48 horas?",
    indicadorId: "postventa",
    base: 61,
  },
  {
    id: "p6",
    texto: "¿Las zonas de carga están señalizadas y libres de obstáculos?",
    indicadorId: "seguridad",
    base: 64,
  },
  {
    id: "p7",
    texto: "¿La sala de ventas se encuentra libre de embalajes y residuos?",
    indicadorId: "limpieza",
    base: 68,
  },
  {
    id: "p8",
    texto: "¿El personal utiliza uniforme e identificación corporativa completa?",
    indicadorId: "limpieza",
    base: 71,
  },
];

export const preguntas: Pregunta[] = textosPreguntas.map((p) => ({
  id: p.id,
  texto: p.texto,
  indicadorId: p.indicadorId,
  cumplimientoGlobal: p.base,
  cumplimientoPorLocal: Object.fromEntries(
    locales.map((l) => {
      const delta = Math.round((l.puntajes[p.indicadorId] - 75) * 0.6);
      return [l.id, Math.max(18, Math.min(97, p.base + delta))];
    }),
  ),
}));

export type Comentario = {
  resumen: string;
  recomendaciones: string[];
  observaciones: string[];
  evaluador: string;
  fecha: string;
};

export const comentarios: Record<string, Comentario> = {
  "l-01": {
    evaluador: "C. Herrera",
    fecha: "12 ago 2026",
    resumen:
      "Local referente de la cadena. Operación ordenada, equipo comercial alineado al protocolo y sala de ventas impecable.",
    recomendaciones: [
      "Documentar su protocolo de recepción como estándar para el resto de la red.",
      "Reforzar el cierre de inventario semanal para sostener el puntaje.",
    ],
    observaciones: [
      "Dos equipos de exhibición sin ficha técnica actualizada.",
      "Bodega con alta rotación, requiere reordenamiento al cierre.",
    ],
  },
  "l-02": {
    evaluador: "M. Salinas",
    fecha: "10 ago 2026",
    resumen:
      "Buen desempeño general con oportunidades claras en control de inventario y exhibición de temporada.",
    recomendaciones: [
      "Realizar conteo cíclico de repuestos dos veces por semana.",
      "Actualizar la vitrina principal con la línea de alto margen.",
    ],
    observaciones: ["Diferencias menores entre stock físico y sistema en repuestos."],
  },
  "l-03": {
    evaluador: "M. Salinas",
    fecha: "09 ago 2026",
    resumen:
      "Desempeño intermedio. La atención comercial es correcta, pero la demostración de equipos no es sistemática.",
    recomendaciones: [
      "Capacitación práctica de demostración funcional para todo el equipo.",
      "Asignar responsable de exhibición por turno.",
    ],
    observaciones: [
      "Tiempo de espera del cliente superior a 8 minutos en hora punta.",
      "Precios no visibles en tres equipos.",
    ],
  },
  "l-04": {
    evaluador: "R. Bustos",
    fecha: "08 ago 2026",
    resumen:
      "Local estable, con fortalezas en limpieza y seguridad. El seguimiento postventa es su principal brecha.",
    recomendaciones: [
      "Implementar recordatorio automático de contacto a 48 horas.",
      "Revisar carga de trabajo del asesor postventa.",
    ],
    observaciones: ["Registro postventa incompleto en 4 de 10 casos revisados."],
  },
  "l-05": {
    evaluador: "R. Bustos",
    fecha: "07 ago 2026",
    resumen:
      "Resultados bajo la meta de la red. Se detectan brechas simultáneas en inventario, exhibición y postventa.",
    recomendaciones: [
      "Plan de acción a 30 días con seguimiento semanal de la jefatura zonal.",
      "Auditoría completa de inventario con apoyo de casa matriz.",
    ],
    observaciones: [
      "Equipos de exhibición sin limpieza previa a la apertura.",
      "Falta de señalización en zona de carga.",
    ],
  },
  "l-06": {
    evaluador: "C. Herrera",
    fecha: "06 ago 2026",
    resumen:
      "Local con el desempeño más bajo de la red. Requiere intervención directa y acompañamiento operativo.",
    recomendaciones: [
      "Intervención operativa presencial durante dos semanas.",
      "Reinducción completa en protocolo de atención y control de stock.",
    ],
    observaciones: [
      "Inventario con diferencias relevantes en líneas principales.",
      "Sala de ventas con embalajes en piso durante la visita.",
    ],
  },
  "l-07": {
    evaluador: "P. Núñez",
    fecha: "11 ago 2026",
    resumen:
      "Operación sólida y consistente. Destaca el control de inventario, por sobre el promedio de la red.",
    recomendaciones: [
      "Compartir su rutina de conteo con locales de zona Sur.",
      "Ampliar la demostración funcional a la línea industrial.",
    ],
    observaciones: ["Exhibición de accesorios con espacio de mejora."],
  },
  "l-08": {
    evaluador: "P. Núñez",
    fecha: "10 ago 2026",
    resumen:
      "Desempeño intermedio con tendencia positiva respecto de la evaluación anterior (+4 puntos).",
    recomendaciones: [
      "Mantener el plan de orden en bodega, ya muestra resultados.",
      "Reforzar oferta de plan de mantenimiento en cada venta.",
    ],
    observaciones: ["Plan de mantenimiento ofrecido solo en la mitad de las ventas observadas."],
  },
};

export type ComparativaItem = {
  tema: string;
  fortaleza: string;
  oportunidad: string;
  impacto: "Alto" | "Medio" | "Bajo";
};

export const fortalezasOportunidades: ComparativaItem[] = [
  {
    tema: "Imagen de sala",
    fortaleza: "Estándar de limpieza cumplido en 7 de 8 locales.",
    oportunidad: "Embalajes en piso durante horario de atención en zona Sur.",
    impacto: "Medio",
  },
  {
    tema: "Atención comercial",
    fortaleza: "Recepción y saludo protocolar consolidados en la red.",
    oportunidad: "La demostración funcional no es sistemática.",
    impacto: "Alto",
  },
  {
    tema: "Control de inventario",
    fortaleza: "Zona Norte con conteo cíclico consolidado.",
    oportunidad: "Diferencias entre stock físico y sistema en repuestos.",
    impacto: "Alto",
  },
  {
    tema: "Exhibición",
    fortaleza: "Vitrinas principales alineadas al layout corporativo.",
    oportunidad: "Fichas técnicas y precios ausentes en equipos de piso.",
    impacto: "Medio",
  },
  {
    tema: "Seguridad y orden",
    fortaleza: "Señalización de emergencia vigente en toda la red.",
    oportunidad: "Zonas de carga sin demarcación en dos locales.",
    impacto: "Medio",
  },
  {
    tema: "Postventa",
    fortaleza: "Registro digital de casos adoptado por todos los locales.",
    oportunidad: "Seguimiento a 48 horas incumplido en la mitad de los casos.",
    impacto: "Alto",
  },
];
