/**
 * Kenako — annuaire des restaurants (données de démonstration)
 * Dix identités distinctes, adresses parisiennes plausibles, réglages de
 * paiement / livraison / fidélité propres à chaque établissement : ce sont
 * ces réglages qui pilotent ce que le client voit côté commande.
 */

export const RESTAURANTS = [
  {
    id: 'comptoir', name: 'Le Comptoir de Marie', cuisine: 'Bistrot moderne', tint: '#C9451A',
    rating: 4.7, reviews: 312, distance: 0.4, eta: '25-35', etaMin: 25, fee: 0, minOrder: 15, budget: 2,
    promo: 'Livraison offerte dès 25 €', open: true, hours: 'Ouvert · ferme à 22h30', isNew: false, boosted: true,
    address: '12 rue de Charonne, 75011 Paris', lat: 48.8534, lng: 2.3742,
    badges: ['Fait maison', 'Végétarien', 'Terrasse'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash', 'paypal', 'wero'],
    loyalty: { type: 'points', rate: '1 € dépensé = 1 point', reward: '100 points = 10 € offerts' },
    referral: { sponsor: '5 € offerts', friend: '5 € sur la 1re commande' },
    story: 'Marie a ouvert son bistrot en 2019 après dix ans en cuisine étoilée. Tout est fait maison, la carte change chaque semaine.',
  },
  {
    id: 'napoli', name: 'Napoli Segreta', cuisine: 'Pizzeria napolitaine', tint: '#B02E1F',
    rating: 4.8, reviews: 528, distance: 0.9, eta: '20-30', etaMin: 20, fee: 2.5, minOrder: 12, budget: 1,
    promo: '−20 % sur la 2e pizza', open: true, hours: 'Ouvert · ferme à 23h', isNew: false, boosted: true,
    address: '38 rue du Faubourg Saint-Martin, 75010 Paris', lat: 48.8712, lng: 2.3568,
    badges: ['Four à bois', 'Végétarien'],
    modes: ['livraison', 'emporter'],
    payments: ['card', 'cash'],
    loyalty: { type: 'tampons', rate: '1 pizza achetée = 1 tampon', reward: '10 tampons = 1 pizza offerte' },
    referral: { sponsor: '1 dessert offert', friend: '−10 % sur la 1re commande' },
    story: 'Pâte à maturation 48 h, farine Caputo, four à bois à 480 °C. Gennaro fait venir sa mozzarella de Campanie deux fois par semaine.',
  },
  {
    id: 'beyrouth', name: 'Beyrouth Cantine', cuisine: 'Libanais', tint: '#8C6B12',
    rating: 4.6, reviews: 204, distance: 1.3, eta: '30-40', etaMin: 30, fee: 1.9, minOrder: 15, budget: 1,
    promo: null, open: true, hours: 'Ouvert · ferme à 22h', isNew: false, boosted: false,
    address: '5 rue de la Grange-Batelière, 75009 Paris', lat: 48.8728, lng: 2.3416,
    badges: ['Halal', 'Végétarien', 'Végan'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash', 'wero'],
    loyalty: { type: 'cashback', rate: '5 % du panier en cagnotte', reward: 'Cagnotte utilisable dès 5 €' },
    referral: { sponsor: '3 € offerts', friend: '3 € offerts' },
    story: 'Une cantine familiale : mezze du jour, pain libanais cuit sur place, houmous crémeux au tahini de Saïda.',
  },
  {
    id: 'hanabi', name: 'Sushi Hanabi', cuisine: 'Japonais · Sushi', tint: '#2F5D6B',
    rating: 4.5, reviews: 167, distance: 1.8, eta: '35-45', etaMin: 35, fee: 3.5, minOrder: 20, budget: 3,
    promo: null, open: true, hours: 'Ouvert · ferme à 22h', isNew: true, boosted: false,
    address: '21 rue Saint-Augustin, 75002 Paris', lat: 48.8692, lng: 2.3372,
    badges: ['Poisson du jour', 'Sans gluten'],
    modes: ['livraison', 'emporter'],
    payments: ['card'],
    loyalty: { type: 'points', rate: '1 € dépensé = 1 point', reward: '150 points = 12 € offerts' },
    referral: { sponsor: '5 € offerts', friend: '5 € offerts' },
    story: 'Kenji travaille exclusivement le poisson de criée. La carte se décide chaque matin, selon l’arrivage de Rungis.',
  },
  {
    id: 'burger', name: 'Maison Burger', cuisine: 'Burger artisanal', tint: '#A85A16',
    rating: 4.4, reviews: 891, distance: 0.7, eta: '15-25', etaMin: 15, fee: 0, minOrder: 10, budget: 1,
    promo: 'Menu midi 12,90 €', open: true, hours: 'Ouvert · ferme à 23h30', isNew: false, boosted: true,
    address: '64 rue Oberkampf, 75011 Paris', lat: 48.8659, lng: 2.3755,
    badges: ['Bœuf français', 'Végétarien'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash', 'paypal'],
    loyalty: { type: 'tampons', rate: '1 menu = 1 tampon', reward: '8 tampons = 1 burger offert' },
    referral: { sponsor: '1 portion de frites offerte', friend: '1 portion de frites offerte' },
    story: 'Pain brioché du boulanger d’en face, viande hachée le matin, sauces maison. Rien de surgelé, jamais.',
  },
  {
    id: 'awa', name: 'Chez Awa', cuisine: 'Ouest-africain', tint: '#B5701A',
    rating: 4.9, reviews: 143, distance: 3.2, eta: '40-50', etaMin: 40, fee: 2.9, minOrder: 15, budget: 1,
    promo: null, open: true, hours: 'Ouvert · ferme à 22h', isNew: true, boosted: false,
    address: '17 rue Myrha, 75018 Paris', lat: 48.8871, lng: 2.3521,
    badges: ['Halal', 'Fait maison', 'Épicé'],
    modes: ['livraison', 'emporter'],
    payments: ['card', 'cash'],
    loyalty: { type: 'points', rate: '1 € dépensé = 2 points', reward: '200 points = 10 € offerts' },
    referral: { sponsor: '5 € offerts', friend: '5 € offerts' },
    story: 'Le thiéboudienne d’Awa mijote six heures. Elle cuisine comme à Dakar, et la file d’attente du samedi le prouve.',
  },
  {
    id: 'racines', name: 'Racines', cuisine: 'Végétarien', tint: '#3F7A2E',
    rating: 4.6, reviews: 98, distance: 1.1, eta: '25-35', etaMin: 25, fee: 1.5, minOrder: 12, budget: 2,
    promo: 'Bowl + dessert 16 €', open: true, hours: 'Ouvert · ferme à 21h30', isNew: true, boosted: false,
    address: '9 rue de Bretagne, 75003 Paris', lat: 48.8627, lng: 2.3626,
    badges: ['Végétarien', 'Végan', 'Sans gluten'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'wero'],
    loyalty: { type: 'cashback', rate: '4 % du panier en cagnotte', reward: 'Cagnotte utilisable dès 5 €' },
    referral: { sponsor: '4 € offerts', friend: '4 € offerts' },
    story: 'Légumes de maraîchers d’Île-de-France livrés trois fois par semaine. Carte 100 % végétale au dîner.',
  },
  {
    id: 'voltaire', name: 'Brasserie Voltaire', tint: '#7A4E1F', cuisine: 'Brasserie',
    rating: 4.3, reviews: 612, distance: 0.6, eta: '30-40', etaMin: 30, fee: 2, minOrder: 15, budget: 2,
    promo: null, open: true, hours: 'Ouvert · ferme à 00h', isNew: false, boosted: false,
    address: '3 boulevard Voltaire, 75011 Paris', lat: 48.8641, lng: 2.366,
    badges: ['Terrasse', 'Service tardif'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash', 'virement'],
    loyalty: { type: 'points', rate: '1 € dépensé = 1 point', reward: '120 points = 10 € offerts' },
    referral: { sponsor: '1 café offert', friend: '1 café offert' },
    story: 'Une brasserie de quartier ouverte jusqu’à minuit, avec le meilleur croque-madame de l’arrondissement.',
  },
  {
    id: 'phobac', name: 'Phở Bắc', cuisine: 'Vietnamien', tint: '#2E6B54',
    rating: 4.7, reviews: 388, distance: 2.6, eta: '30-40', etaMin: 30, fee: 2.5, minOrder: 15, budget: 1,
    promo: null, open: false, hours: 'Fermé · ouvre demain à 11h30', isNew: false, boosted: false,
    address: '44 avenue d’Ivry, 75013 Paris', lat: 48.8236, lng: 2.3648,
    badges: ['Fait maison', 'Sans gluten'],
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash'],
    loyalty: { type: 'points', rate: '1 € dépensé = 1 point', reward: '100 points = 8 € offerts' },
    referral: { sponsor: '3 € offerts', friend: '3 € offerts' },
    story: 'Le bouillon mijote douze heures chaque nuit. Linh le tient de sa grand-mère, à Hanoï.',
  },
  {
    id: 'bonita', name: 'Bonita Taquería', cuisine: 'Mexicain', tint: '#C2571B',
    rating: 4.5, reviews: 256, distance: 1.5, eta: '20-30', etaMin: 20, fee: 1.9, minOrder: 12, budget: 1,
    promo: 'Taco Tuesday −2 €', open: true, hours: 'Ouvert · ferme à 23h', isNew: false, boosted: false,
    address: '28 rue de Lancry, 75010 Paris', lat: 48.8702, lng: 2.362,
    badges: ['Épicé', 'Végétarien'],
    modes: ['livraison', 'emporter'],
    payments: ['card', 'paypal', 'cash'],
    loyalty: { type: 'tampons', rate: '1 commande = 1 tampon', reward: '6 tampons = 3 tacos offerts' },
    referral: { sponsor: '1 guacamole offert', friend: '1 guacamole offert' },
    story: 'Tortillas de maïs nixtamalisé pressées à la commande, salsas fumées au comal.',
  },
];

/** Libellés lisibles des modes et moyens de paiement. */
export const MODE_LABELS = { livraison: 'Livraison', emporter: 'À emporter', surplace: 'Sur place' };
export const MODE_ICONS = { livraison: '🛵', emporter: '🥡', surplace: '🍽️' };
export const PAYMENT_LABELS = {
  card: 'Carte bancaire', cash: 'Espèces à la livraison', paypal: 'PayPal', wero: 'Wero', virement: 'Virement',
};

export const CUISINES = [...new Set(RESTAURANTS.map((r) => r.cuisine.split(' · ')[0]))];

export const getRestaurant = (id) => RESTAURANTS.find((r) => r.id === id) || RESTAURANTS[0];

/** Filtres horizontaux de l'accueil client. */
export const FILTERS = [
  { id: 'open', label: 'Ouvert maintenant', test: (r) => r.open },
  { id: 'livraison', label: 'Livraison', test: (r) => r.modes.includes('livraison') },
  { id: 'emporter', label: 'À emporter', test: (r) => r.modes.includes('emporter') },
  { id: 'surplace', label: 'Sur place', test: (r) => r.modes.includes('surplace') },
  { id: 'promo', label: 'En promotion', test: (r) => Boolean(r.promo) },
  { id: 'top', label: 'Note 4,5 et +', test: (r) => r.rating >= 4.5 },
  { id: 'fast', label: 'Moins de 30 min', test: (r) => r.etaMin < 30 },
  { id: 'cheap', label: 'Petit budget', test: (r) => r.budget === 1 },
  { id: 'veggie', label: 'Végétarien', test: (r) => r.badges.includes('Végétarien') },
  { id: 'halal', label: 'Halal', test: (r) => r.badges.includes('Halal') },
];

export const SORTS = [
  { id: 'reco', label: 'Recommandés' },
  { id: 'rating', label: 'Mieux notés' },
  { id: 'distance', label: 'Plus proches' },
  { id: 'eta', label: 'Plus rapides' },
  { id: 'fee', label: 'Livraison la moins chère' },
];
