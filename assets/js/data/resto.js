/**
 * Kenako — back-office du restaurant fil rouge « Le Comptoir de Marie »
 */

export const RESTO = {
  name: 'Le Comptoir de Marie',
  cuisine: 'Bistrot moderne',
  address: '12 rue de Charonne, 75011 Paris',
  siret: '892 417 336 00021',
  plan: 'Signature',
  planPrice: 79,
  rating: 4.7,
  reviews: 312,
  tint: '#C9451A',
  lat: 48.8534,
  lng: 2.3742,
};

export const KPI = {
  revenue: 1284.5, revenuePrev: 1102,
  orders: 47, ordersPrev: 41,
  basket: 27.3, basketPrev: 26.9,
  rating: 4.7, ratingPrev: 4.6,
  refusalRate: 3.2, refusalRatePrev: 5.1,
  prepTime: 21, prepTimePrev: 24,
};

export const REVENUE_30 = [
  820, 910, 760, 1040, 1180, 1320, 980, 760, 880, 1010, 1120, 1290, 1410, 1020, 840,
  930, 1080, 1160, 1240, 1380, 1120, 890, 960, 1050, 1190, 1270, 1390, 1180, 1020, 1284,
];

export const TOP_DISHES = [
  { name: 'Bavette d’aloyau, frites maison', qty: 128, revenue: 2432, cost: 1094, margin: 55 },
  { name: 'Parmentier de canard confit', qty: 96, revenue: 1728, cost: 656, margin: 62 },
  { name: 'Tarte tatin, crème crue', qty: 84, revenue: 672, cost: 168, margin: 75 },
  { name: 'Risotto aux champignons', qty: 61, revenue: 1037, cost: 300, margin: 71 },
  { name: 'Œufs mayo revisités', qty: 54, revenue: 351, cost: 74, margin: 79 },
  { name: 'Poisson du jour, beurre blanc', qty: 38, revenue: 836, cost: 468, margin: 44 },
];

/** Commandes par créneau horaire et par jour — analytique avancée. */
export const PEAK_HOURS = {
  cols: ['11h', '12h', '13h', '14h', '19h', '20h', '21h', '22h'],
  rows: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  matrix: [
    [2, 9, 7, 2, 4, 8, 6, 1],
    [3, 12, 9, 3, 5, 11, 7, 2],
    [3, 13, 10, 3, 6, 12, 8, 2],
    [4, 14, 11, 3, 7, 14, 9, 3],
    [5, 16, 12, 4, 9, 19, 14, 5],
    [4, 15, 13, 6, 11, 22, 17, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

export const ALERTS = [
  { tone: 'danger', icon: '✕', title: 'Prélèvement d’abonnement refusé', text: 'Facture KEN-2026-0912 de 79,00 € · carte expirée', action: 'Mettre à jour le moyen de paiement', to: '/finances' },
  { tone: 'warning', icon: '!', title: '2 plats en rupture', text: 'Île flottante, Poisson du jour', action: 'Gérer la carte', to: '/carte' },
  { tone: 'info', icon: '★', title: 'Avis 2 ★ sans réponse', text: '« Attente de 50 min un vendredi soir » — Marc D.', action: 'Répondre', to: '/clients' },
];

export const ORDER_STATUSES = [
  { id: 'new', label: 'Nouvelles', tone: 'primary' },
  { id: 'accepted', label: 'Acceptées', tone: 'info' },
  { id: 'preparing', label: 'En préparation', tone: 'warning' },
  { id: 'ready', label: 'Prêtes', tone: 'success' },
  { id: 'delivering', label: 'En livraison', tone: 'info' },
  { id: 'done', label: 'Terminées', tone: 'outline' },
];

export const ORDERS = [
  { id: 'K-48231', status: 'new', mode: 'livraison', time: '12:04', client: 'Camille R.', phone: '06 12 34 56 78', address: '27 rue Keller, 75011 Paris', detail: 'Bât. B · 3e étage · code 1408', payment: 'Carte · payé', total: 43.5, minutes: 2, lat: 48.8557, lng: 2.3776, items: [{ q: 1, n: 'Bavette d’aloyau', o: '300 g · Saignant · Sauce béarnaise', p: 26.5 }, { q: 1, n: 'Risotto aux champignons', o: '', p: 17 }], note: 'Merci de sonner à l’interphone B.' },
  { id: 'K-48230', status: 'new', mode: 'emporter', time: '12:02', client: 'Thomas B.', phone: '06 98 71 22 40', address: 'Retrait au comptoir', detail: '', payment: 'Espèces · à encaisser', total: 36, minutes: 4, items: [{ q: 2, n: 'Parmentier de canard', o: '', p: 18 }], note: '' },
  { id: 'K-48228', status: 'accepted', mode: 'livraison', time: '11:56', client: 'Inès M.', phone: '07 55 21 09 88', address: '4 rue Sedaine, 75011 Paris', detail: 'Interphone 12', payment: 'Carte · payé', total: 62, minutes: 10, lat: 48.8578, lng: 2.3722, items: [{ q: 2, n: 'Bavette d’aloyau', o: '200 g · À point', p: 19 }, { q: 3, n: 'Tarte tatin', o: '', p: 8 }], note: '' },
  { id: 'K-48226', status: 'preparing', mode: 'surplace', time: '11:48', client: 'Table 7', phone: '', address: 'Sur place · table 7', detail: '4 couverts', payment: 'Carte · payé', total: 79, minutes: 18, items: [{ q: 2, n: 'Velouté de butternut', o: '', p: 8 }, { q: 2, n: 'Poisson du jour', o: '', p: 22 }, { q: 1, n: 'Bavette d’aloyau', o: '200 g · Bleu', p: 19 }], note: 'Sans gluten pour un convive.' },
  { id: 'K-48224', status: 'preparing', mode: 'livraison', time: '11:44', client: 'Julien P.', phone: '06 44 12 88 03', address: '19 bd Voltaire, 75011 Paris', detail: '', payment: 'PayPal · payé', total: 34, minutes: 22, lat: 48.8622, lng: 2.3688, items: [{ q: 1, n: 'Terrine de campagne', o: '', p: 9 }, { q: 1, n: 'Parmentier de canard', o: '', p: 18 }, { q: 1, n: 'Mousse au chocolat', o: '', p: 7 }], note: '' },
  { id: 'K-48221', status: 'ready', mode: 'emporter', time: '11:36', client: 'Sofia L.', phone: '06 20 55 71 12', address: 'Retrait au comptoir', detail: '', payment: 'Carte · payé', total: 28, minutes: 30, items: [{ q: 1, n: 'Risotto aux champignons', o: '', p: 17 }, { q: 1, n: 'Limonade artisanale', o: '', p: 4 }, { q: 1, n: 'Mousse au chocolat', o: '', p: 7 }], note: '' },
  { id: 'K-48219', status: 'delivering', mode: 'livraison', time: '11:28', client: 'Marc D.', phone: '06 71 04 33 90', address: '8 rue Popincourt, 75011 Paris', detail: '2e gauche', payment: 'Carte · payé', total: 46, minutes: 38, lat: 48.8592, lng: 2.3768, items: [{ q: 2, n: 'Bavette d’aloyau', o: '200 g · Saignant', p: 19 }, { q: 1, n: 'Tarte tatin', o: '', p: 8 }], note: '', courier: 'Karim T.' },
  { id: 'K-48215', status: 'done', mode: 'livraison', time: '11:12', client: 'Awa K.', phone: '06 33 90 12 45', address: '2 rue Basfroi, 75011 Paris', detail: '', payment: 'Carte · payé', total: 47, minutes: 54, items: [{ q: 1, n: 'Poisson du jour', o: '', p: 22 }, { q: 1, n: 'Bavette d’aloyau', o: '300 g · À point', p: 25 }], note: '' },
];

export const REFUSAL_REASONS = [
  'Article en rupture de stock',
  'Cuisine surchargée',
  'Hors zone de livraison',
  'Fermeture exceptionnelle',
  'Coordonnées client incomplètes',
];

export const CATEGORIES = [
  {
    id: 'c1', name: 'Entrées', items: [
      { id: 'oeufs', name: 'Œufs mayo revisités', price: 6.5, desc: 'Œufs de plein air, mayonnaise au raifort, herbes fraîches.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Œufs', 'Moutarde'], schedule: 'Toute la journée' },
      { id: 'velout', name: 'Velouté de butternut', price: 8, desc: 'Butternut rôtie, noisettes torréfiées, huile de sauge.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Fruits à coque', 'Lait'], schedule: 'Toute la journée' },
      { id: 'terrine', name: 'Terrine de campagne', price: 9, desc: 'Porc fermier, pistaches, pickles d’oignon rouge.', avail: true, stock: true, tags: [], allergens: ['Gluten', 'Fruits à coque'], schedule: 'Soir uniquement' },
    ],
  },
  {
    id: 'c2', name: 'Plats', items: [
      { id: 'bavette', name: 'Bavette d’aloyau, frites maison', price: 19, desc: 'Bœuf Limousine, échalotes confites, frites coupées à la main.', avail: true, stock: true, tags: ['Populaire'], allergens: [], schedule: 'Toute la journée', options: '2 groupes d’options' },
      { id: 'parmentier', name: 'Parmentier de canard confit', price: 18, desc: 'Canard du Sud-Ouest, purée à l’huile de noix.', avail: true, stock: true, tags: [], allergens: ['Lait', 'Fruits à coque'], schedule: 'Toute la journée' },
      { id: 'poisson', name: 'Poisson du jour, beurre blanc', price: 22, desc: 'Selon la pêche du matin, légumes de saison glacés.', avail: true, stock: false, tags: ['Nouveau'], allergens: ['Poisson', 'Lait'], schedule: 'Midi uniquement' },
      { id: 'risotto', name: 'Risotto aux champignons', price: 17, desc: 'Riz carnaroli, pleurotes et shiitakés, parmesan 24 mois.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Lait'], schedule: 'Toute la journée', options: '2 groupes d’options' },
    ],
  },
  {
    id: 'c3', name: 'Desserts', items: [
      { id: 'tatin', name: 'Tarte tatin, crème crue', price: 8, desc: 'Pommes caramélisées au beurre demi-sel.', avail: true, stock: true, tags: ['Populaire'], allergens: ['Gluten', 'Lait'], schedule: 'Toute la journée' },
      { id: 'mousse', name: 'Mousse au chocolat noir', price: 7, desc: 'Chocolat 70 %, fleur de sel.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Œufs', 'Lait'], schedule: 'Toute la journée' },
      { id: 'ile', name: 'Île flottante', price: 7.5, desc: 'Crème anglaise vanille Bourbon, pralines roses.', avail: true, stock: false, tags: [], allergens: ['Œufs', 'Lait'], schedule: 'Toute la journée' },
    ],
  },
  {
    id: 'c4', name: 'Boissons', items: [
      { id: 'limonade', name: 'Limonade artisanale', price: 4, desc: 'Citron de Menton, 33 cl.', avail: true, stock: true, tags: ['Végétarien'], allergens: [], schedule: 'Toute la journée' },
      { id: 'vin', name: 'Verre de rouge — Côtes du Rhône', price: 6, desc: 'Domaine Gramenon, 12 cl.', avail: true, stock: true, tags: [], allergens: ['Sulfites'], schedule: 'Soir uniquement' },
      { id: 'cafe', name: 'Café de spécialité', price: 2.8, desc: 'Torréfaction Belleville, filtre ou expresso.', avail: true, stock: true, tags: ['Végétarien'], allergens: [], schedule: 'Toute la journée' },
    ],
  },
];

export const ZONES = [
  { id: 'z1', name: 'Zone 1 · Paris 11e', color: '#C9451A', rule: 'Frais fixe 2,00 € · minimum 15 € · franco dès 25 €', eta: '25–35 min', coords: [[48.86, 2.368], [48.868, 2.379], [48.862, 2.392], [48.851, 2.389], [48.847, 2.374]] },
  { id: 'z2', name: 'Zone 2 · Bastille / Marais', color: '#F5A524', rule: 'Frais 3,50 € · minimum 20 €', eta: '30–45 min', coords: [[48.862, 2.352], [48.869, 2.36], [48.866, 2.372], [48.856, 2.366], [48.855, 2.354]] },
  { id: 'z3', name: 'Zone 3 · au kilomètre', color: '#157A5B', rule: '1,20 €/km · minimum 25 € · rayon 4 km', eta: '35–50 min', coords: [[48.845, 2.355], [48.853, 2.35], [48.858, 2.362], [48.849, 2.372], [48.841, 2.366]] },
];

export const COURIERS = [
  { name: 'Karim T.', status: 'En course', order: 'K-48219', shift: '11h–15h', deliveries: 6 },
  { name: 'Léa V.', status: 'Disponible', order: null, shift: '11h–15h', deliveries: 4 },
  { name: 'Yanis B.', status: 'Hors service', order: null, shift: '18h–23h', deliveries: 0 },
];

export const PAYOUTS = [
  { date: '3 sept.', label: 'Encaissements carte (Stripe)', orders: 31, gross: 842.5 },
  { date: '2 sept.', label: 'Encaissements carte (Stripe)', orders: 28, gross: 761.2 },
  { date: '2 sept.', label: 'Espèces encaissées en salle', orders: 9, gross: 214 },
  { date: '1 sept.', label: 'PayPal', orders: 6, gross: 168.4 },
  { date: '31 août', label: 'Wero', orders: 4, gross: 96.8 },
];

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Carte bancaire (Stripe)', on: true, note: 'Compte connecté · versement à J+1' },
  { id: 'cash', label: 'Espèces à la livraison', on: true, note: 'Encaissement par le livreur' },
  { id: 'paypal', label: 'PayPal', on: true, note: 'Compte connecté' },
  { id: 'wero', label: 'Wero', on: true, note: 'Compte connecté' },
  { id: 'virement', label: 'Virement bancaire', on: false, note: 'Confirmation manuelle sous 48 h' },
];

export const INVOICES = [
  { id: 'KEN-2026-0912', date: '1 sept. 2026', amount: 79, status: 'impayé' },
  { id: 'KEN-2026-0811', date: '1 août 2026', amount: 79, status: 'payé' },
  { id: 'KEN-2026-0710', date: '1 juil. 2026', amount: 79, status: 'payé' },
  { id: 'KEN-2026-0609', date: '1 juin 2026', amount: 79, status: 'payé' },
];

export const PLANS = [
  { name: 'Essentiel', price: 29, yearly: 290, features: ['Boutique en ligne', 'Commandes illimitées', 'Carte + espèces', '1 compte staff'], current: false },
  { name: 'Signature', price: 79, yearly: 790, features: ['Tout Essentiel', 'Livreurs internes', 'Fidélité & parrainage', 'Campagnes email / SMS', '10 comptes staff'], current: true },
  { name: 'Maison', price: 149, yearly: 1490, features: ['Tout Signature', 'Multi-établissements', 'API & caisse', 'Support prioritaire'], current: false },
];

export const PROMOS = [
  { code: 'BIENVENUE10', type: '−10 %', cond: '1re commande · minimum 15 €', period: 'Jusqu’au 31 déc.', used: 84, cap: 500, active: true },
  { code: 'MARIE5', type: '−5 €', cond: 'Minimum 30 € · 1 usage par client', period: '1er – 30 sept.', used: 37, cap: 200, active: true },
  { code: 'LIVRAISON0', type: 'Livraison offerte', cond: 'Minimum 20 €', period: 'Terminé le 31 août', used: 152, cap: 150, active: false },
];

export const LOYALTY_CONFIG = {
  type: 'points',
  rate: 1,
  threshold: 100,
  reward: 10,
  referralSponsor: 5,
  referralFriend: 5,
  members: 218,
  redeemed: 34,
};

export const CAMPAIGNS = [
  { name: 'Menu d’automne', channel: 'Email', segment: 'Tous les clients (612)', sent: '2 sept.', open: '38 %', clicks: '9 %', status: 'Envoyée' },
  { name: 'On vous a manqué ?', channel: 'SMS', segment: 'Inactifs 30 j (148)', sent: 'Programmée 6 sept.', open: '—', clicks: '—', status: 'Programmée' },
  { name: 'Soirée vins & fromages', channel: 'Push', segment: 'Gros paniers (74)', sent: '28 août', open: '52 %', clicks: '21 %', status: 'Envoyée' },
];

export const SEGMENTS = [
  { id: 'all', label: 'Tous les clients', count: 612 },
  { id: 'new', label: 'Nouveaux (30 j)', count: 87 },
  { id: 'inactive', label: 'Inactifs 30 jours', count: 148 },
  { id: 'big', label: 'Gros paniers (> 40 €)', count: 74 },
  { id: 'loyal', label: 'Programme fidélité', count: 218 },
];

export const RESTO_EVENTS = [
  { title: 'Soirée accords vins & fromages', date: 'Jeu. 18 sept. · 19h30', price: 35, cap: 24, sold: 12, mode: 'Billetterie', status: 'Publié' },
  { title: 'Brunch du dimanche', date: 'Dim. 21 sept. · 11h–14h', price: 28, cap: 40, sold: 31, mode: 'Réservation', status: 'Publié' },
  { title: 'Concert jazz trio', date: 'Ven. 3 oct. · 20h', price: 0, cap: 50, sold: 0, mode: 'Réservation', status: 'Brouillon' },
];

export const RESERVATIONS = [
  { time: '12:15', name: 'Famille Duval', covers: 4, table: '7', phone: '06 12 90 44 21', status: 'Confirmée', note: 'Chaise haute' },
  { time: '12:30', name: 'Sofia Lambert', covers: 2, table: '3', phone: '06 20 55 71 12', status: 'Confirmée', note: '' },
  { time: '13:00', name: 'Julien Perret', covers: 6, table: '11', phone: '06 44 12 88 03', status: 'En attente', note: 'Anniversaire' },
  { time: '19:30', name: 'Marc Dubois', covers: 2, table: '5', phone: '06 71 04 33 90', status: 'Confirmée', note: '' },
  { time: '20:00', name: 'Awa Koné', covers: 3, table: '9', phone: '06 33 90 12 45', status: 'Confirmée', note: 'Allergie fruits à coque' },
];

export const TABLES = [
  { no: '1', seats: 2, zone: 'Salle' }, { no: '2', seats: 2, zone: 'Salle' }, { no: '3', seats: 2, zone: 'Salle' },
  { no: '5', seats: 4, zone: 'Salle' }, { no: '7', seats: 4, zone: 'Salle' }, { no: '9', seats: 4, zone: 'Terrasse' },
  { no: '11', seats: 6, zone: 'Terrasse' }, { no: '12', seats: 6, zone: 'Terrasse' },
];

export const CUSTOMERS = [
  { name: 'Camille Renard', orders: 14, spent: 412.5, points: 145, last: '3 sept.', tag: 'Fidèle' },
  { name: 'Marc Dubois', orders: 9, spent: 287, points: 92, last: '31 août', tag: 'Gros panier' },
  { name: 'Inès Moreau', orders: 7, spent: 231.8, points: 74, last: '28 août', tag: 'Fidèle' },
  { name: 'Julien Perret', orders: 4, spent: 118, points: 38, last: '12 août', tag: '' },
  { name: 'Sofia Lambert', orders: 3, spent: 84.5, points: 27, last: '2 août', tag: 'Inactif 30 j' },
  { name: 'Awa Koné', orders: 2, spent: 96, points: 31, last: '11 juil.', tag: 'Inactif 30 j' },
];

export const RESTO_REVIEWS = [
  { author: 'Marc D.', date: 'il y a 2 jours', rating: 2, text: 'Attente de 50 min un vendredi soir alors que l’application annonçait 30. La bavette était froide à l’arrivée.', reply: null, flagged: false },
  { author: 'Camille R.', date: 'il y a 3 jours', rating: 5, text: 'La bavette était parfaitement saignante et les frites croustillantes même après vingt minutes de livraison.', reply: 'Merci Camille, à très vite !', flagged: false },
  { author: 'Thomas B.', date: 'il y a 1 semaine', rating: 4, text: 'Très bon parmentier, portion généreuse. Tatin un peu trop sucrée à mon goût.', reply: null, flagged: false },
];

export const STAFF = [
  { name: 'Marie Lefèvre', role: 'Gérante', email: 'marie@comptoirdemarie.fr', last: 'En ligne' },
  { name: 'Hugo Marchand', role: 'Cuisine', email: 'hugo@comptoirdemarie.fr', last: 'il y a 12 min' },
  { name: 'Nour Bensalah', role: 'Service', email: 'nour@comptoirdemarie.fr', last: 'il y a 2 h' },
  { name: 'Karim Traoré', role: 'Livreur', email: 'karim@comptoirdemarie.fr', last: 'En course' },
];

export const ROLE_RIGHTS = {
  Gérante: ['Tout le back-office', 'Facturation', 'Comptes staff'],
  Cuisine: ['Écran cuisine', 'Ruptures de stock'],
  Service: ['Commandes', 'Réservations', 'Encaissement'],
  Livreur: ['Courses attribuées', 'Preuve de livraison'],
};

export const HOURS = [
  { day: 'Lundi', slots: '12:00–14:30 · 19:00–22:30', open: true },
  { day: 'Mardi', slots: '12:00–14:30 · 19:00–22:30', open: true },
  { day: 'Mercredi', slots: '12:00–14:30 · 19:00–22:30', open: true },
  { day: 'Jeudi', slots: '12:00–14:30 · 19:00–22:30', open: true },
  { day: 'Vendredi', slots: '12:00–14:30 · 19:00–23:00', open: true },
  { day: 'Samedi', slots: '12:00–15:00 · 19:00–23:00', open: true },
  { day: 'Dimanche', slots: 'Fermé', open: false },
];

export const ONBOARDING = [
  { id: 'logo', label: 'Ajouter votre logo', hint: 'PNG ou SVG, 512 px minimum', done: true },
  { id: 'cat', label: 'Créer votre première catégorie', hint: 'Entrées, Plats, Desserts…', done: true },
  { id: 'dishes', label: 'Ajouter 3 plats', hint: '2 sur 3 ajoutés', done: false },
  { id: 'hours', label: 'Configurer vos horaires', hint: 'Par jour, créneaux multiples', done: true },
  { id: 'delivery', label: 'Configurer la livraison', hint: 'Zones, frais, minimum de commande', done: false },
  { id: 'payment', label: 'Activer un moyen de paiement', hint: 'Stripe, espèces, PayPal…', done: false },
];

export const SIGNUP_STEPS = [
  { id: 'etablissement', label: 'Établissement', hint: 'Raison sociale, adresse, cuisine' },
  { id: 'documents', label: 'Documents', hint: 'SIRET, pièce d’identité, RIB' },
  { id: 'formule', label: 'Formule', hint: 'Essentiel, Signature ou Maison' },
  { id: 'paiement', label: 'Paiement', hint: 'Abonnement mensuel ou annuel' },
];
