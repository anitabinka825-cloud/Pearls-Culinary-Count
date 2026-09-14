import { Product } from '../types';

/**
 * ============================================================================
 * STAGE 1 DEMO CATALOGUE
 * ============================================================================
 * Notice for Developers & Future Administrators:
 * The items, prices, specifications, lead times, and mock stock quantities
 * below represent demonstration data curated for Stage 1 frontend UI testing,
 * layout validation, and customer enquiry workflows.
 *
 * They do not imply officially confirmed inventory, final fixed prices, or
 * exhaustive catalog offerings for Pearls Culinary Counts.
 *
 * In a future stage (Stage 2 / Admin Activation), this demonstration data will
 * be replaced with real admin-managed product records stored in persistent
 * cloud storage (e.g. Firestore / Cloud SQL).
 * ============================================================================
 */
export const SAMPLE_PRODUCTS: Product[] = [
  // CAKES
  {
    id: 'prod-cake-01',
    name: 'Bespoke Celebration Floral Cake',
    description:
      'Multi-layered celebration cake with delicate handcrafted buttercream florals and smooth finish. Customized to your choice of flavor and occasion theme.',
    category: 'cakes',
    categoryName: 'Cakes',
    image:
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Handcrafted floral celebration cake with soft pastel icing',
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 350,
    priceFormatted: 'GH₵ 350.00',
    availability: 'made_to_order',
    madeToOrder: true,
    stockQuantity: 10,
    leadTime: '48 to 72 hours notice',
    servings: '12 – 30 portions',
    customizable: true,
    featured: true,
    tags: ['Custom Cake', 'Celebration', 'Floral Design'],
    specs: [
      { label: 'Servings', value: '12 – 30 portions' },
      { label: 'Notice Required', value: '48 to 72 hours' },
      { label: 'Lead Time', value: 'Bespoke design schedule' },
      { label: 'Fulfillment', value: 'Pickup or Accra delivery (confirmed upon enquiry)' },
    ],
  },
  {
    id: 'prod-cake-02',
    name: 'Signature Velvet Vanilla Tier Cake',
    description:
      'Fluffy Madagascar vanilla sponge layered with rich white chocolate cream and finished with subtle gold leaf touches for luxury events.',
    category: 'cakes',
    categoryName: 'Cakes',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Tiered white celebration cake with gold leaf and fresh decoration',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 650,
    priceFormatted: 'GH₵ 650.00',
    availability: 'made_to_order',
    madeToOrder: true,
    stockQuantity: 5,
    leadTime: '5 to 7 days notice',
    servings: '30 – 70 portions',
    customizable: true,
    featured: true,
    tags: ['Wedding', 'Tier Cake', 'Gold Accent'],
    specs: [
      { label: 'Tiers', value: '2 or 3 tier configurations' },
      { label: 'Notice Required', value: '5 to 7 days for wedding tiers' },
      { label: 'Flavour Choice', value: 'Vanilla, Chocolate, Red Velvet' },
    ],
  },
  {
    id: 'prod-cake-03',
    name: 'Gourmet Cupcake Assortment',
    description:
      'Box of artisan cupcakes in assorted flavors: Rich Chocolate Ganache, Salted Caramel, Red Velvet, and Strawberry Cream.',
    category: 'cakes',
    categoryName: 'Cakes',
    image:
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Assorted artisan cupcakes with decorative swirls in gift presentation',
    images: [
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 180,
    priceFormatted: 'GH₵ 180.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 20,
    leadTime: '24 hours notice',
    servings: 'Box of 6, 12, or 24',
    customizable: true,
    featured: false,
    tags: ['Cupcakes', 'Gift Box', 'Party Favors'],
    specs: [
      { label: 'Pack Size', value: 'Box of 6, 12, or 24' },
      { label: 'Notice Required', value: '24 hours' },
    ],
  },

  // PASTRIES
  {
    id: 'prod-pastry-01',
    name: 'Flaky Golden Meat & Savory Pies',
    description:
      'Traditional tender shortcrust pastry filled with seasoned minced beef, fragrant herbs, and slow-braised vegetables.',
    category: 'pastries',
    categoryName: 'Pastries',
    image:
      'https://images.unsplash.com/photo-1621236378699-8597fbfa9997?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Golden baked flaky meat pies fresh from the oven',
    images: [
      'https://images.unsplash.com/photo-1621236378699-8597fbfa9997?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 120,
    priceFormatted: 'GH₵ 120.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 25,
    leadTime: '24 hours notice',
    servings: 'Platter of 10 or 20 pies',
    customizable: false,
    featured: true,
    tags: ['Pastry', 'Savory', 'Ghanaian Favorite'],
    specs: [
      { label: 'Serving', value: 'Individual or Party Platters' },
      { label: 'Preparation', value: 'Baked fresh to order' },
    ],
  },
  {
    id: 'prod-pastry-02',
    name: 'Fruit Glazed Tartlets',
    description:
      'Buttery sweet sablé tart shells filled with creamy vanilla bean custard and topped with vibrant seasonal fruits.',
    category: 'pastries',
    categoryName: 'Pastries',
    image:
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Mini fruit tartlets with glazed berries and vanilla cream',
    images: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 150,
    priceFormatted: 'GH₵ 150.00',
    availability: 'made_to_order',
    madeToOrder: true,
    stockQuantity: 15,
    leadTime: '24 hours notice',
    servings: 'Box of 8 or 16',
    customizable: true,
    featured: false,
    tags: ['Sweet Pastries', 'Tarts', 'Dessert Tables'],
    specs: [
      { label: 'Pack Size', value: 'Box of 8 or 16' },
      { label: 'Notice Required', value: '24 hours' },
    ],
  },

  // BREAD
  {
    id: 'prod-bread-01',
    name: 'Artisan Sourdough & Country Loaf',
    description:
      'Naturally leavened artisan loaf with a caramelized blistered crust, open airy crumb, and subtle sourdough finish. Ideal for gourmet tables.',
    category: 'bread',
    categoryName: 'Bread',
    image:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Country artisan loaf sliced to reveal open airy interior',
    images: [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 45,
    priceFormatted: 'GH₵ 45.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 15,
    leadTime: 'Next day order',
    servings: 'Approx. 800g loaf',
    customizable: false,
    featured: true,
    tags: ['Artisan Loaf', 'Oven Fresh', 'Natural Leaven'],
    specs: [
      { label: 'Weight', value: 'Approx. 800g loaf' },
      { label: 'Baking Schedule', value: 'Baked to order' },
    ],
  },
  {
    id: 'prod-bread-02',
    name: 'Sweet Butter Brioche Loaf',
    description:
      'Tender, golden-glazed brioche baked with pure dairy butter for a cloud-like melt-in-the-mouth texture.',
    category: 'bread',
    categoryName: 'Bread',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Golden glazed butter brioche loaf and rolls',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 50,
    priceFormatted: 'GH₵ 50.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 12,
    leadTime: '24 hours notice',
    servings: 'Whole sliced loaf or buns',
    customizable: false,
    featured: false,
    tags: ['Brioche', 'Breakfast', 'Sweet Breads'],
    specs: [
      { label: 'Serving', value: 'Whole sliced loaf or buns' },
    ],
  },

  // FOOD
  {
    id: 'prod-food-01',
    name: 'Gourmet Jollof & Grilled Chicken Platter',
    description:
      'Slow-cooked signature Ghanaian Jollof rice infused with smoked tomato reduction, served alongside marinated grilled chicken, fried plantains, and pepper sauce.',
    category: 'food',
    categoryName: 'Food',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Gourmet prepared rice and grilled savory bowl',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 85,
    priceFormatted: 'GH₵ 85.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 30,
    leadTime: 'Order 3-4 hours ahead or advance booking',
    servings: 'Single meal, family bowl, or event chafing',
    customizable: true,
    featured: true,
    tags: ['Ghanaian Cuisine', 'Hot Food', 'Chef Specialty'],
    specs: [
      { label: 'Portion', value: 'Single meal, family bowl, or event chafing' },
      { label: 'Notice Required', value: 'Advance order recommended' },
    ],
  },
  {
    id: 'prod-food-02',
    name: 'Executive Continental Lunch Bowl',
    description:
      'Pan-seared herbed chicken breast or fish fillet served over seasoned fragrant rice, sautéed garden vegetables, and delicate citrus reduction.',
    category: 'food',
    categoryName: 'Food',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Healthy and flavorful executive lunch bowl',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 95,
    priceFormatted: 'GH₵ 95.00',
    availability: 'available_to_order',
    madeToOrder: true,
    stockQuantity: 20,
    leadTime: 'Advance order',
    servings: 'Individual lunch packaging',
    customizable: true,
    featured: false,
    tags: ['Continental', 'Executive Lunch', 'Healthy Option'],
    specs: [
      { label: 'Portion', value: 'Individual lunch packaging' },
    ],
  },

  // CATERING
  {
    id: 'prod-cat-01',
    name: 'Cocktail Canapé & Finger Food Buffet',
    description:
      'Curated cocktail service featuring bite-sized spring rolls, meat skewers, stuffed pastry puffs, mini slider bites, and signature dips for stylish gatherings.',
    category: 'catering',
    categoryName: 'Catering',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Upscale catering platter with assortment of finger foods and canapés',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 1200,
    priceFormatted: 'Custom Quote',
    availability: 'made_to_order',
    madeToOrder: true,
    stockQuantity: 5,
    leadTime: '3 to 5 days advance booking',
    servings: 'From 20 to 200+ guests',
    customizable: true,
    featured: true,
    tags: ['Event Catering', 'Canapés', 'Cocktails'],
    specs: [
      { label: 'Capacity', value: 'From 20 to 200+ guests' },
      { label: 'Service', value: 'Drop-off platters or full service setup' },
    ],
  },

  // TRAINING
  {
    id: 'prod-train-01',
    name: 'Professional Cake Artistry Masterclass',
    description:
      'Comprehensive hands-on course covering cake structural engineering, silky Swiss meringue buttercream, sharp edges, and delicate floral piping.',
    category: 'training',
    categoryName: 'Culinary Training',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Baking workshop participant learning cake finishing techniques',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 850,
    priceFormatted: 'GH₵ 850.00 / Cohort',
    availability: 'preorder',
    madeToOrder: false,
    stockQuantity: 8,
    leadTime: 'Registration open for upcoming cohort',
    servings: 'Intensive Practical Sessions',
    customizable: false,
    featured: true,
    tags: ['Masterclass', 'Cake Decorating', 'Baking Skills'],
    specs: [
      { label: 'Location', value: 'Accra Training Kitchen' },
      { label: 'Format', value: 'Small Group Hands-on Practice' },
      { label: 'Level', value: 'Beginner to Intermediate' },
    ],
  },

  // LIFESTYLE PRODUCTS (Bags, Jewellery, Perfumes, and Selected Lifestyle)
  {
    id: 'prod-life-01',
    name: 'Artisanal Structured Handbag',
    description:
      'Elegantly crafted structured handbag designed with refined textured finish, neat hardware, and a timeless silhouette for sophisticated everyday styling.',
    category: 'lifestyle',
    categoryName: 'Lifestyle Products',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Structured handbag in warm neutral tone',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 320,
    priceFormatted: 'GH₵ 320.00',
    availability: 'available_to_order',
    madeToOrder: false,
    stockQuantity: 10,
    leadTime: 'In stock / Available to order',
    servings: '1 Piece',
    customizable: false,
    featured: true,
    tags: ['Lifestyle', 'Bags', 'Accessories'],
    specs: [
      { label: 'Material', value: 'Textured craft material' },
      { label: 'Hardware', value: 'Gold-toned accents' },
    ],
  },
  {
    id: 'prod-life-02',
    name: 'Refined Pearl Accent Jewellery Set',
    description:
      'Delicate handcrafted jewellery pieces combining luminous pearls with minimal gold-toned chains, celebrating femininity and timeless grace.',
    category: 'lifestyle',
    categoryName: 'Lifestyle Products',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Fine jewellery necklace and earrings with pearl accents',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 240,
    priceFormatted: 'GH₵ 240.00',
    availability: 'available_to_order',
    madeToOrder: false,
    stockQuantity: 15,
    leadTime: 'In stock in Accra',
    servings: 'Set',
    customizable: false,
    featured: true,
    tags: ['Jewellery', 'Pearls', 'Elegance'],
    specs: [
      { label: 'Pieces', value: 'Necklace and matching earrings' },
      { label: 'Packaging', value: 'Signature Pearls keepsake box' },
    ],
  },
  {
    id: 'prod-life-03',
    name: 'Signature Luxe Eau de Parfum',
    description:
      'A warm, sophisticated fragrance harmonizing delicate floral notes, warm amber, and subtle citrus zest. Curated for the modern woman of elegance.',
    category: 'lifestyle',
    categoryName: 'Lifestyle Products',
    image:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Luxury perfume bottle with gold atomizer and warm ambient glow',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 280,
    priceFormatted: 'GH₵ 280.00',
    availability: 'available_to_order',
    madeToOrder: false,
    stockQuantity: 12,
    leadTime: 'In stock in Accra',
    servings: '50ml Bottle',
    customizable: false,
    featured: true,
    tags: ['Perfumes', 'Fragrance', 'Luxury'],
    specs: [
      { label: 'Volume', value: '50ml Eau de Parfum' },
      { label: 'Notes', value: 'Floral Amber & Citrus' },
    ],
  },
];

export const TRAINING_PROGRAMS = [
  {
    id: 'training-cake',
    title: 'Cake Training',
    category: 'Cake Training' as const,
    overview:
      'Learn the art of baking tall, moist cakes and mastering modern decorative mediums from flawless buttercream sharp edges to royal icing and floral craft.',
    highlights: [
      'Baking chemistry & recipe consistency',
      'Cake tier leveling, stacking & internal support',
      'Buttercream frosting, piping & palette knife art',
      'Fondant basics & decorative accents',
    ],
    suitableFor: 'Beginners & Home Bakers wanting professional precision',
    format: 'Intensive weekend or weekday masterclass options in Accra',
  },
  {
    id: 'training-pastry',
    title: 'Pastry Training',
    category: 'Pastry Training' as const,
    overview:
      'Dive into the world of flaky laminated doughs, delicate tart crusts, choux pastry, savory fillings, and pastry preparation methods.',
    highlights: [
      'Laminated puff pastry & croissant dough techniques',
      'Savory meat pie & samosa filling mastery',
      'Sweet fruit tarts & delicate mousses',
      'Pastry shelf-life and hygiene standards',
    ],
    suitableFor: 'Culinary enthusiasts & pastry business starters',
    format: 'Hands-on practical workshop with provided baking kits',
  },
  {
    id: 'training-food',
    title: 'Food Training',
    category: 'Food Training' as const,
    overview:
      'Practical training in Ghanaian cooking techniques, continental cuisine, sauce preparation, and event catering preparation.',
    highlights: [
      'Ghanaian Jollof & rice craft balancing flavor profiles',
      'Poultry, seafood & meat marination',
      'Event buffet plating, portioning & presentation',
      'Kitchen organization and workflows in Accra',
    ],
    suitableFor: 'Aspiring caterers, private cooks & food enthusiasts',
    format: 'Practical kitchen mentoring and culinary workflow sessions',
  },
];

export const ALL_PRODUCTS = SAMPLE_PRODUCTS;
