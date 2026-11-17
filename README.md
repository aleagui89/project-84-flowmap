# Project 84 · Flowmap

Mapa interactivo del stack composable de Polonio: proceso en seis fases, roles de diseño, desarrollo y cliente, comparación de CMS (Keystatic, Sanity, Storyblok) y hosting (Cloudflare, Vercel), y calculadora de costo mensual.

Hecho con Astro + Tailwind CSS y deployado en Vercel. Funciona también como piloto del propio stack.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

Requiere Node 22.

## Dónde se edita

- **Contenido, precios y comparaciones:** `src/data/stack.ts`. Todo el texto del mapa sale de ahí.
- **Página:** `src/pages/index.astro`.
- **Interacción (recomendador, mapa, calculadora):** `src/scripts/app.ts`.
- **Colores y tipografía:** `src/styles/global.css` (tokens del Style Guide de la agencia).

## Deploy

Cada push a `main` se publica en Vercel; cada pull request genera una URL de preview.

> Los precios se relevaron en noviembre de 2026 y cambian seguido: revalidar antes de cotizar a un cliente.
