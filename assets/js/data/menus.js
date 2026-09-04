/**
 * Kenako — cartes des restaurants
 * `Le Comptoir de Marie` sert de fil rouge et dispose de la carte complète ;
 * les autres établissements ont une carte plus courte mais réelle, pour que
 * la navigation reste crédible sur n'importe quelle fiche.
 *
 * tags : vege | vegan | halal | sansgluten | epice | populaire | nouveau
 */

export const TAG_LABELS = {
  vege: 'Végétarien', vegan: 'Végan', halal: 'Halal', sansgluten: 'Sans gluten',
  epice: 'Épicé', populaire: 'Populaire', nouveau: 'Nouveau',
};
export const TAG_TONES = {
  vege: 'success', vegan: 'success', halal: 'info', sansgluten: 'info',
  epice: 'danger', populaire: 'accent', nouveau: 'primary',
};

/** Les 14 allergènes de la réglementation européenne. */
export const ALLERGENS_14 = [
  'Gluten', 'Crustacés', 'Œufs', 'Poisson', 'Arachides', 'Soja', 'Lait',
  'Fruits à coque', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites', 'Lupin', 'Mollusques',
];

export const MENUS = {
  comptoir: [
    {
      cat: 'Entrées',
      items: [
        { id: 'oeufs', name: 'Œufs mayo revisités', desc: 'Œufs de plein air, mayonnaise au raifort, herbes fraîches.', price: 6.5, tags: ['vege', 'populaire'], allergens: ['Œufs', 'Moutarde'] },
        { id: 'velout', name: 'Velouté de butternut', desc: 'Butternut rôtie, noisettes torréfiées, huile de sauge.', price: 8, tags: ['vege', 'nouveau'], allergens: ['Fruits à coque', 'Lait'] },
        { id: 'terrine', name: 'Terrine de campagne', desc: 'Porc fermier, pistaches, pickles d’oignon rouge, pain grillé.', price: 9, tags: [], allergens: ['Gluten', 'Fruits à coque'] },
      ],
    },
    {
      cat: 'Plats',
      items: [
        { id: 'bavette', name: 'Bavette d’aloyau, frites maison', desc: 'Bœuf de race Limousine, échalotes confites, frites coupées à la main.', price: 19, tags: ['populaire'], allergens: [], customizable: true },
        { id: 'parmentier', name: 'Parmentier de canard confit', desc: 'Canard du Sud-Ouest, purée à l’huile de noix, salade de mâche.', price: 18, tags: [], allergens: ['Lait', 'Fruits à coque'] },
        { id: 'poisson', name: 'Poisson du jour, beurre blanc', desc: 'Selon la pêche du matin, légumes de saison glacés.', price: 22, tags: ['nouveau'], allergens: ['Poisson', 'Lait'], soldOut: true },
        { id: 'risotto', name: 'Risotto aux champignons', desc: 'Riz carnaroli, pleurotes et shiitakés, parmesan 24 mois.', price: 17, tags: ['vege'], allergens: ['Lait'], customizable: true },
      ],
    },
    {
      cat: 'Desserts',
      items: [
        { id: 'tatin', name: 'Tarte tatin, crème crue', desc: 'Pommes caramélisées au beurre demi-sel.', price: 8, tags: ['populaire'], allergens: ['Gluten', 'Lait'] },
        { id: 'mousse', name: 'Mousse au chocolat noir', desc: 'Chocolat 70 %, fleur de sel.', price: 7, tags: ['vege'], allergens: ['Œufs', 'Lait'] },
        { id: 'ile', name: 'Île flottante', desc: 'Crème anglaise à la vanille Bourbon, pralines roses.', price: 7.5, tags: [], allergens: ['Œufs', 'Lait'], soldOut: true },
      ],
    },
    {
      cat: 'Boissons',
      items: [
        { id: 'limonade', name: 'Limonade artisanale', desc: 'Citron de Menton, 33 cl.', price: 4, tags: ['vege'], allergens: [] },
        { id: 'vin', name: 'Verre de rouge — Côtes du Rhône', desc: 'Domaine Gramenon, 12 cl.', price: 6, tags: [], allergens: ['Sulfites'] },
        { id: 'cafe', name: 'Café de spécialité', desc: 'Torréfaction Belleville, filtre ou expresso.', price: 2.8, tags: ['vege'], allergens: [] },
      ],
    },
  ],

  napoli: [
    {
      cat: 'Pizzas rouges',
      items: [
        { id: 'margherita', name: 'Margherita', desc: 'San Marzano, fior di latte, basilic, huile d’olive.', price: 11, tags: ['vege', 'populaire'], allergens: ['Gluten', 'Lait'], customizable: true },
        { id: 'diavola', name: 'Diavola', desc: 'Salame piccante de Calabre, mozzarella, origan.', price: 14, tags: ['epice'], allergens: ['Gluten', 'Lait'], customizable: true },
        { id: 'capricciosa', name: 'Capricciosa', desc: 'Jambon cuit, artichauts, champignons, olives Gaeta.', price: 15.5, tags: [], allergens: ['Gluten', 'Lait'] },
      ],
    },
    {
      cat: 'Pizzas blanches',
      items: [
        { id: 'tartufo', name: 'Tartufo', desc: 'Crème de truffe d’été, fior di latte, roquette.', price: 17, tags: ['vege', 'nouveau'], allergens: ['Gluten', 'Lait'] },
        { id: 'ortolana', name: 'Ortolana', desc: 'Légumes grillés du jour, pesto, stracciatella.', price: 15, tags: ['vege'], allergens: ['Gluten', 'Lait', 'Fruits à coque'] },
      ],
    },
    {
      cat: 'Dolci',
      items: [
        { id: 'tiramisu', name: 'Tiramisù della casa', desc: 'Mascarpone, café Napoli, cacao amer.', price: 7, tags: ['populaire'], allergens: ['Gluten', 'Œufs', 'Lait'] },
      ],
    },
  ],

  beyrouth: [
    {
      cat: 'Mezze',
      items: [
        { id: 'houmous', name: 'Houmous au tahini', desc: 'Pois chiches mixés minute, huile d’olive de Koura.', price: 6.5, tags: ['vege', 'vegan', 'halal'], allergens: ['Sésame'] },
        { id: 'falafel', name: 'Falafels (6 pièces)', desc: 'Fèves et pois chiches, sauce blanche à l’ail.', price: 8, tags: ['vegan', 'halal', 'populaire'], allergens: ['Sésame', 'Gluten'] },
        { id: 'taboule', name: 'Taboulé libanais', desc: 'Persil plat, menthe, boulgour fin, citron.', price: 7, tags: ['vegan', 'halal'], allergens: ['Gluten'] },
      ],
    },
    {
      cat: 'Grillades',
      items: [
        { id: 'chich', name: 'Chich taouk', desc: 'Poulet mariné au yaourt et sumac, riz vermicelle.', price: 16, tags: ['halal', 'populaire'], allergens: ['Lait'], customizable: true },
        { id: 'kafta', name: 'Kafta d’agneau', desc: 'Agneau haché, persil, oignon, sauce tahini.', price: 17.5, tags: ['halal'], allergens: ['Sésame'] },
      ],
    },
  ],

  hanabi: [
    {
      cat: 'Sushi & sashimi',
      items: [
        { id: 'chirashi', name: 'Chirashi du jour', desc: 'Riz vinaigré, poissons de criée selon arrivage.', price: 24, tags: ['populaire', 'sansgluten'], allergens: ['Poisson', 'Soja'] },
        { id: 'saumon', name: 'Sashimi saumon (8 pièces)', desc: 'Saumon d’Écosse label rouge, wasabi frais.', price: 16, tags: ['sansgluten'], allergens: ['Poisson'] },
      ],
    },
    {
      cat: 'Chauds',
      items: [
        { id: 'ramen', name: 'Ramen shoyu', desc: 'Bouillon de volaille 8 h, chashu, œuf mollet.', price: 17, tags: ['nouveau'], allergens: ['Gluten', 'Œufs', 'Soja'] },
        { id: 'gyoza', name: 'Gyoza maison (6 pièces)', desc: 'Porc et chou, poêlés à la vapeur.', price: 9, tags: [], allergens: ['Gluten', 'Soja'] },
      ],
    },
  ],

  burger: [
    {
      cat: 'Burgers',
      items: [
        { id: 'classic', name: 'Le Classique', desc: 'Bœuf 150 g, cheddar affiné, oignons confits, sauce maison.', price: 13.5, tags: ['populaire'], allergens: ['Gluten', 'Lait', 'Œufs'], customizable: true },
        { id: 'bleu', name: 'Le Bleu d’Auvergne', desc: 'Bœuf 150 g, bleu AOP, noix, roquette.', price: 15, tags: [], allergens: ['Gluten', 'Lait', 'Fruits à coque'] },
        { id: 'veggie', name: 'Le Potager', desc: 'Galette pois chiches-betterave, houmous, pickles.', price: 13, tags: ['vege', 'nouveau'], allergens: ['Gluten', 'Sésame'] },
      ],
    },
    {
      cat: 'À côté',
      items: [
        { id: 'frites', name: 'Frites fraîches', desc: 'Pommes bintje, double cuisson, fleur de sel.', price: 4.5, tags: ['vege', 'vegan'], allergens: [] },
        { id: 'milkshake', name: 'Milkshake vanille', desc: 'Glace artisanale, lait entier fermier.', price: 6, tags: ['vege'], allergens: ['Lait'] },
      ],
    },
  ],

  awa: [
    {
      cat: 'Plats',
      items: [
        { id: 'thieb', name: 'Thiéboudienne', desc: 'Riz au poisson, légumes mijotés six heures, sauce rouge.', price: 16, tags: ['halal', 'populaire'], allergens: ['Poisson'] },
        { id: 'mafe', name: 'Mafé de bœuf', desc: 'Sauce arachide onctueuse, riz basmati.', price: 15, tags: ['halal'], allergens: ['Arachides'] },
        { id: 'yassa', name: 'Poulet yassa', desc: 'Poulet mariné citron-oignon, riz blanc.', price: 14.5, tags: ['halal', 'epice'], allergens: ['Moutarde'] },
      ],
    },
    {
      cat: 'Boissons maison',
      items: [
        { id: 'bissap', name: 'Bissap', desc: 'Infusion d’hibiscus, menthe fraîche, 33 cl.', price: 3.5, tags: ['vegan', 'halal'], allergens: [] },
        { id: 'gingembre', name: 'Jus de gingembre', desc: 'Gingembre frais pressé, citron vert.', price: 3.5, tags: ['vegan', 'halal', 'epice'], allergens: [] },
      ],
    },
  ],

  racines: [
    {
      cat: 'Bowls',
      items: [
        { id: 'bowlaut', name: 'Bowl d’automne', desc: 'Courge rôtie, lentilles vertes, kale massé, tahini.', price: 14, tags: ['vegan', 'sansgluten', 'populaire'], allergens: ['Sésame'], customizable: true },
        { id: 'bowlcereal', name: 'Bowl céréales & feta', desc: 'Épeautre, feta AOP, herbes, grenade.', price: 13.5, tags: ['vege'], allergens: ['Gluten', 'Lait'] },
      ],
    },
    {
      cat: 'Douceurs',
      items: [
        { id: 'crumble', name: 'Crumble pomme-noisette', desc: 'Pommes de Normandie, avoine, sans sucre ajouté.', price: 6.5, tags: ['vege'], allergens: ['Gluten', 'Fruits à coque'] },
      ],
    },
  ],

  voltaire: [
    {
      cat: 'Classiques',
      items: [
        { id: 'croque', name: 'Croque-madame', desc: 'Pain de mie brioché, jambon blanc, béchamel, œuf.', price: 13, tags: ['populaire'], allergens: ['Gluten', 'Lait', 'Œufs'] },
        { id: 'tartare', name: 'Tartare de bœuf coupé au couteau', desc: 'Frites, salade verte, sauce à part.', price: 21, tags: [], allergens: ['Œufs', 'Moutarde'], customizable: true },
        { id: 'soupe', name: 'Soupe à l’oignon gratinée', desc: 'Bouillon maison, comté 12 mois.', price: 10, tags: ['vege'], allergens: ['Gluten', 'Lait'] },
      ],
    },
  ],

  phobac: [
    {
      cat: 'Phở',
      items: [
        { id: 'phobo', name: 'Phở bò', desc: 'Bouillon de bœuf 12 h, gîte, herbes fraîches.', price: 14, tags: ['populaire', 'sansgluten'], allergens: ['Soja'] },
        { id: 'phoga', name: 'Phở gà', desc: 'Bouillon de volaille, poulet fermier effiloché.', price: 13.5, tags: ['sansgluten'], allergens: ['Soja'] },
      ],
    },
    {
      cat: 'Entrées',
      items: [
        { id: 'nems', name: 'Nems maison (4 pièces)', desc: 'Porc, vermicelles, salade et menthe.', price: 8, tags: [], allergens: ['Gluten', 'Œufs', 'Soja'] },
      ],
    },
  ],

  bonita: [
    {
      cat: 'Tacos',
      items: [
        { id: 'pastor', name: 'Tacos al pastor (3 pièces)', desc: 'Porc mariné à l’achiote, ananas grillé, coriandre.', price: 12, tags: ['epice', 'populaire'], allergens: ['Gluten'] },
        { id: 'nopal', name: 'Tacos de nopal', desc: 'Cactus grillé, haricots noirs, salsa verde.', price: 11, tags: ['vegan'], allergens: [] },
      ],
    },
    {
      cat: 'À partager',
      items: [
        { id: 'guac', name: 'Guacamole & totopos', desc: 'Avocat écrasé minute, citron vert, chips de maïs.', price: 8.5, tags: ['vegan', 'sansgluten'], allergens: [] },
      ],
    },
  ],
};

/**
 * Groupes d'options par plat : taille, choix obligatoire, suppléments.
 * Les règles min/max sont respectées par la feuille de personnalisation.
 */
export const CUSTOMIZATIONS = {
  bavette: {
    sizes: [{ id: 's200', label: '200 g', delta: 0 }, { id: 's300', label: '300 g', delta: 6 }],
    required: { label: 'Cuisson', options: [{ id: 'bleu', label: 'Bleu' }, { id: 'saignant', label: 'Saignant' }, { id: 'apoint', label: 'À point' }, { id: 'biencuit', label: 'Bien cuit' }] },
    extras: { label: 'Suppléments', max: 3, options: [{ id: 'bearnaise', label: 'Sauce béarnaise', delta: 1.5 }, { id: 'oeuf', label: 'Œuf au plat', delta: 1 }, { id: 'salade', label: 'Salade verte', delta: 2.5 }] },
  },
  risotto: {
    required: { label: 'Portion', options: [{ id: 'normale', label: 'Portion normale' }, { id: 'grande', label: 'Grande portion (+3 €)', delta: 3 }] },
    extras: { label: 'Suppléments', max: 2, options: [{ id: 'truffe', label: 'Copeaux de truffe', delta: 4 }, { id: 'parmesan', label: 'Parmesan supplémentaire', delta: 1.5 }] },
  },
  margherita: {
    sizes: [{ id: 'p30', label: '30 cm', delta: 0 }, { id: 'p40', label: '40 cm', delta: 4 }],
    required: { label: 'Pâte', options: [{ id: 'classique', label: 'Classique' }, { id: 'integrale', label: 'Farine intégrale' }] },
    extras: { label: 'Suppléments', max: 4, options: [{ id: 'burrata', label: 'Burrata', delta: 3.5 }, { id: 'basilic', label: 'Basilic frais', delta: 0.5 }, { id: 'nduja', label: 'Nduja piquante', delta: 2 }] },
  },
  diavola: {
    sizes: [{ id: 'p30', label: '30 cm', delta: 0 }, { id: 'p40', label: '40 cm', delta: 4 }],
    extras: { label: 'Suppléments', max: 3, options: [{ id: 'burrata', label: 'Burrata', delta: 3.5 }, { id: 'miel', label: 'Miel de châtaignier', delta: 1 }] },
  },
  chich: {
    required: { label: 'Accompagnement', options: [{ id: 'riz', label: 'Riz vermicelle' }, { id: 'frites', label: 'Frites maison' }, { id: 'salade', label: 'Salade fattouche' }] },
    extras: { label: 'Sauces', max: 2, options: [{ id: 'toum', label: 'Toum (crème d’ail)', delta: 1 }, { id: 'harissa', label: 'Harissa maison', delta: 0.8 }] },
  },
  classic: {
    sizes: [{ id: 'simple', label: 'Simple steak', delta: 0 }, { id: 'double', label: 'Double steak', delta: 4 }],
    required: { label: 'Cuisson', options: [{ id: 'saignant', label: 'Saignant' }, { id: 'apoint', label: 'À point' }, { id: 'biencuit', label: 'Bien cuit' }] },
    extras: { label: 'Suppléments', max: 4, options: [{ id: 'bacon', label: 'Bacon fumé', delta: 2 }, { id: 'cheddar', label: 'Cheddar supplémentaire', delta: 1.5 }, { id: 'frites', label: 'Frites fraîches', delta: 4 }] },
  },
  bowlaut: {
    required: { label: 'Base', options: [{ id: 'quinoa', label: 'Quinoa' }, { id: 'epeautre', label: 'Épeautre' }, { id: 'salade', label: 'Jeunes pousses' }] },
    extras: { label: 'Ajouts', max: 3, options: [{ id: 'avocat', label: 'Avocat', delta: 2 }, { id: 'feta', label: 'Feta AOP', delta: 2 }, { id: 'graines', label: 'Graines torréfiées', delta: 1 }] },
  },
  tartare: {
    required: { label: 'Assaisonnement', options: [{ id: 'prepare', label: 'Préparé par le chef' }, { id: 'apart', label: 'Sauce à part' }] },
    extras: { label: 'Suppléments', max: 2, options: [{ id: 'oeuf', label: 'Jaune d’œuf supplémentaire', delta: 1 }, { id: 'salade', label: 'Salade verte', delta: 2.5 }] },
  },
};

/** Formules composées, mises en avant sur la fiche restaurant. */
export const COMBOS = {
  comptoir: [
    { id: 'formule-midi', name: 'Formule déjeuner', desc: 'Entrée + plat ou plat + dessert, du mardi au vendredi midi.', price: 23, saving: 4 },
    { id: 'formule-complete', name: 'Menu complet', desc: 'Entrée + plat + dessert, tous les soirs.', price: 32, saving: 5 },
  ],
  burger: [{ id: 'menu-midi', name: 'Menu midi', desc: 'Burger + frites + boisson, en semaine avant 15 h.', price: 12.9, saving: 5.1 }],
  racines: [{ id: 'bowl-dessert', name: 'Bowl + dessert', desc: 'Le bowl du jour et sa douceur maison.', price: 16, saving: 4.5 }],
};

/** Toutes les cartes à plat, pour la recherche par plat. */
export function allDishes() {
  return Object.entries(MENUS).flatMap(([restId, cats]) =>
    cats.flatMap((c) => c.items.map((item) => ({ ...item, restId, cat: c.cat })))
  );
}

export function findDish(restId, dishId) {
  const cats = MENUS[restId] || [];
  for (const cat of cats) {
    const item = cat.items.find((d) => d.id === dishId);
    if (item) return { ...item, cat: cat.cat, restId };
  }
  return null;
}
