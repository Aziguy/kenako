/**
 * B4 — Menu & catalogue
 * Catégories réordonnables par glisser-déposer, bascule rupture en un clic,
 * allergènes réglementaires, disponibilité horaire, duplication, import/export.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number } from '../../core/format.js';
import { ALLERGENS_14 } from '../../data/menus.js';

export function view(ctx) {
  const { state } = ctx;
  const cats = state.categories;
  const all = cats.flatMap((c) => c.items);
  const outOfStock = all.filter((i) => !i.stock);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Carte</h1>
          <p class="bo-sub">${number(cats.length)} catégories · ${number(all.length)} plats · ${number(outOfStock.length)} en rupture</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <button type="button" class="btn btn--outline btn--sm" data-act="export-menu">${raw(icon('download', { size: 16 }))} Exporter</button>
          <button type="button" class="btn btn--outline btn--sm" data-act="import-menu">Importer</button>
          <button type="button" class="btn btn--primary btn--sm" data-act="new-dish">${raw(icon('plus', { size: 16 }))} Nouveau plat</button>
        </div>
      </div>

      ${outOfStock.length
        ? html`<div class="banner banner--warning">
            <span class="banner__icon" aria-hidden="true">!</span>
            <span><strong class="banner__title">${number(outOfStock.length)} plat(s) en rupture</strong>
            ${outOfStock.map((i) => i.name).join(', ')} — masqués côté client tant que la rupture est active.</span>
          </div>`
        : ''}

      <div class="filter-bar">
        <label class="input-group" style="flex:1;max-width:320px">
          <span class="sr-only">Rechercher un plat</span>
          <span class="input-group__icon">${raw(icon('search', { size: 16 }))}</span>
          <input class="input" type="search" placeholder="Rechercher un plat" data-bind="menuQuery" value="${state.menuQuery || ''}">
        </label>
        <button type="button" class="chip" data-act="menu-filter" data-id="out" aria-pressed="${state.menuFilter === 'out'}">Ruptures</button>
        <button type="button" class="chip" data-act="menu-filter" data-id="options" aria-pressed="${state.menuFilter === 'options'}">Avec options</button>
        <span class="spacer"></span>
        <span class="tiny dim">${raw(icon('drag', { size: 14 }))} Glissez une ligne pour réordonner</span>
      </div>

      <div class="stack" style="gap:var(--sp-5)">
        ${cats.map((cat) => {
          const items = filterItems(cat.items, state);
          if (!items.length && (state.menuQuery || state.menuFilter)) return '';
          return html`
            <section class="menu-cat">
              <header class="between">
                <div class="row">
                  <h2 class="card__title">${cat.name}</h2>
                  <span class="badge badge--outline">${number(cat.items.length)}</span>
                </div>
                <div class="row" style="gap:var(--sp-1)">
                  <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="move-cat" data-id="${cat.id}" data-dir="-1"
                    aria-label="Monter ${cat.name}">▲</button>
                  <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="move-cat" data-id="${cat.id}" data-dir="1"
                    aria-label="Descendre ${cat.name}">▼</button>
                  <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="edit-cat" data-id="${cat.id}"
                    aria-label="Modifier ${cat.name}">${raw(icon('edit', { size: 15 }))}</button>
                </div>
              </header>

              <div class="stack-sm" data-cat="${cat.id}">
                ${items.map(
                  (item) => html`
                  <article class="menu-row ${item.stock ? '' : 'is-out'}" draggable="true"
                    data-item="${item.id}" data-cat="${cat.id}">
                    <span class="menu-row__grip" aria-hidden="true">${raw(icon('drag', { size: 16 }))}</span>
                    <div style="min-width:0;display:grid;gap:3px">
                      <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
                        <strong class="truncate">${item.name}</strong>
                        ${item.tags.map((t) => html`<span class="badge badge--success">${t}</span>`)}
                        ${item.options ? html`<span class="badge badge--outline">${item.options}</span>` : ''}
                        ${item.stock ? '' : html`<span class="badge badge--danger">✕ Rupture</span>`}
                      </div>
                      <p class="tiny dim truncate">${item.desc}</p>
                      <p class="tiny dim">
                        ${raw(icon('clock', { size: 12 }))} ${item.schedule}
                        ${item.allergens.length ? html` · Allergènes : ${item.allergens.join(', ')}` : ''}
                      </p>
                    </div>
                    <div class="row" style="gap:var(--sp-2)">
                      <strong class="num">${money(item.price)}</strong>
                      <button type="button" class="btn btn--ghost btn--icon btn--sm hint" data-hint="${item.stock ? 'Mettre en rupture' : 'Remettre en vente'}"
                        data-act="toggle-stock" data-id="${item.id}" aria-label="${item.stock ? 'Mettre en rupture' : 'Remettre en vente'}">
                        ${raw(icon(item.stock ? 'check' : 'x', { size: 16 }))}
                      </button>
                      <button type="button" class="btn btn--ghost btn--icon btn--sm hint" data-hint="Dupliquer"
                        data-act="duplicate-dish" data-id="${item.id}" aria-label="Dupliquer ${item.name}">
                        ${raw(icon('copy', { size: 16 }))}
                      </button>
                      <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="edit-dish" data-id="${item.id}"
                        aria-label="Modifier ${item.name}">${raw(icon('edit', { size: 16 }))}</button>
                      <button type="button" class="btn btn--ghost btn--icon btn--sm hint" data-hint="Supprimer"
                        data-act="delete-dish" data-id="${item.id}" aria-label="Supprimer ${item.name}">
                        ${raw(icon('trash', { size: 16 }))}
                      </button>
                    </div>
                  </article>`
                )}
              </div>
            </section>`;
        })}
      </div>

      <section class="card card--pad stack-sm">
        <h2 class="card__title">Allergènes réglementaires</h2>
        <p class="tiny dim">Les 14 allergènes à déclaration obligatoire (règlement UE 1169/2011). Chaque plat doit être renseigné.</p>
        <div class="row-wrap">
          ${ALLERGENS_14.map((a) => html`<span class="badge badge--outline badge--lg">${a}</span>`)}
        </div>
      </section>
    </div>`;
}

function filterItems(items, state) {
  const q = (state.menuQuery || '').toLowerCase();
  return items.filter((i) => {
    if (q && !`${i.name} ${i.desc}`.toLowerCase().includes(q)) return false;
    if (state.menuFilter === 'out' && i.stock) return false;
    if (state.menuFilter === 'options' && !i.options) return false;
    return true;
  });
}

/** Formulaire d'édition d'un plat, affiché en feuille. */
export function dishForm(item) {
  const value = item || { name: '', price: '', desc: '', tags: [], allergens: [], schedule: 'Toute la journée' };
  return `
    <div class="stack">
      <label class="field"><span class="field__label">Nom du plat</span>
        <input class="input" value="${escapeAttr(value.name)}" placeholder="Bavette d’aloyau, frites maison"></label>
      <div class="grid grid--2" style="gap:var(--sp-3)">
        <label class="field"><span class="field__label">Prix</span>
          <input class="input num" inputmode="decimal" value="${value.price}" placeholder="19,00"></label>
        <label class="field"><span class="field__label">Disponibilité</span>
          <select class="select">
            <option${value.schedule === 'Toute la journée' ? ' selected' : ''}>Toute la journée</option>
            <option${value.schedule === 'Midi uniquement' ? ' selected' : ''}>Midi uniquement</option>
            <option${value.schedule === 'Soir uniquement' ? ' selected' : ''}>Soir uniquement</option>
          </select></label>
      </div>
      <label class="field"><span class="field__label">Description</span>
        <textarea class="textarea" rows="3" placeholder="Bœuf de race Limousine, échalotes confites…">${escapeAttr(value.desc)}</textarea></label>
      <div class="field">
        <span class="field__label">Régimes</span>
        <div class="row-wrap">
          ${['Végétarien', 'Végan', 'Halal', 'Sans gluten']
            .map((t) => `<button type="button" class="chip" aria-pressed="${value.tags?.includes(t)}">${t}</button>`)
            .join('')}
        </div>
      </div>
      <div class="field">
        <span class="field__label">Allergènes</span>
        <div class="row-wrap">
          ${ALLERGENS_14.map((a) => `<button type="button" class="chip" aria-pressed="${value.allergens?.includes(a)}">${a}</button>`).join('')}
        </div>
      </div>
      <div class="field">
        <span class="field__label">Groupes d’options</span>
        <p class="field__hint">Taille, cuisson, suppléments — avec règles minimum / maximum et obligation.</p>
        <button type="button" class="btn btn--outline btn--block btn--sm">${icon('plus', { size: 15 })} Ajouter un groupe d’options</button>
      </div>
    </div>`;
}

const escapeAttr = (s = '') => String(s).replace(/"/g, '&quot;');

/**
 * Réordonnancement des plats par glisser-déposer.
 * Les écouteurs sont reposés à chaque rendu : le DOM est reconstruit à neuf.
 */
export function mount(ctx) {
  let dragged = null;

  document.querySelectorAll('.menu-row[draggable="true"]').forEach((row) => {
    row.addEventListener('dragstart', (e) => {
      dragged = row.dataset.item;
      row.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragged);
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('is-dragging');
      document.querySelectorAll('.menu-row.is-over').forEach((r) => r.classList.remove('is-over'));
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (row.dataset.item !== dragged) row.classList.add('is-over');
    });
    row.addEventListener('dragleave', () => row.classList.remove('is-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('is-over');
      const from = dragged || e.dataTransfer.getData('text/plain');
      ctx.onReorderDish?.(from, row.dataset.item);
      dragged = null;
    });
  });
}
