/**
 * A4 — Personnalisation d'un plat
 * Bottom-sheet sur mobile, modale sur desktop. Le prix se recalcule à chaque
 * choix, et les règles (choix obligatoire, maximum de suppléments) sont
 * appliquées avant l'ajout au panier.
 */

import { esc } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { openModal, getModal, closeModal } from '../../core/sheet.js';
import { findDish, CUSTOMIZATIONS, TAG_LABELS, TAG_TONES } from '../../data/menus.js';
import { getRestaurant } from '../../data/restaurants.js';
import { lineKey, optionsLabel } from '../cart.js';

let draft = null;

export function openDishSheet(ctx, restId, dishId) {
  const dish = findDish(restId, dishId);
  if (!dish) return;
  const restaurant = getRestaurant(restId);
  const config = CUSTOMIZATIONS[dishId] || {};

  // Referme d'abord une éventuelle feuille ouverte : son `onClose` remet le
  // brouillon à zéro, il ne doit donc pas s'exécuter après notre affectation.
  closeModal();

  draft = {
    restId, dishId, dish, restaurant, config,
    size: config.sizes?.[0]?.id ?? null,
    required: config.required ? null : 'none',
    extras: [],
    qty: 1,
    note: '',
    error: '',
  };

  openModal({
    title: `<span class="eyebrow">${esc(dish.cat)}</span><h2 style="font-size:22px">${esc(dish.name)}</h2>`,
    body: body(),
    foot: foot(),
    onAction: (data) => handle(ctx, data),
    onInput: (event) => {
      const el = event.target.closest('[data-field]');
      if (!el) return;
      draft.note = el.value;
    },
    onClose: () => { draft = null; },
  });
}

function unitPrice() {
  const { dish, config, size, required, extras } = draft;
  let price = dish.price;
  if (size) price += config.sizes.find((s) => s.id === size)?.delta ?? 0;
  if (required && required !== 'none') price += config.required.options.find((o) => o.id === required)?.delta ?? 0;
  extras.forEach((id) => { price += config.extras.options.find((o) => o.id === id)?.delta ?? 0; });
  return price;
}

function body() {
  const { dish, restaurant, config, size, required, extras, qty, note, error } = draft;

  const tags = (dish.tags || [])
    .map((t) => `<span class="badge badge--${TAG_TONES[t] || 'outline'}">${esc(TAG_LABELS[t] || t)}</span>`)
    .join('');

  const sizes = config.sizes
    ? `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:var(--sp-2)">
        <legend class="between" style="width:100%;padding:0 0 var(--sp-1)">
          <strong>Taille</strong><span class="tiny dim">Obligatoire</span>
        </legend>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:var(--sp-2)">
          ${config.sizes
            .map(
              (s) => `<button type="button" class="option" role="radio" aria-checked="${s.id === size}" data-act="size" data-id="${s.id}">
                <span class="option__mark">${s.id === size ? icon('check', { size: 12, stroke: 3 }) : ''}</span>
                <span>${esc(s.label)}</span>
                <span class="option__price">${s.delta ? `+ ${money(s.delta)}` : 'inclus'}</span>
              </button>`
            )
            .join('')}
        </div>
      </fieldset>`
    : '';

  const requiredGroup = config.required
    ? `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:var(--sp-2)">
        <legend class="between" style="width:100%;padding:0 0 var(--sp-1)">
          <strong>${esc(config.required.label)}</strong>
          <span class="badge ${required && required !== 'none' ? 'badge--success' : 'badge--warning'}">
            ${required && required !== 'none' ? '✓ Choisi' : '! Obligatoire'}
          </span>
        </legend>
        ${config.required.options
          .map(
            (o) => `<button type="button" class="option" role="radio" aria-checked="${o.id === required}" data-act="required" data-id="${o.id}">
              <span class="option__mark">${o.id === required ? icon('check', { size: 12, stroke: 3 }) : ''}</span>
              <span>${esc(o.label)}</span>
              ${o.delta ? `<span class="option__price">+ ${money(o.delta)}</span>` : ''}
            </button>`
          )
          .join('')}
      </fieldset>`
    : '';

  const extrasGroup = config.extras
    ? `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:var(--sp-2)">
        <legend class="between" style="width:100%;padding:0 0 var(--sp-1)">
          <strong>${esc(config.extras.label)}</strong>
          <span class="tiny dim">${extras.length}/${config.extras.max} · facultatif</span>
        </legend>
        ${config.extras.options
          .map((o) => {
            const on = extras.includes(o.id);
            const full = !on && extras.length >= config.extras.max;
            return `<button type="button" class="option" role="checkbox" aria-checked="${on}"
              data-act="extra" data-id="${o.id}" ${full ? 'aria-disabled="true" style="opacity:.5"' : ''}>
              <span class="option__mark option__mark--box">${on ? icon('check', { size: 12, stroke: 3 }) : ''}</span>
              <span>${esc(o.label)}</span>
              <span class="option__price">+ ${money(o.delta)}</span>
            </button>`;
          })
          .join('')}
      </fieldset>`
    : '';

  return `
    <div class="stack">
      <div class="thumb" style="--tint:${restaurant.tint};aspect-ratio:16/9"></div>
      <div class="stack-sm">
        <p class="muted" style="line-height:1.55">${esc(dish.desc)}</p>
        <div class="row-wrap">${tags}</div>
        ${dish.allergens?.length ? `<p class="tiny dim">Allergènes : ${esc(dish.allergens.join(', '))}</p>` : ''}
      </div>
      ${sizes}${requiredGroup}${extrasGroup}
      <label class="field">
        <span class="field__label">Un mot pour la cuisine ?</span>
        <textarea class="textarea" rows="2" data-field="note"
          placeholder="Sans oignon, cuisson à cœur, allergie…">${esc(note)}</textarea>
      </label>
      ${error ? `<p class="field__error">${icon('x', { size: 13 })} ${esc(error)}</p>` : ''}
    </div>`;
}

function foot() {
  const { qty, config, required } = draft;
  const total = unitPrice() * qty;
  // Le choix obligatoire manquant désactive le bouton et le dit dans son libellé,
  // plutôt que de laisser cliquer pour afficher une erreur ensuite.
  const missing = config.required && (!required || required === 'none');

  return `
    <div class="row" style="gap:var(--sp-3)">
      <div class="qty">
        <button type="button" class="qty__btn" data-act="qty" data-delta="-1" aria-label="Diminuer la quantité">${icon('minus', { size: 16 })}</button>
        <span class="qty__value">${qty}</span>
        <button type="button" class="qty__btn" data-act="qty" data-delta="1" aria-label="Augmenter la quantité">${icon('plus', { size: 16 })}</button>
      </div>
      <button type="button" class="btn btn--accent" style="flex:1" data-act="add"${missing ? ' disabled' : ''}>
        ${missing
          ? `Choisissez : ${esc(config.required.label.toLowerCase())}`
          : `Ajouter · <span class="num">${money(total)}</span>`}
      </button>
    </div>`;
}

function refresh() {
  getModal()?.update({ body: body(), foot: foot() });
}

function handle(ctx, data) {
  if (!draft) return;
  switch (data.act) {
    case 'size':
      draft.size = data.id; draft.error = ''; refresh(); break;
    case 'required':
      draft.required = data.id; draft.error = ''; refresh(); break;
    case 'extra': {
      const on = draft.extras.includes(data.id);
      if (!on && draft.extras.length >= draft.config.extras.max) return;
      draft.extras = on ? draft.extras.filter((x) => x !== data.id) : [...draft.extras, data.id];
      refresh();
      break;
    }
    case 'qty':
      draft.qty = Math.max(1, Math.min(20, draft.qty + Number(data.delta)));
      refresh();
      break;
    case 'add':
      commit(ctx);
      break;
    default:
      break;
  }
}

function commit(ctx) {
  const { dish, config, size, required, extras, qty, note, restId, dishId } = draft;

  if (config.required && (!required || required === 'none')) {
    draft.error = `Merci de choisir : ${config.required.label.toLowerCase()}.`;
    refresh();
    return;
  }

  const labels = [
    config.sizes?.find((s) => s.id === size)?.label,
    config.required?.options.find((o) => o.id === required)?.label,
    ...extras.map((id) => config.extras.options.find((o) => o.id === id)?.label),
  ];

  ctx.addToCart({
    key: lineKey(dishId, [size, required, ...extras].filter(Boolean)),
    restId,
    dishId,
    name: dish.name,
    unit: unitPrice(),
    qty,
    opts: optionsLabel(labels),
    note,
  });

  closeModal();
}
