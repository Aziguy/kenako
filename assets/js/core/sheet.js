/**
 * Kenako — modales & bottom-sheets
 * Le même composant devient une feuille glissée du bas sur mobile et une
 * modale centrée sur desktop (règle imposée par le cahier des charges).
 */

import { trapFocus, delegate } from './dom.js';

let openSheet = null;

/**
 * @param {{title?: string, body: string, foot?: string, wide?: boolean,
 *          onAction?: (dataset, event, el) => void, onClose?: Function,
 *          labelledBy?: string}} config
 */
export function openModal(config) {
  closeModal();

  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  scrim.innerHTML = `
    <div class="sheet${config.wide ? ' sheet--wide' : ''}" role="dialog" aria-modal="true" tabindex="-1"${config.title ? ' aria-label="' + escapeAttr(config.title) + '"' : ''}>
      <div class="sheet__grip" aria-hidden="true"></div>
      ${config.title !== undefined ? `
        <header class="sheet__head">
          <div class="stack-sm" style="min-width:0">${config.title}</div>
          <button class="btn btn--ghost btn--icon btn--sm" data-act="sheet-close" aria-label="Fermer">✕</button>
        </header>` : ''}
      <div class="sheet__body">${config.body}</div>
      ${config.foot ? `<footer class="sheet__foot">${config.foot}</footer>` : ''}
    </div>`;

  document.body.appendChild(scrim);
  document.body.style.overflow = 'hidden';

  const release = trapFocus(scrim);
  // Le focus se pose sur la feuille elle-même, pas sur son bouton de fermeture.
  scrim.querySelector('.sheet')?.focus({ preventScroll: true });
  const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
  document.addEventListener('keydown', onKey);

  scrim.addEventListener('click', (e) => { if (e.target === scrim) closeModal(); });
  delegate(scrim, 'click', {
    'sheet-close': () => closeModal(),
    ...(config.actions || {}),
  });
  if (config.onAction) {
    scrim.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]');
      if (el && el.dataset.act !== 'sheet-close') config.onAction({ ...el.dataset }, e, el);
    });
  }
  if (config.onInput) scrim.addEventListener('input', config.onInput);

  openSheet = {
    root: scrim,
    close() {
      document.removeEventListener('keydown', onKey);
      release();
      document.body.style.overflow = '';
      scrim.remove();
      openSheet = null;
      config.onClose?.();
    },
    /** Remplace le corps sans refermer (prix recalculé, étape suivante…). */
    update(next) {
      if (next.body !== undefined) scrim.querySelector('.sheet__body').innerHTML = next.body;
      if (next.foot !== undefined) {
        const foot = scrim.querySelector('.sheet__foot');
        if (foot) foot.innerHTML = next.foot;
      }
      if (next.title !== undefined) {
        const head = scrim.querySelector('.sheet__head > .stack-sm');
        if (head) head.innerHTML = next.title;
      }
    },
  };
  return openSheet;
}

export function closeModal() {
  openSheet?.close();
}

export function getModal() {
  return openSheet;
}

function escapeAttr(s) {
  return String(s).replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').slice(0, 120);
}
