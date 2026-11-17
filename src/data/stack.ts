// Contenido del flowmap. Precios relevados en noviembre de 2026: revalidar antes de cotizar.

export type Lane = 'diseno' | 'desarrollo' | 'cliente';
export type CmsId = 'keystatic' | 'sanity' | 'storyblok';
export type HostId = 'cloudflare' | 'vercel';
export type Route = 'composable' | 'webflow';

export const lanes: { id: Lane; name: string; role: string }[] = [
  { id: 'diseno', name: 'Diseño', role: 'Define el sistema' },
  { id: 'desarrollo', name: 'Desarrollo', role: 'Lo convierte en producto' },
  { id: 'cliente', name: 'Cliente', role: 'Valida y opera' },
];

export interface Phase {
  id: string;
  name: string;
  summary: string;
  tasks: Record<Lane, string>;
  gate?: string; // aprobación del cliente que cierra la fase
  deliverable: string;
  tools: Record<Route, string[]>;
  fork?: 'cms' | 'host';
  detail: string[];
}

export const phases: Phase[] = [
  {
    id: 'discovery',
    name: 'Discovery',
    summary: 'Brief, objetivos y elección de stack',
    tasks: {
      diseno: 'Referencias y alcance visual',
      desarrollo: 'Propone stack: Webflow o composable, CMS y hosting',
      cliente: 'Comparte objetivos y equipo editor',
    },
    gate: 'Aprueba el stack',
    deliverable: 'Brief y stack aprobado',
    tools: { composable: ['Notion', 'Este recomendador'], webflow: ['Notion', 'Este recomendador'] },
    detail: [
      'Acá se decide la ruta: Webflow para quien prioriza velocidad y edición visual; composable para rendimiento, propiedad del código y costo bajo.',
      'Dentro de composable se eligen CMS y hosting según quién edita, cuántos idiomas hay y qué presupuesto mensual acepta el cliente.',
    ],
  },
  {
    id: 'diseno',
    name: 'Diseño',
    summary: 'Sistema y pantallas en Figma',
    tasks: {
      diseno: 'UI, variables y componentes con nombres de código',
      desarrollo: 'Valida factibilidad',
      cliente: 'Comenta en Figma',
    },
    gate: 'Aprueba el diseño',
    deliverable: 'Figma con sistema y pantallas aprobadas',
    tools: { composable: ['Figma', 'Dev Mode'], webflow: ['Figma'] },
    detail: [
      'Diseñamos un sistema, no solo pantallas: las variables de Figma (color, tipografía, espaciado) se convierten en tokens de Tailwind.',
      'Los componentes llevan el mismo nombre que tendrán en código, y Claude los lee con el conector de Figma.',
    ],
  },
  {
    id: 'build',
    name: 'Build',
    summary: 'Astro, Tailwind y pull requests',
    tasks: {
      diseno: 'Revisión visual en previews',
      desarrollo: 'Componentes y páginas; ramas y PRs con Claude Code',
      cliente: 'Revisa cada preview por URL',
    },
    deliverable: 'Proyecto Astro con componentes y páginas',
    tools: { composable: ['Astro', 'Tailwind CSS', 'GitHub', 'Claude Code'], webflow: ['Webflow Designer'] },
    detail: [
      'Cada proyecto vive en un repo privado dentro de la organización de GitHub de Polonio, con una rama por tarea y revisión por pull request.',
      'Cada rama genera una URL de preview: el cliente revisa sitios reales, no capturas.',
    ],
  },
  {
    id: 'contenido',
    name: 'Contenido',
    summary: 'CMS y migración',
    tasks: {
      diseno: 'Define qué bloques son editables',
      desarrollo: 'Modela y configura el CMS; migra contenido',
      cliente: 'Carga y mantiene el contenido',
    },
    deliverable: 'CMS configurado y guía de edición',
    tools: { composable: [], webflow: ['Webflow CMS'] },
    fork: 'cms',
    detail: [
      'Es la capa donde el cliente gana autonomía: edita sin tocar código.',
      'La elección de CMS cambia el costo mensual y cuánto desarrollo pide el panel de edición. Compará las tres opciones más abajo.',
    ],
  },
  {
    id: 'launch',
    name: 'QA y launch',
    summary: 'Pruebas, SEO, performance y deploy',
    tasks: {
      diseno: 'QA visual',
      desarrollo: 'Pruebas, SEO, dominio, SSL y deploy',
      cliente: 'Crea su organización de GitHub y cuentas',
    },
    gate: 'Aprueba el go-live',
    deliverable: 'Sitio en producción y repo transferido',
    tools: { composable: ['GitHub Transfer'], webflow: ['Webflow Hosting'] },
    fork: 'host',
    detail: [
      'Antes del lanzamiento el cliente crea su organización de GitHub (gratis) y transferimos el repo con issues, PRs e historial; los links viejos redirigen solos.',
      'Recomendamos que GitHub, hosting y CMS queden a nombre del cliente: es parte de la propuesta de no tener lock-in.',
    ],
  },
  {
    id: 'operacion',
    name: 'Operación',
    summary: 'Soporte, mejoras y nuevas páginas',
    tasks: {
      diseno: 'Nuevas páginas desde el sistema',
      desarrollo: 'Soporte y mejoras como colaborador',
      cliente: 'Edita con autonomía; es dueño de sus cuentas',
    },
    deliverable: 'Sitio vivo y mantenido',
    tools: { composable: ['CMS elegido', 'Deploy automático'], webflow: ['Webflow Editor'] },
    detail: [
      'Cada cambio aprobado en la rama principal se publica solo.',
      'Polonio queda como colaborador del repo si hay contrato de mantenimiento.',
    ],
  },
];

export interface Option {
  id: string;
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  idealFor: string;
  price: string;
}

export const cmsOptions: Record<CmsId, Option> = {
  keystatic: {
    id: 'keystatic',
    name: 'Keystatic',
    tagline: 'Contenido en el repo, sin base de datos',
    pros: ['Costo casi nulo', 'Todo versionado en GitHub', 'Sin lock-in'],
    cons: ['Pocas herramientas para equipos grandes', 'Panel de formularios, sin edición visual'],
    idealFor: 'Sitios institucionales y blogs',
    price: 'Gratis (open source). Cloud Pro desde US$10/mes por equipo + US$5 por usuario extra pasados 3',
  },
  sanity: {
    id: 'sanity',
    name: 'Sanity',
    tagline: 'Studio a medida sobre una base hosteada',
    pros: ['Plan gratis de hasta 20 usuarios', 'Edición visual en todos los planes', 'Idiomas sin costo extra'],
    cons: ['Pide desarrollo para armar el Studio', 'Cobra por usuario en Growth', 'En Free solo hay roles de admin y lector'],
    idealFor: 'Contenido estructurado y reutilizable en varios canales',
    price: 'Free hasta 20 usuarios y 10.000 documentos. Growth US$15 por usuario/mes (hasta 50)',
  },
  storyblok: {
    id: 'storyblok',
    name: 'Storyblok',
    tagline: 'Editor visual sobre la página',
    pros: ['Edición pulida para no técnicos', 'Workflows de equipo', 'Integración con Figma'],
    cons: ['Costo mensual por proyecto', 'Dependencia del proveedor'],
    idealFor: 'Equipos de marketing con varios editores e idiomas',
    price: 'Starter gratis (1 usuario). Growth US$99/mes con 5 usuarios. Growth Plus US$349/mes',
  },
};

export const hostOptions: Record<HostId, Option> = {
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare',
    tagline: 'Default para sitios Astro de contenido',
    pros: ['Estáticos gratis e ilimitados, también comercial', '500 builds por mes gratis', 'Astro es parte de Cloudflare desde enero de 2026'],
    cons: ['US$5/mes si se necesitan funciones de servidor'],
    idealFor: 'Sitios de contenido mayormente estáticos',
    price: 'Gratis para estáticos; US$5/mes con funciones',
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    tagline: 'Cuando el cliente ya lo usa o hay Next.js',
    pros: ['Excelente experiencia de desarrollo', 'Previews por PR', '1 TB de transferencia en Pro'],
    cons: ['El plan Hobby es solo para uso personal no comercial', 'Pro cobra por usuario más consumo'],
    idealFor: 'Clientes en Vercel o apps en Next.js',
    price: 'Pro: US$20 por usuario/mes + consumo',
  },
};

export const webflowVsComposable: { label: string; webflow: string; composable: string }[] = [
  { label: 'Rendimiento (Core Web Vitals)', webflow: '71,3% de sitios aprueban; 26,9% en el top 100k', composable: '71,1% de sitios aprueban; 44,7% en el top 100k' },
  { label: 'Costo', webflow: 'US$25/mes por sitio + asientos de US$39 o US$15', composable: 'Desde US$0 con Cloudflare y Keystatic' },
  { label: 'Contenido', webflow: 'Tope de 20.000 ítems y 40 colecciones', composable: 'Sin tope de plataforma' },
  { label: 'Propiedad', webflow: 'La exportación de código no incluye el CMS', composable: 'Repo propio en el GitHub del cliente' },
  { label: 'IA y herramientas', webflow: 'IA y MCP dentro de su plataforma', composable: 'Claude en el código, skills y conectores' },
  { label: 'Adopción 2024 → 2026', webflow: '59.398 → 60.687 sitios', composable: 'Astro: 8.933 → 49.450 sitios' },
];

// Modelo de costos mensuales en US$, por sitio.
export interface CostInput {
  cms: CmsId;
  host: HostId;
  editors: number;
  editorRoles: boolean; // el cliente necesita rol de editor sin permisos de admin
  serverFunctions: boolean;
  hostSeats: number;
}

export interface CostLine { label: string; amount: number | null; note: string }

export function cmsCost(cms: CmsId, editors: number, editorRoles: boolean): CostLine {
  if (cms === 'keystatic') {
    if (editors <= 3) return { label: 'Keystatic', amount: 0, note: 'Open source; Cloud gratis hasta 3 usuarios' };
    return { label: 'Keystatic Cloud Pro', amount: 10 + 5 * (editors - 3), note: 'US$10 por equipo + US$5 por usuario pasados 3' };
  }
  if (cms === 'sanity') {
    if (!editorRoles && editors <= 20) return { label: 'Sanity Free', amount: 0, note: 'Hasta 20 usuarios, todos como admin' };
    if (editors > 50) return { label: 'Sanity Enterprise', amount: null, note: 'Más de 50 usuarios: precio a medida' };
    return { label: 'Sanity Growth', amount: 15 * editors, note: 'US$15 por usuario; lectores gratis' };
  }
  if (editors <= 1) return { label: 'Storyblok Starter', amount: 0, note: '1 usuario, 2 idiomas' };
  if (editors <= 10) return { label: 'Storyblok Growth', amount: 99 + 15 * Math.max(0, editors - 5), note: '5 usuarios incluidos, US$15 c/u hasta 10' };
  if (editors <= 15) return { label: 'Storyblok Growth Plus', amount: 349, note: '15 usuarios, 10 idiomas' };
  return { label: 'Storyblok Premium', amount: null, note: 'Más de 15 usuarios: precio a medida' };
}

export function hostCost(host: HostId, serverFunctions: boolean, seats: number): CostLine {
  if (host === 'cloudflare') {
    return serverFunctions
      ? { label: 'Cloudflare Workers Paid', amount: 5, note: 'Necesario para funciones de servidor' }
      : { label: 'Cloudflare', amount: 0, note: 'Estáticos gratis, también uso comercial' };
  }
  return { label: 'Vercel Pro', amount: 20 * seats, note: 'US$20 por usuario + consumo (Hobby no aplica a clientes)' };
}

export function webflowCost(editors: number): CostLine {
  return { label: 'Webflow (referencia)', amount: 25 + 15 * editors, note: 'Sitio US$25 + asientos estimados de US$15' };
}

export const sources: { label: string; href: string }[] = [
  { label: 'Project 84 (Discovery) en Notion', href: 'https://app.notion.com/p/41639dc6fcdb8086bd39f41b7bae996c' },
  { label: 'Keystatic', href: 'https://keystatic.com/' },
  { label: 'Sanity pricing', href: 'https://www.sanity.io/pricing' },
  { label: 'Storyblok pricing', href: 'https://www.storyblok.com/pricing' },
  { label: 'Cloudflare Workers pricing', href: 'https://developers.cloudflare.com/workers/platform/pricing/' },
  { label: 'Vercel Hobby plan', href: 'https://vercel.com/docs/plans/hobby' },
  { label: 'Webflow pricing 2026', href: 'https://webflow.com/blog/simplified-plans-and-updated-pricing-2026' },
  { label: 'HTTP Archive: Astro vs Webflow', href: 'https://webyansh.com/post/astro-vs-webflow' },
];

export const surveyedAt = 'noviembre de 2026';
