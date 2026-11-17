import {
  phases, lanes, cmsOptions, hostOptions, cmsCost, hostCost, webflowCost,
  type CmsId, type HostId, type Route, type Option,
} from '../data/stack';

interface State {
  route: Route;
  cms: CmsId;
  host: HostId;
  editors: number;
  editorRoles: boolean;
  serverFunctions: boolean;
  hostSeats: number;
  why: string;
}

const state: State = {
  route: 'composable', cms: 'keystatic', host: 'cloudflare',
  editors: 2, editorRoles: false, serverFunctions: false, hostSeats: 1, why: '',
};

const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(document.querySelectorAll<T>(sel));
const money = (n: number | null) => (n === null ? 'A medida' : `US$${n.toLocaleString('es-AR')}`);

// ---------- Recomendador ----------
const recForm = $<HTMLFormElement>('#recommender');

function recommend() {
  const data = new FormData(recForm);
  const prioridad = data.get('prioridad');
  const editores = data.get('editores');
  const idiomas = data.get('idiomas');
  const hosting = data.get('hosting');

  state.route = prioridad === 'velocidad' ? 'webflow' : 'composable';
  state.host = hosting === 'vercel' ? 'vercel' : 'cloudflare';
  state.editors = editores === 'pocos' ? 2 : editores === 'marketing' ? 6 : 8;

  const reasons: string[] = [];
  if (editores === 'marketing') {
    state.cms = 'storyblok';
    reasons.push('Un equipo de marketing que edita seguido aprovecha el editor visual de Storyblok.');
  } else if (editores === 'canales') {
    state.cms = 'sanity';
    reasons.push('El contenido estructurado de Sanity se reutiliza en otros canales por API.');
  } else if (idiomas === 'varios') {
    state.cms = 'sanity';
    reasons.push('Con pocos editores y varios idiomas, Sanity no cobra extra por idioma y su plan gratis alcanza.');
  } else {
    state.cms = 'keystatic';
    reasons.push('Pocos editores y un idioma: Keystatic guarda todo en el repo y no tiene costo.');
  }
  reasons.push(state.host === 'vercel'
    ? 'Vercel porque el cliente ya lo usa; para clientes corresponde el plan Pro.'
    : 'Cloudflare porque sirve sitios estáticos gratis, también para uso comercial.');

  state.why = state.route === 'webflow'
    ? 'Si la prioridad es lanzar rápido y editar visualmente, Webflow resuelve diseño, CMS y hosting en una plataforma. El mapa muestra sus herramientas.'
    : reasons.join(' ');
  render();
}

recForm.addEventListener('change', recommend);

// ---------- Mapa ----------
function paintMap() {
  document.body.classList.toggle('route-webflow', state.route === 'webflow');
  document.body.classList.toggle('route-composable', state.route === 'composable');
  $$<HTMLButtonElement>('[data-cms].opt').forEach((b) => {
    const on = b.dataset.cms === state.cms;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  $$<HTMLButtonElement>('[data-host].opt').forEach((b) => {
    const on = b.dataset.host === state.host;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  $$('[data-col-cms]').forEach((el) => el.classList.toggle('hl', el.dataset.colCms === state.cms));
  $$('[data-col-host]').forEach((el) => el.classList.toggle('hl', el.dataset.colHost === state.host));
  $$('[data-col-route]').forEach((el) => el.classList.toggle('hl', el.dataset.colRoute === state.route));
}

// ---------- Drawer ----------
const drawer = $<HTMLDialogElement>('#drawer');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

function openPhase(id: string) {
  const i = phases.findIndex((p) => p.id === id);
  const p = phases[i];
  $('#d-kicker').textContent = `Fase ${i + 1} de ${phases.length}`;
  $('#d-title').textContent = p.name;
  const tools = p.tools[state.route];
  $('#d-body').innerHTML = `
    ${p.detail.map((d) => `<p class="mb-4">${esc(d)}</p>`).join('')}
    <dl class="mt-6 grid gap-4 border-t border-line pt-6">
      ${lanes.map((l) => `<div><dt class="text-sm text-muted">${l.name}</dt><dd>${esc(p.tasks[l.id])}</dd></div>`).join('')}
      ${p.gate ? `<div><dt class="text-sm text-muted">Aprobación del cliente</dt><dd class="text-green-l">${esc(p.gate)}</dd></div>` : ''}
      <div><dt class="text-sm text-muted">Entregable</dt><dd>${esc(p.deliverable)}</dd></div>
      ${tools.length ? `<div><dt class="text-sm text-muted">Herramientas</dt><dd class="mt-1 flex flex-wrap gap-1.5">${tools.map((t) => `<span class="tool">${esc(t)}</span>`).join('')}</dd></div>` : ''}
    </dl>`;
  drawer.showModal();
}

function openOption(kind: string, o: Option) {
  $('#d-kicker').textContent = kind;
  $('#d-title').textContent = o.name;
  $('#d-body').innerHTML = `
    <p class="mb-4">${esc(o.tagline)}. Ideal para: ${esc(o.idealFor.toLowerCase())}.</p>
    <dl class="mt-6 grid gap-4 border-t border-line pt-6">
      <div><dt class="text-sm text-muted">A favor</dt><dd><ul class="mt-1 list-disc pl-5">${o.pros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></dd></div>
      <div><dt class="text-sm text-muted">En contra</dt><dd><ul class="mt-1 list-disc pl-5">${o.cons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></dd></div>
      <div><dt class="text-sm text-muted">Precio</dt><dd>${esc(o.price)}</dd></div>
    </dl>
    <p class="mt-6 text-sm text-muted">Quedó seleccionado en el mapa y en la calculadora.</p>`;
  drawer.showModal();
}

$$<HTMLButtonElement>('button[data-phase]').forEach((b) => b.addEventListener('click', () => openPhase(b.dataset.phase!)));
$$<HTMLButtonElement>('.opt[data-cms]').forEach((b) => b.addEventListener('click', () => {
  state.cms = b.dataset.cms as CmsId; render(); openOption('CMS', cmsOptions[state.cms]);
}));
$$<HTMLButtonElement>('.opt[data-host]').forEach((b) => b.addEventListener('click', () => {
  state.host = b.dataset.host as HostId; render(); openOption('Hosting', hostOptions[state.host]);
}));
$('#d-close').addEventListener('click', () => drawer.close());
drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); });

// ---------- Tabs ----------
const tabs = $$<HTMLButtonElement>('[role="tab"]');
tabs.forEach((t) => t.addEventListener('click', () => {
  tabs.forEach((x) => {
    const on = x === t;
    x.setAttribute('aria-selected', String(on));
    $(`#${x.getAttribute('aria-controls')}`).hidden = !on;
  });
}));

// ---------- Calculadora ----------
const calc = $<HTMLFormElement>('#calc');

calc.addEventListener('input', () => {
  const d = new FormData(calc);
  state.cms = d.get('cms') as CmsId;
  state.host = d.get('host') as HostId;
  state.editors = Number(d.get('editors'));
  state.editorRoles = d.has('editorRoles');
  state.serverFunctions = d.has('serverFunctions');
  state.hostSeats = Number(d.get('hostSeats'));
  render();
});

function paintCalc() {
  (calc.elements.namedItem('cms') as HTMLSelectElement).value = state.cms;
  (calc.elements.namedItem('host') as HTMLSelectElement).value = state.host;
  (calc.elements.namedItem('editors') as HTMLInputElement).value = String(state.editors);
  $('#editors-out').textContent = String(state.editors);
  $('#seats-out').textContent = String(state.hostSeats);
  $('#seats-wrap').hidden = state.host !== 'vercel';

  const lines = state.route === 'webflow'
    ? [webflowCost(state.editors)]
    : [cmsCost(state.cms, state.editors, state.editorRoles), hostCost(state.host, state.serverFunctions, state.hostSeats)];
  const unknown = lines.some((l) => l.amount === null);
  const total = lines.reduce((s, l) => s + (l.amount ?? 0), 0);
  const totalText = unknown ? `${money(total)} + a medida` : money(total);
  $('#c-total').textContent = totalText;
  $('#r-cost').textContent = `${totalText} por mes`;
  $('#c-lines').innerHTML = lines.map((l) => `
    <div class="flex items-baseline justify-between gap-4">
      <dt><span class="font-medium">${esc(l.label)}</span><span class="block text-sm text-muted">${esc(l.note)}</span></dt>
      <dd class="whitespace-nowrap font-medium">${money(l.amount)}</dd>
    </div>`).join('');

  const host = hostCost(state.host, state.serverFunctions, state.hostSeats).amount ?? 0;
  const rows = (Object.keys(cmsOptions) as CmsId[]).map((id) => {
    const c = cmsCost(id, state.editors, state.editorRoles);
    return { name: cmsOptions[id].name, amount: c.amount === null ? null : c.amount + host, pick: state.route === 'composable' && id === state.cms };
  });
  const wf = webflowCost(state.editors);
  rows.push({ name: 'Webflow', amount: wf.amount, pick: state.route === 'webflow' });
  const max = Math.max(1, ...rows.map((r) => r.amount ?? 0));
  $('#c-bars').innerHTML = rows.map((r) => `
    <div>
      <div class="flex justify-between text-sm"><span class="${r.pick ? 'text-ink' : 'text-muted'}">${esc(r.name)}${r.name !== 'Webflow' ? ` + ${esc(hostOptions[state.host].name)}` : ''}</span><span>${money(r.amount)}</span></div>
      <div class="mt-1.5 h-2.5 rounded-full bg-deep"><div class="bar ${r.pick ? 'pick' : ''}" style="width:${r.amount === null ? 100 : Math.max(2, (r.amount / max) * 100)}%"></div></div>
    </div>`).join('');
}

// ---------- Render ----------
function render() {
  $('#r-route').textContent = state.route === 'webflow' ? 'Webflow' : 'Composable';
  $('#r-cms').textContent = cmsOptions[state.cms].name;
  $('#r-host').textContent = hostOptions[state.host].name;
  $('#r-why').textContent = state.why;
  paintMap();
  paintCalc();
}

recommend();
