/**
 * A10 — États limites
 * Une planche de raccourcis pour démontrer les cas qu'on oublie
 * habituellement de dessiner.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { subHeader } from '../components.js';

export const DEMO_STATES = [
  { id: 'closed', label: 'Restaurant fermé', hint: 'Fiche Phở Bắc, commande impossible', art: '🌙' },
  { id: 'noDelivery', label: 'Zone non livrée', hint: 'Adresse hors rayon à l’étape 1', art: '🚫' },
  { id: 'emptyCart', label: 'Panier vide', hint: 'Tunnel sans article', art: '🧺' },
  { id: 'noResults', label: 'Aucun résultat', hint: 'Recherche « ramen » sans correspondance', art: '🔍' },
  { id: 'outOfStock', label: 'Plat en rupture', hint: 'Ajout refusé + toast d’alerte', art: '⛔' },
  { id: 'paymentFail', label: 'Paiement refusé', hint: 'Carte 4000 0000 0000 0002', art: '💳' },
  { id: 'geoDenied', label: 'Géolocalisation refusée', hint: 'Repli sur l’adresse enregistrée', art: '📍' },
  { id: 'loading', label: 'Chargement', hint: 'Squelettes de la grille d’accueil', art: '⏳' },
];

export function view() {
  return html`
    <div class="wrap" style="padding-bottom:var(--sp-12)">
      ${subHeader('États limites', { back: '#/' })}
      <p class="lead" style="padding-bottom:var(--sp-4)">
        Huit situations à ne pas oublier. Chaque bouton place l’application dans l’état correspondant.
      </p>
      <div class="grid grid--tiles">
        ${DEMO_STATES.map(
          (s) => html`
          <button type="button" class="card card--pad card--hover stack-sm" style="text-align:left;border:0;width:100%"
            data-act="demo-state" data-id="${s.id}">
            <span class="empty__art" style="width:44px;height:44px;font-size:20px" aria-hidden="true">${s.art}</span>
            <strong>${s.label}</strong>
            <span class="tiny dim">${s.hint}</span>
            <span class="tiny strong" style="color:var(--primary-strong)">Voir l’état ${raw(icon('arrowRight', { size: 13 }))}</span>
          </button>`
        )}
      </div>
    </div>`;
}
