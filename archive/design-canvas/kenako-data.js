// Données d'exemple Kenako — espace client
window.KENAKO_DATA = {
  restaurants: [
    { id: 'comptoir', name: 'Le Comptoir de Marie', cuisine: 'Bistrot moderne', rating: 4.7, reviews: 312, distance: 0.4, eta: '25-35', fee: 0, promo: 'Livraison offerte dès 25 €', open: true, hours: 'Ouvert · ferme à 22h30', address: '12 rue de Charonne, 75011 Paris', lat: 48.8534, lng: 2.3742, tint: '#8a3b22', badges: ['Fait maison', 'Végétarien', 'Livraison offerte dès 25 €'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'cash', 'paypal', 'wero'], loyalty: { type: 'points', rate: '1 € = 1 pt', reward: '100 pts = 10 € offerts' }, referral: { sponsor: '5 € offerts', friend: '5 € sur la 1re commande' }, isNew: false, minOrder: 15, budget: 2 },
    { id: 'napoli', name: 'Napoli Segreta', cuisine: 'Pizzeria napolitaine', rating: 4.8, reviews: 528, distance: 0.9, eta: '20-30', fee: 2.5, promo: '-20 % sur la 2e pizza', open: true, hours: 'Ouvert · ferme à 23h', address: '38 rue du Faubourg Saint-Martin, 75010 Paris', lat: 48.8712, lng: 2.3568, tint: '#a0462a', badges: ['Four à bois', 'Végétarien'], modes: ['livraison', 'emporter'], payments: ['card', 'cash'], loyalty: { type: 'tampons', rate: '1 pizza = 1 tampon', reward: '10 tampons = 1 pizza offerte' }, referral: { sponsor: '1 dessert offert', friend: '-10 %' }, isNew: false, minOrder: 12, budget: 1 },
    { id: 'beyrouth', name: 'Beyrouth Cantine', cuisine: 'Libanais', rating: 4.6, reviews: 204, distance: 1.3, eta: '30-40', fee: 1.9, promo: null, open: true, hours: 'Ouvert · ferme à 22h', address: '5 rue de la Grange-Batelière, 75009 Paris', lat: 48.8728, lng: 2.3416, tint: '#6f5a2c', badges: ['Halal', 'Végétarien', 'Végan'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'cash', 'wero'], loyalty: { type: 'cashback', rate: '5 % en cagnotte', reward: 'Utilisable dès 5 €' }, referral: { sponsor: '3 € offerts', friend: '3 € offerts' }, isNew: false, minOrder: 15, budget: 1 },
    { id: 'hanabi', name: 'Sushi Hanabi', cuisine: 'Japonais · Sushi', rating: 4.5, reviews: 167, distance: 1.8, eta: '35-45', fee: 3.5, promo: null, open: true, hours: 'Ouvert · ferme à 22h', address: '21 rue Saint-Augustin, 75002 Paris', lat: 48.8692, lng: 2.3372, tint: '#3d4a52', badges: ['Poisson du jour'], modes: ['livraison', 'emporter'], payments: ['card'], loyalty: { type: 'points', rate: '1 € = 1 pt', reward: '150 pts = 12 € offerts' }, referral: { sponsor: '5 € offerts', friend: '5 € offerts' }, isNew: true, minOrder: 20, budget: 3 },
    { id: 'burger', name: 'Maison Burger', cuisine: 'Burger artisanal', rating: 4.4, reviews: 891, distance: 0.7, eta: '15-25', fee: 0, promo: 'Menu midi 12,90 €', open: true, hours: 'Ouvert · ferme à 23h30', address: '64 rue Oberkampf, 75011 Paris', lat: 48.8659, lng: 2.3755, tint: '#7a4a1e', badges: ['Bœuf français', 'Végétarien'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'cash', 'paypal'], loyalty: { type: 'tampons', rate: '1 menu = 1 tampon', reward: '8 tampons = 1 burger offert' }, referral: { sponsor: '1 frite offerte', friend: '1 frite offerte' }, isNew: false, minOrder: 10, budget: 1 },
    { id: 'awa', name: 'Chez Awa', cuisine: 'Ouest-africain', rating: 4.9, reviews: 143, distance: 3.2, eta: '40-50', fee: 2.9, promo: null, open: true, hours: 'Ouvert · ferme à 22h', address: '17 rue Myrha, 75018 Paris', lat: 48.8871, lng: 2.3521, tint: '#8c5a1c', badges: ['Halal', 'Fait maison'], modes: ['livraison', 'emporter'], payments: ['card', 'cash'], loyalty: { type: 'points', rate: '1 € = 2 pts', reward: '200 pts = 10 € offerts' }, referral: { sponsor: '5 € offerts', friend: '5 € offerts' }, isNew: true, minOrder: 15, budget: 1 },
    { id: 'racines', name: 'Racines', cuisine: 'Végétarien', rating: 4.6, reviews: 98, distance: 1.1, eta: '25-35', fee: 1.5, promo: 'Bowl + dessert 16 €', open: true, hours: 'Ouvert · ferme à 21h30', address: '9 rue de Bretagne, 75003 Paris', lat: 48.8627, lng: 2.3626, tint: '#4d6b3a', badges: ['Végétarien', 'Végan', 'Sans gluten'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'wero'], loyalty: { type: 'cashback', rate: '4 % en cagnotte', reward: 'Utilisable dès 5 €' }, referral: { sponsor: '4 € offerts', friend: '4 € offerts' }, isNew: true, minOrder: 12, budget: 2 },
    { id: 'voltaire', name: 'Brasserie Voltaire', cuisine: 'Brasserie', rating: 4.3, reviews: 612, distance: 0.6, eta: '30-40', fee: 2, promo: null, open: true, hours: 'Ouvert · ferme à 00h', address: '3 boulevard Voltaire, 75011 Paris', lat: 48.8641, lng: 2.3660, tint: '#5a3a2e', badges: ['Terrasse'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'cash', 'virement'], loyalty: { type: 'points', rate: '1 € = 1 pt', reward: '120 pts = 10 € offerts' }, referral: { sponsor: '1 café offert', friend: '1 café offert' }, isNew: false, minOrder: 15, budget: 2 },
    { id: 'phobac', name: 'Phở Bắc', cuisine: 'Vietnamien', rating: 4.7, reviews: 388, distance: 2.6, eta: '—', fee: 2.5, promo: null, open: false, hours: 'Fermé · ouvre demain à 11h30', address: '44 avenue d\u2019Ivry, 75013 Paris', lat: 48.8236, lng: 2.3648, tint: '#3f5e4a', badges: ['Fait maison'], modes: ['livraison', 'emporter', 'surplace'], payments: ['card', 'cash'], loyalty: { type: 'points', rate: '1 € = 1 pt', reward: '100 pts = 8 € offerts' }, referral: { sponsor: '3 € offerts', friend: '3 € offerts' }, isNew: false, minOrder: 15, budget: 1 },
    { id: 'bonita', name: 'Bonita Taquería', cuisine: 'Mexicain', rating: 4.5, reviews: 256, distance: 1.5, eta: '20-30', fee: 1.9, promo: 'Taco Tuesday −2 €', open: true, hours: 'Ouvert · ferme à 23h', address: '28 rue de Lancry, 75010 Paris', lat: 48.8702, lng: 2.3620, tint: '#9a4a1a', badges: ['Épicé', 'Végétarien'], modes: ['livraison', 'emporter'], payments: ['card', 'paypal', 'cash'], loyalty: { type: 'tampons', rate: '1 commande = 1 tampon', reward: '6 tampons = 3 tacos offerts' }, referral: { sponsor: '1 guacamole offert', friend: '1 guacamole offert' }, isNew: false, minOrder: 12, budget: 1 }
  ],
  menu: {
    comptoir: [
      { cat: 'Entrées', items: [
        { id: 'oeufs', name: 'Œufs mayo revisités', desc: 'Œufs de plein air, mayonnaise au raifort, herbes fraîches.', price: 6.5, tags: ['végé', 'populaire'], allergens: ['œufs', 'moutarde'] },
        { id: 'velout', name: 'Velouté de butternut', desc: 'Butternut rôtie, noisettes torréfiées, huile de sauge.', price: 8, tags: ['végé', 'nouveau'], allergens: ['fruits à coque', 'lait'] },
        { id: 'terrine', name: 'Terrine de campagne', desc: 'Porc fermier, pistaches, pickles d’oignon rouge, pain grillé.', price: 9, tags: [], allergens: ['gluten', 'fruits à coque'] }
      ]},
      { cat: 'Plats', items: [
        { id: 'bavette', name: 'Bavette d’aloyau, frites maison', desc: 'Bœuf de race Limousine, échalotes confites, frites coupées à la main.', price: 19, tags: ['populaire'], allergens: [], customizable: true },
        { id: 'parmentier', name: 'Parmentier de canard confit', desc: 'Canard du Sud-Ouest, purée à l’huile de noix, salade de mâche.', price: 18, tags: [], allergens: ['lait', 'fruits à coque'] },
        { id: 'poisson', name: 'Poisson du jour, beurre blanc', desc: 'Selon la pêche du matin, légumes de saison glacés.', price: 22, tags: ['nouveau'], allergens: ['poisson', 'lait'] },
        { id: 'risotto', name: 'Risotto aux champignons', desc: 'Riz carnaroli, pleurotes et shiitakés, parmesan 24 mois.', price: 17, tags: ['végé'], allergens: ['lait'] }
      ]},
      { cat: 'Desserts', items: [
        { id: 'tatin', name: 'Tarte tatin, crème crue', desc: 'Pommes caramélisées au beurre demi-sel.', price: 8, tags: ['populaire'], allergens: ['gluten', 'lait'] },
        { id: 'mousse', name: 'Mousse au chocolat noir', desc: 'Chocolat 70 %, fleur de sel.', price: 7, tags: ['végé'], allergens: ['œufs', 'lait'] },
        { id: 'ile', name: 'Île flottante', desc: 'Crème anglaise à la vanille Bourbon, pralines roses.', price: 7.5, tags: [], allergens: ['œufs', 'lait'], soldOut: true }
      ]},
      { cat: 'Boissons', items: [
        { id: 'limonade', name: 'Limonade artisanale', desc: 'Citron de Menton, 33 cl.', price: 4, tags: ['végé'], allergens: [] },
        { id: 'vin', name: 'Verre de rouge — Côtes du Rhône', desc: 'Domaine Gramenon, 12 cl.', price: 6, tags: [], allergens: ['sulfites'] }
      ]}
    ]
  },
  customization: {
    bavette: {
      sizes: [{ id: 's200', label: '200 g', delta: 0 }, { id: 's300', label: '300 g', delta: 6 }],
      required: { label: 'Cuisson', options: [{ id: 'bleu', label: 'Bleu' }, { id: 'saignant', label: 'Saignant' }, { id: 'apoint', label: 'À point' }, { id: 'biencuit', label: 'Bien cuit' }] },
      extras: [{ id: 'bearnaise', label: 'Sauce béarnaise', delta: 1.5 }, { id: 'oeuf', label: 'Œuf au plat', delta: 1 }, { id: 'salade', label: 'Salade verte', delta: 2.5 }]
    }
  },
  reviews: {
    comptoir: [
      { author: 'Camille R.', date: 'il y a 3 jours', rating: 5, text: 'La bavette était parfaitement saignante et les frites croustillantes même après 20 minutes de livraison. On sent le fait maison.' },
      { author: 'Thomas B.', date: 'il y a 1 semaine', rating: 4, text: 'Très bon parmentier, portion généreuse. Petit bémol sur la tatin un peu trop sucrée à mon goût.' },
      { author: 'Inès M.', date: 'il y a 2 semaines', rating: 5, text: 'Commandé pour un déjeuner d’équipe, tout est arrivé chaud et dans les temps. Le risotto est une tuerie.' },
      { author: 'Julien P.', date: 'il y a 1 mois', rating: 4, text: 'Bonne adresse de quartier. Le programme de points est un vrai plus, j’ai déjà eu 10 € offerts.' }
    ]
  },
  events: {
    comptoir: [
      { title: 'Soirée accords vins & fromages', date: 'Jeu. 18 sept. · 19h30', desc: 'Cinq fromages fermiers, cinq vins nature, animée par notre sommelière.', price: 35, seats: '12 places restantes' },
      { title: 'Brunch du dimanche', date: 'Dim. 21 sept. · 11h–14h', desc: 'Formule à volonté, œufs bénédicte et pancakes maison.', price: 28, seats: 'Réservation conseillée' }
    ]
  },
  orders: [
    { id: 'K-48213', restaurant: 'Le Comptoir de Marie', date: '28 août', total: 45.5, items: 'Bavette 300 g, Risotto, 2 Tatin', status: 'Livrée' },
    { id: 'K-47102', restaurant: 'Napoli Segreta', date: '19 août', total: 27, items: 'Margherita, Diavola', status: 'Livrée' },
    { id: 'K-46390', restaurant: 'Beyrouth Cantine', date: '7 août', total: 32.8, items: 'Mezze pour 2, Falafel', status: 'Livrée' }
  ],
  addresses: [
    { label: 'Maison', line: '27 rue Keller, 75011 Paris', detail: 'Bât. B · 3e étage · code 1408' },
    { label: 'Bureau', line: '110 rue de Turenne, 75003 Paris', detail: 'Accueil au RDC' }
  ]
};
