/**
 * B1 — Inscription, attente de validation et checklist de démarrage
 * Le bouton « publier mon restaurant » ne s'active qu'à 100 % : c'est le
 * seul moyen d'éviter les fiches vides côté client.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number } from '../../core/format.js';
import { SIGNUP_STEPS, PLANS } from '../../data/resto.js';
import { sectionCard } from '../components.js';

const DOCS = [
  { id: 'kbis', label: 'Extrait Kbis ou avis SIRENE', hint: 'PDF, moins de 3 mois' },
  { id: 'id', label: 'Pièce d’identité du gérant', hint: 'Recto-verso, lisible' },
  { id: 'rib', label: 'RIB de l’établissement', hint: 'Au nom de la société' },
];

/* ------------------------------------------------- Inscription (4 étapes) */

export function signupView(ctx) {
  const { state } = ctx;
  const step = Math.min(SIGNUP_STEPS.length, Math.max(1, state.signupStep || 1));

  return html`
    <div class="bo-page" style="max-width:760px;margin-inline:auto;width:100%">
      <div class="stack-sm">
        <span class="eyebrow">Inscription restaurateur</span>
        <h1 class="bo-title">${SIGNUP_STEPS[step - 1].label}</h1>
        <p class="bo-sub">${SIGNUP_STEPS[step - 1].hint}</p>
        <div class="steps" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="${SIGNUP_STEPS.length}">
          ${SIGNUP_STEPS.map((s, i) => html`<span class="steps__item ${i < step ? 'is-done' : ''}"></span>`)}
        </div>
        <p class="tiny dim">Étape ${step} sur ${SIGNUP_STEPS.length}</p>
      </div>

      ${step === 1
        ? sectionCard('Votre établissement', html`
            <div class="grid grid--2" style="gap:var(--sp-4)">
              <label class="field"><span class="field__label">Nom commercial</span><input class="input" placeholder="Le Comptoir de Marie"></label>
              <label class="field"><span class="field__label">Type de cuisine</span>
                <select class="select"><option>Bistrot moderne</option><option>Pizzeria</option><option>Libanais</option><option>Japonais</option><option>Burger</option></select></label>
              <label class="field" style="grid-column:1/-1"><span class="field__label">Adresse</span><input class="input" placeholder="12 rue de Charonne, 75011 Paris"></label>
              <label class="field"><span class="field__label">SIRET</span><input class="input num" placeholder="892 417 336 00021"></label>
              <label class="field"><span class="field__label">Téléphone</span><input class="input" type="tel" placeholder="01 43 55 12 08"></label>
              <label class="field" style="grid-column:1/-1"><span class="field__label">E-mail du gérant</span><input class="input" type="email" placeholder="marie@comptoirdemarie.fr"></label>
            </div>`)
        : ''}

      ${step === 2
        ? sectionCard('Documents justificatifs', html`
            <div class="stack-sm">
              ${DOCS.map(
                (d) => html`
                <div class="between" style="padding:var(--sp-4);border:1px dashed var(--line-strong);border-radius:var(--r-md)">
                  <div style="min-width:0">
                    <strong>${d.label}</strong>
                    <p class="tiny dim">${d.hint}</p>
                  </div>
                  <button type="button" class="btn btn--outline btn--sm" data-act="upload-doc" data-id="${d.id}">
                    ${raw(icon('download', { size: 15 }))} Déposer</button>
                </div>`
              )}
              <p class="tiny dim">${raw(icon('shield', { size: 13 }))} Vos documents sont chiffrés et consultés uniquement par l’équipe de validation.</p>
            </div>`)
        : ''}

      ${step === 3
        ? sectionCard('Choisissez votre formule', html`
            <div class="grid grid--3">
              ${PLANS.map(
                (p) => html`
                <button type="button" class="card card--flat card--pad stack-sm" style="text-align:left"
                  data-act="pick-plan" data-name="${p.name}"
                  aria-pressed="${ctx.state.signupPlan === p.name}">
                  <div class="between"><strong>${p.name}</strong>
                    ${ctx.state.signupPlan === p.name ? html`<span class="badge badge--primary">✓ Choisie</span>` : ''}</div>
                  <p><span class="num" style="font-size:24px;font-weight:700">${money(p.price)}</span><span class="tiny dim"> / mois</span></p>
                  <ul class="stack-sm" style="gap:4px">
                    ${p.features.map((f) => html`<li class="tiny row" style="gap:6px">${raw(icon('check', { size: 12 }))} ${f}</li>`)}
                  </ul>
                </button>`
              )}
            </div>
            <p class="tiny dim" style="margin-top:var(--sp-3)">
              Aucune commission sur vos commandes, quelle que soit la formule. 30 jours d’essai, sans engagement.
            </p>`)
        : ''}

      ${step === 4
        ? sectionCard('Paiement de l’abonnement', html`
            <div class="stack">
              <div class="banner">
                <span class="banner__icon" aria-hidden="true">i</span>
                <span>Formule <strong>${ctx.state.signupPlan || 'Signature'}</strong> · premier prélèvement après 30 jours d’essai.</span>
              </div>
              <div class="grid grid--2" style="gap:var(--sp-3)">
                <label class="field" style="grid-column:1/-1"><span class="field__label">Numéro de carte</span>
                  <input class="input num" placeholder="4242 4242 4242 4242"></label>
                <label class="field"><span class="field__label">Expiration</span><input class="input num" placeholder="09/29"></label>
                <label class="field"><span class="field__label">Cryptogramme</span><input class="input num" placeholder="123"></label>
              </div>
              <p class="tiny dim">Vous pouvez aussi régler par virement, PayPal ou Wero — à choisir après validation.</p>
            </div>`)
        : ''}

      <div class="row" style="gap:var(--sp-2)">
        ${step > 1 ? html`<button type="button" class="btn btn--outline" data-act="signup-back">Retour</button>` : ''}
        <button type="button" class="btn btn--primary" style="flex:1" data-act="signup-next">
          ${step === SIGNUP_STEPS.length ? 'Envoyer ma demande' : 'Continuer'} ${raw(icon('arrowRight', { size: 17 }))}
        </button>
      </div>
    </div>`;
}

/* ------------------------------------------------ Attente de validation */

export function pendingView() {
  return html`
    <div class="bo-page" style="max-width:640px;margin-inline:auto;width:100%">
      <div class="empty">
        <div class="empty__art" style="background:var(--warning-soft);color:var(--warning)" aria-hidden="true">⏳</div>
        <p class="empty__title">Votre dossier est en cours de vérification</p>
        <p class="empty__text">Nos équipes contrôlent vos documents. Réponse sous 48 heures ouvrées.</p>
      </div>

      ${sectionCard(
        'État de votre dossier',
        html`<div class="divider-list">
          ${[
            { label: 'Formulaire d’inscription', state: 'Terminé', tone: 'success', glyph: '✓' },
            { label: 'Extrait Kbis', state: 'Validé', tone: 'success', glyph: '✓' },
            { label: 'Pièce d’identité', state: 'En cours de vérification', tone: 'warning', glyph: '⏳' },
            { label: 'RIB', state: 'En cours de vérification', tone: 'warning', glyph: '⏳' },
            { label: 'Abonnement', state: 'Actif · essai 30 jours', tone: 'success', glyph: '✓' },
          ].map(
            (row) => html`
            <div class="between" style="padding:var(--sp-3) 0">
              <span>${row.label}</span>
              <span class="badge badge--${row.tone}">${row.glyph} ${row.state}</span>
            </div>`
          )}
        </div>`
      )}

      <p class="tiny dim">En attendant, vous pouvez déjà préparer votre carte et vos horaires : <a href="#/demarrage">démarrage guidé</a>.</p>
    </div>`;
}

/* --------------------------------------------------- Checklist de démarrage */

export function checklistView(ctx) {
  const steps = ctx.state.checklist;
  const done = steps.filter((s) => s.done).length;
  const ratio = done / steps.length;
  const ready = done === steps.length;

  return html`
    <div class="bo-page" style="max-width:760px;margin-inline:auto;width:100%">
      <div class="stack-sm">
        <span class="eyebrow">Démarrage guidé</span>
        <h1 class="bo-title">Publiez votre restaurant</h1>
        <p class="bo-sub">${number(done)} étape${done > 1 ? 's' : ''} terminée${done > 1 ? 's' : ''} sur ${number(steps.length)}</p>
        <div class="progress ${ready ? 'progress--success' : 'progress--accent'}">
          <div class="progress__bar" style="width:${ratio * 100}%"></div>
        </div>
      </div>

      <div class="stack-sm">
        ${steps.map(
          (s) => html`
          <button type="button" class="check-item ${s.done ? 'is-done' : ''}" data-act="toggle-check" data-id="${s.id}"
            aria-pressed="${s.done}">
            <span class="check-item__box">${s.done ? raw(icon('check', { size: 13, stroke: 3 })) : ''}</span>
            <span style="display:grid;min-width:0;flex:1">
              <span class="check-item__label strong">${s.label}</span>
              <span class="tiny dim">${s.hint}</span>
            </span>
            ${raw(icon('chevronRight', { size: 16 }))}
          </button>`
        )}
      </div>

      <button type="button" class="btn btn--accent btn--lg btn--block" data-act="publish-resto" ${ready ? '' : raw('disabled')}>
        ${ready ? 'Publier mon restaurant' : `Encore ${steps.length - done} étape(s) avant publication`}
      </button>
      <p class="tiny dim" style="text-align:center">Une fois publié, votre restaurant apparaît immédiatement dans la recherche et sur la carte.</p>
    </div>`;
}
