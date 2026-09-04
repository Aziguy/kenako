/**
 * Kenako — modèle de panier
 * -------------------------------------------------------------------------
 * Un panier appartient à un seul restaurant : chaque commande et chaque
 * paiement va directement à cet établissement. Changer de restaurant propose
 * donc de repartir d'un panier vide.
 */

import { getRestaurant } from '../data/restaurants.js';
import { PROMO_CODES } from '../data/client.js';

/** Clé stable d'une ligne : même plat + mêmes options = même ligne. */
export function lineKey(dishId, optionIds = []) {
  return [dishId, ...[...optionIds].sort()].join('|');
}

export function addLine(cart, line) {
  const existing = cart.find((l) => l.key === line.key);
  if (existing) {
    return cart.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l));
  }
  return [...cart, line];
}

export function setQty(cart, key, qty) {
  if (qty <= 0) return cart.filter((l) => l.key !== key);
  return cart.map((l) => (l.key === key ? { ...l, qty } : l));
}

export const countItems = (cart) => cart.reduce((sum, l) => sum + l.qty, 0);
export const subtotal = (cart) => cart.reduce((sum, l) => sum + l.unit * l.qty, 0);

/**
 * Calcule le détail financier de la commande.
 * Les frais de livraison, le franco de port et le minimum de commande
 * proviennent des réglages du restaurant : la plateforme n'en impose aucun.
 */
export function computeTotals({ cart, restId, mode = 'livraison', promoCode = null, tip = 0, freeShippingFrom = 25 }) {
  const restaurant = getRestaurant(restId);
  const sub = subtotal(cart);

  let shipping = mode === 'livraison' ? restaurant.fee : 0;
  const francoReached = mode === 'livraison' && restaurant.promo?.includes('Livraison offerte') && sub >= freeShippingFrom;
  if (francoReached) shipping = 0;

  let discount = 0;
  let promo = null;
  if (promoCode && PROMO_CODES[promoCode]) {
    const rule = PROMO_CODES[promoCode];
    if (sub >= rule.min) {
      promo = { code: promoCode, ...rule };
      if (rule.kind === 'percent') discount = (sub * rule.value) / 100;
      else if (rule.kind === 'amount') discount = Math.min(rule.value, sub);
      else if (rule.kind === 'shipping') { discount = 0; shipping = 0; }
    }
  }

  const total = Math.max(0, sub - discount) + shipping + Number(tip || 0);
  const belowMinimum = mode === 'livraison' && sub < restaurant.minOrder;

  return {
    restaurant,
    subtotal: sub,
    shipping,
    discount,
    promo,
    tip: Number(tip || 0),
    total,
    belowMinimum,
    missingForMinimum: Math.max(0, restaurant.minOrder - sub),
    francoReached,
    missingForFranco: mode === 'livraison' && shipping > 0 ? Math.max(0, freeShippingFrom - sub) : 0,
    points: restaurant.loyalty.type === 'points' ? Math.round(total * (restaurant.id === 'awa' ? 2 : 1)) : 0,
  };
}

/** Vérifie un code promo saisi et renvoie un message lisible. */
export function checkPromo(code, sub) {
  const key = (code || '').trim().toUpperCase();
  if (!key) return { ok: false, message: '' };
  const rule = PROMO_CODES[key];
  if (!rule) return { ok: false, message: 'Ce code n’existe pas ou a expiré.' };
  if (sub < rule.min) return { ok: false, message: `Ce code s’applique à partir de ${rule.min} € de commande.` };
  return { ok: true, code: key, message: rule.label };
}

/** Reconstruit un libellé d'options lisible (« 300 g · Saignant · Béarnaise »). */
export function optionsLabel(parts) {
  return parts.filter(Boolean).join(' · ');
}
