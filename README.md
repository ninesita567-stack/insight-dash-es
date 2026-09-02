# Lovable Insights

Crea una aplicación web de dashboard institucional, inspirada en un reporte de Power BI pero con una experiencia más fluida, moderna y sin saturación visual. Todo el contenido de interfaz debe estar en español.

Objetivo: exploración intuitiva de datos para escritorio y tablet, con pantalla inicial minimalista y componentes que se expanden o se desglosan al hacer clic.

Secciones/navegación:
1. Inicio / Panel Ejecutivo: KPIs principales: Puntaje Global, Evaluaciones, Mejor Evaluación, Peor Evaluación e Indicadores Críticos. Usa tarjetas limpias, microanimaciones y posibilidad de clic para ver desglose o detalle.
2. Benchmark y Ranking: comparativa “Maquinarias vs Competencia” y ranking de locales. Emplea barras dinámicas y colores tipo semáforo con una leyenda clara.
3. Mapa de Calor: tabla o grilla interactiva de locales por indicadores. Al pasar el cursor, muestra un tooltip con detalle del local e indicador. Permite seleccionar un local.
4. Preguntas Críticas: acordeón/lista desplegable con preguntas de menor cumplimiento y sus porcentajes, con filtro o selección por local cuando sea útil.
5. Comentarios del Evaluador: panel lateral contextual que se actualice según el local seleccionado. Incluye resumen, recomendaciones y observaciones.
6. Fortalezas vs Oportunidades: tabla comparativa con íconos y colores corporativos.

Datos: usa datos de demostración plausibles para locales, indicadores, evaluaciones, preguntas y comentarios. Deja claro visualmente qué local está seleccionado y conecta los componentes cuando sea posible.

Estilo visual: rojo #E60000, azul oscuro #1A2A4F, gris claro #F5F5F5, tipografía Segoe UI o Roboto, amplio espacio en blanco, tarjetas con bordes y sombras sutiles, transiciones suaves. No recargar la pantalla. Diseño responsive para escritorio y tablet. Incluye estados interactivos y una navegación intuitiva. Implementa una experiencia pulida y funcional.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://insight-dash-es.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57f50fc3-82d2-4417-9f26-f26f2073bf2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
