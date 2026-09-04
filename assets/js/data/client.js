/**
 * Kenako — données du compte client
 * Avis, événements, historique, adresses, cartes de fidélité. Chaque carte
 * de fidélité appartient au restaurant : la plateforme n'en impose aucune.
 */

export const REVIEWS = {
  comptoir: [
    { author: 'Camille R.', date: 'il y a 3 jours', rating: 5, text: 'La bavette était parfaitement saignante et les frites croustillantes même après vingt minutes de livraison. On sent le fait maison.' },
    { author: 'Thomas B.', date: 'il y a 1 semaine', rating: 4, text: 'Très bon parmentier, portion généreuse. Petit bémol sur la tatin un peu trop sucrée à mon goût.' },
    { author: 'Inès M.', date: 'il y a 2 semaines', rating: 5, text: 'Commandé pour un déjeuner d’équipe : tout est arrivé chaud et dans les temps. Le risotto est une tuerie.' },
    { author: 'Marc D.', date: 'il y a 2 jours', rating: 2, text: 'Attente de 50 minutes un vendredi soir alors que l’application annonçait 30.', reply: 'Bonjour Marc, vous avez raison, ce vendredi nous a débordés. Nous avons resserré nos créneaux depuis. — Marie' },
    { author: 'Julien P.', date: 'il y a 1 mois', rating: 4, text: 'Bonne adresse de quartier. Le programme de points est un vrai plus, j’ai déjà eu 10 € offerts.' },
  ],
  napoli: [
    { author: 'Sarah T.', date: 'il y a 4 jours', rating: 5, text: 'La meilleure pâte du 10e, sans discussion. Le cornicione est aérien.' },
    { author: 'Nabil K.', date: 'il y a 1 semaine', rating: 5, text: 'Livraison rapide, pizza encore brûlante. La diavola pique juste ce qu’il faut.' },
  ],
  awa: [
    { author: 'Fatou D.', date: 'il y a 5 jours', rating: 5, text: 'Le thiéboudienne d’Awa, c’est celui de ma grand-mère. Rien à ajouter.' },
    { author: 'Élise F.', date: 'il y a 2 semaines', rating: 5, text: 'Portions généreuses, accueil chaleureux. Le mafé est parfait.' },
  ],
};

export const EVENTS = {
  comptoir: [
    { title: 'Soirée accords vins & fromages', date: 'Jeu. 18 sept. · 19h30', desc: 'Cinq fromages fermiers, cinq vins nature, animée par notre sommelière.', price: 35, seats: '12 places restantes', left: 12, total: 24 },
    { title: 'Brunch du dimanche', date: 'Dim. 21 sept. · 11h–14h', desc: 'Formule à volonté, œufs bénédicte et pancakes maison.', price: 28, seats: 'Réservation conseillée', left: 9, total: 40 },
  ],
  napoli: [
    { title: 'Atelier pâte napolitaine', date: 'Sam. 27 sept. · 15h', desc: 'Deux heures avec Gennaro, tablier et pâte à emporter.', price: 45, seats: '6 places restantes', left: 6, total: 12 },
  ],
};

export const PAST_ORDERS = [
  { id: 'K-48213', restId: 'comptoir', restaurant: 'Le Comptoir de Marie', date: '28 août', total: 45.5, items: 'Bavette 300 g, Risotto, 2 Tarte tatin', status: 'Livrée', points: 46 },
  { id: 'K-47102', restId: 'napoli', restaurant: 'Napoli Segreta', date: '19 août', total: 27, items: 'Margherita, Diavola', status: 'Livrée', points: 0, stamps: 2 },
  { id: 'K-46390', restId: 'beyrouth', restaurant: 'Beyrouth Cantine', date: '7 août', total: 32.8, items: 'Mezze pour deux, Falafels', status: 'Livrée', cashback: 1.64 },
  { id: 'K-45877', restId: 'burger', restaurant: 'Maison Burger', date: '24 juil.', total: 18.5, items: 'Le Classique, Frites fraîches', status: 'Annulée par le restaurant', refunded: true },
];

export const ADDRESSES = [
  { id: 'home', label: 'Maison', line: '27 rue Keller, 75011 Paris', detail: 'Bât. B · 3e étage · code 1408', lat: 48.8557, lng: 2.3776, def: true },
  { id: 'work', label: 'Bureau', line: '110 rue de Turenne, 75003 Paris', detail: 'Accueil au rez-de-chaussée', lat: 48.8639, lng: 2.3629, def: false },
];

export const LOYALTY_CARDS = [
  { restId: 'comptoir', type: 'points', value: 145, target: 200, label: '145 points', next: 'Encore 55 points pour 10 € offerts' },
  { restId: 'napoli', type: 'tampons', value: 7, target: 10, label: '7 tampons sur 10', next: 'Encore 3 pizzas pour une pizza offerte' },
  { restId: 'beyrouth', type: 'cashback', value: 8.2, target: 8.2, label: '8,20 € en cagnotte', next: 'Utilisable dès votre prochaine commande' },
];

/** Codes promo reconnus par le tunnel de commande (démonstration). */
export const PROMO_CODES = {
  BIENVENUE10: { kind: 'percent', value: 10, label: '−10 % sur la commande', min: 15 },
  MARIE5: { kind: 'amount', value: 5, label: '−5 € offerts', min: 30 },
  LIVRAISON0: { kind: 'shipping', value: 0, label: 'Livraison offerte', min: 20 },
};

/** Étapes de suivi d'une commande. */
export const TRACK_STEPS = [
  { id: 'received', label: 'Commande reçue', hint: 'Le restaurant a été prévenu', icon: '📥' },
  { id: 'accepted', label: 'Acceptée', hint: 'Marie a confirmé votre commande', icon: '👍' },
  { id: 'preparing', label: 'En préparation', hint: 'Ça chauffe en cuisine', icon: '🔥' },
  { id: 'ready', label: 'Prête', hint: 'Votre commande vous attend', icon: '🛎️' },
  { id: 'delivering', label: 'En livraison', hint: 'Karim est en route', icon: '🛵' },
  { id: 'done', label: 'Livrée', hint: 'Bon appétit !', icon: '🍽️' },
];

/** Créneaux horaires proposés à l'étape 1 du tunnel. */
export const SLOTS = ['Au plus vite', '12h30', '12h45', '13h00', '13h15', '19h30', '20h00', '20h30'];
