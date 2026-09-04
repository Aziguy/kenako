/**
 * Kenako — formatage français
 * Toutes les valeurs monétaires, distances et dates du prototype passent ici,
 * pour rester cohérentes d'un écran à l'autre.
 */

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const eurCompact = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('fr-FR');
const pct = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 });

/** 19 → « 19,00 € » */
export const money = (n) => eur.format(Number(n) || 0);

/** 18470 → « 18 470 € » (KPI, pas de centimes) */
export const moneyShort = (n) => eurCompact.format(Number(n) || 0);

/** 1284 → « 1 284 » */
export const number = (n) => num.format(Number(n) || 0);

/** 0.024 → « 2,4 % » */
export const percent = (n) => pct.format(Number(n) || 0);

/** 2.4 → « +2,4 % » / « −2,4 % » (signe typographique français) */
export function delta(value, unit = '%') {
  const v = Number(value) || 0;
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';
  return `${sign}${num.format(Math.abs(v))}${unit === '%' ? ' %' : unit}`;
}

/** Variation relative entre deux mesures, en pourcentage arrondi. */
export function trend(current, previous) {
  if (!previous) return { value: 0, dir: 'flat' };
  const diff = ((current - previous) / previous) * 100;
  return { value: Math.round(diff * 10) / 10, dir: diff > 0.5 ? 'up' : diff < -0.5 ? 'down' : 'flat' };
}

/** 0.4 → « 400 m » ; 1.3 → « 1,3 km » */
export function distance(km) {
  const v = Number(km) || 0;
  return v < 1 ? `${Math.round(v * 1000)} m` : `${num.format(Math.round(v * 10) / 10)} km`;
}

/** 0 → « Livraison offerte » ; 2.5 → « 2,50 € de livraison » */
export const deliveryFee = (fee) => (fee > 0 ? `${money(fee)} de livraison` : 'Livraison offerte');

/** 4.7 → « 4,7 » */
export const rating = (n) => num.format(Math.round(Number(n) * 10) / 10);

/** Rendu textuel d'une note en étoiles pleines / vides. */
export function starsText(value, max = 5) {
  const full = Math.round(Number(value) || 0);
  return '★'.repeat(Math.min(full, max)) + '☆'.repeat(Math.max(0, max - full));
}

/** Pluriel simple : plural(2, 'avis', 'avis') */
export function plural(count, singular, pluralForm) {
  return `${number(count)} ${count > 1 ? pluralForm ?? `${singular}s` : singular}`;
}

/** Minutes → « 1 h 05 » / « 42 min » */
export function duration(minutes) {
  const m = Math.max(0, Math.round(Number(minutes) || 0));
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`;
}

/** Horodatage courant, format « 12:04 ». */
export function clock(date = new Date()) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/** Date longue : « jeudi 4 septembre » */
export function longDate(date = new Date()) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Identifiant de commande plausible : « K-48232 » */
export function orderId(seed = Date.now()) {
  return `K-${48200 + (seed % 800)}`;
}

/** Initiales d'un nom : « Camille R. » → « CR » */
export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/** Retire les diacritiques pour une recherche tolérante. */
export const fold = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
