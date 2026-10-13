import { Product } from '../types';

/**
 * ============================================================================
 * STAGE 2A SAMPLE CATALOGUE DATA
 * ============================================================================
 * Notice for Developers & Future Administrators:
 * Stage 2A sample catalogue data is for frontend development and testing.
 * It will later be replaced by real products managed through the Admin
 * Dashboard and backend.
 *
 * Current Stage 2A sample data includes realistic pricing types (FIXED_PRICE,
 * FROM_PRICE, PRICE_ON_ENQUIRY, VARIANT_PRICING), options & variants,
 * subcategories, availability states, and demo specifications.
 * ============================================================================
 */
export const SAMPLE_PRODUCTS: Product[] = [
  // ==========================================
  // CAKES
  // ==========================================
  {
    id: 'prod-cake-01',
    slug: 'bespoke-celebration-floral-cake',
    name: 'Bespoke Celebration Floral Cake',
    shortDescription:
      'Multi-layered celebration cake with delicate handcrafted buttercream florals and smooth finish.',
    description:
      'Multi-layered celebration cake with delicate handcrafted buttercream florals and smooth finish. Customized to your choice of flavor and occasion theme in Accra.',
    categoryId: 'cakes',
    subcategoryId: 'sub-custom-cakes',
    categoryName: 'Cakes',
    category: 'cakes',
    image:
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Handcrafted floral celebration cake with soft pastel icing',
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 350,
    priceNumeric: 350,
    priceFormatted: 'GH₵ 350.00',
    compareAtPrice: 380,
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'MADE_TO_ORDER',
    stockQuantity: 10,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: true,
    tags: ['Custom Cake', 'Celebration', 'Floral Design', 'Birthday'],
    specifications: [
      { label: 'Portions', value: '8 – 25 servings (based on size)' },
      { label: 'Notice Required', value: '48 to 72 hours' },
      { label: 'Lead Time', value: '48 to 72 hours notice' },
      { label: 'Fulfillment', value: 'Pickup or Accra delivery (confirmed upon enquiry)' },
    ],
    specs: [
      { label: 'Portions', value: '8 – 25 servings (based on size)' },
      { label: 'Notice Required', value: '48 to 72 hours' },
      { label: 'Lead Time', value: '48 to 72 hours notice' },
      { label: 'Fulfillment', value: 'Pickup or Accra delivery (confirmed upon enquiry)' },
    ],
    leadTime: '48 to 72 hours notice',
    servings: '8 – 25 servings',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 5,
    options: [
      {
        id: 'opt-cake-size',
        name: 'Size',
        values: [
          '6 inch (serves 8-10)',
          '8 inch (serves 12-16)',
          '10 inch (serves 20-25)',
        ],
      },
      {
        id: 'opt-cake-flavour',
        name: 'Flavour',
        values: ['Vanilla Bean', 'Rich Chocolate', 'Red Velvet', 'Strawberry Swirl'],
      },
      {
        id: 'opt-cake-filling',
        name: 'Filling',
        values: ['Silky Vanilla Buttercream', 'White Chocolate Cream', 'Salted Caramel'],
      },
    ],
    variants: [
      {
        id: 'var-cake-01-6in',
        sku: 'PCC-CK-6IN',
        title: '6 inch (serves 8-10) / Vanilla Bean',
        optionValues: {
          Size: '6 inch (serves 8-10)',
          Flavour: 'Vanilla Bean',
          Filling: 'Silky Vanilla Buttercream',
        },
        price: 350,
        compareAtPrice: 380,
        availability: 'MADE_TO_ORDER',
        isDefault: true,
      },
      {
        id: 'var-cake-01-8in',
        sku: 'PCC-CK-8IN',
        title: '8 inch (serves 12-16) / Vanilla Bean',
        optionValues: {
          Size: '8 inch (serves 12-16)',
          Flavour: 'Vanilla Bean',
          Filling: 'Silky Vanilla Buttercream',
        },
        price: 450,
        availability: 'MADE_TO_ORDER',
      },
      {
        id: 'var-cake-01-10in',
        sku: 'PCC-CK-10IN',
        title: '10 inch (serves 20-25) / Vanilla Bean',
        optionValues: {
          Size: '10 inch (serves 20-25)',
          Flavour: 'Vanilla Bean',
          Filling: 'Silky Vanilla Buttercream',
        },
        price: 580,
        availability: 'MADE_TO_ORDER',
      },
    ],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T15:00:00Z',
  },
  {
    id: 'prod-cake-02',
    slug: 'signature-velvet-vanilla-tier-cake',
    name: 'Signature Velvet Vanilla Tier Cake',
    shortDescription:
      'Fluffy Madagascar vanilla sponge layered with rich white chocolate cream and finished with subtle gold touches.',
    description:
      'Fluffy Madagascar vanilla sponge layered with rich white chocolate cream and finished with subtle gold leaf touches for weddings, anniversaries, and milestone events in Accra.',
    categoryId: 'cakes',
    subcategoryId: 'sub-wedding-cakes',
    categoryName: 'Cakes',
    category: 'cakes',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Tiered white celebration cake with gold leaf and fresh decoration',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 650,
    priceNumeric: 650,
    priceFormatted: 'GH₵ 650.00',
    compareAtPrice: 720,
    currency: 'GH₵',
    pricingType: 'FROM_PRICE',
    availability: 'MADE_TO_ORDER',
    stockQuantity: 5,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: true,
    tags: ['Wedding', 'Tier Cake', 'Gold Accent', 'Anniversary'],
    specifications: [
      { label: 'Tiers', value: '2 or 3 tier configurations' },
      { label: 'Notice Required', value: '5 to 7 days for tiered designs' },
      { label: 'Flavour Choice', value: 'Vanilla, Chocolate, Red Velvet' },
      { label: 'Delivery', value: 'Carefully coordinated delivery in Accra' },
    ],
    specs: [
      { label: 'Tiers', value: '2 or 3 tier configurations' },
      { label: 'Notice Required', value: '5 to 7 days for tiered designs' },
      { label: 'Flavour Choice', value: 'Vanilla, Chocolate, Red Velvet' },
    ],
    leadTime: '5 to 7 days notice',
    servings: '30 – 70 portions',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 2,
    options: [
      {
        id: 'opt-tiers',
        name: 'Number of Tiers',
        values: ['2 Tiers (serves 30-40)', '3 Tiers (serves 50-70)'],
      },
      {
        id: 'opt-tier-flavour',
        name: 'Flavour',
        values: ['Madagascar Vanilla', 'Chocolate Fudge', 'Red Velvet'],
      },
    ],
    variants: [
      {
        id: 'var-tier-2',
        sku: 'PCC-TIER-2T',
        title: '2 Tiers (serves 30-40)',
        optionValues: {
          'Number of Tiers': '2 Tiers (serves 30-40)',
          Flavour: 'Madagascar Vanilla',
        },
        price: 650,
        compareAtPrice: 720,
        availability: 'MADE_TO_ORDER',
        isDefault: true,
      },
      {
        id: 'var-tier-3',
        sku: 'PCC-TIER-3T',
        title: '3 Tiers (serves 50-70)',
        optionValues: {
          'Number of Tiers': '3 Tiers (serves 50-70)',
          Flavour: 'Madagascar Vanilla',
        },
        price: 950,
        availability: 'MADE_TO_ORDER',
      },
    ],
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-03-02T12:00:00Z',
  },
  {
    id: 'prod-cake-03',
    slug: 'gourmet-cupcake-assortment',
    name: 'Gourmet Cupcake Assortment',
    shortDescription:
      'Box of artisan cupcakes in assorted flavors with decorative buttercream swirls in gift presentation.',
    description:
      'Box of artisan cupcakes in assorted flavors: Rich Chocolate Ganache, Salted Caramel, Red Velvet, and Strawberry Cream. Ideal for gifting, tea parties, and party treats.',
    categoryId: 'cakes',
    subcategoryId: 'sub-cupcakes',
    categoryName: 'Cakes',
    category: 'cakes',
    image:
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Assorted artisan cupcakes with decorative swirls in gift presentation',
    images: [
      'https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 90,
    priceNumeric: 90,
    priceFormatted: 'GH₵ 90.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 20,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: false,
    tags: ['Cupcakes', 'Gift Box', 'Party Favors', 'Assortment'],
    specifications: [
      { label: 'Pack Sizes', value: 'Box of 6, 12, or 24' },
      { label: 'Notice Required', value: '24 hours notice' },
      { label: 'Packaging', value: 'Window gift box with ribbon' },
    ],
    specs: [
      { label: 'Pack Size', value: 'Box of 6, 12, or 24' },
      { label: 'Notice Required', value: '24 hours notice' },
    ],
    leadTime: '24 hours notice',
    servings: 'Box of 6, 12, or 24',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 10,
    options: [
      {
        id: 'opt-cupcake-qty',
        name: 'Quantity',
        values: ['Box of 6 Cupcakes', 'Box of 12 Cupcakes', 'Box of 24 Cupcakes'],
      },
      {
        id: 'opt-cupcake-flavor',
        name: 'Flavour Mix',
        values: ['Assorted Signature Flavours', 'All Red Velvet', 'All Chocolate Ganache'],
      },
    ],
    variants: [
      {
        id: 'var-cup-6',
        sku: 'PCC-CUP-6',
        title: 'Box of 6 Cupcakes / Assorted',
        optionValues: {
          Quantity: 'Box of 6 Cupcakes',
          'Flavour Mix': 'Assorted Signature Flavours',
        },
        price: 90,
        availability: 'AVAILABLE_ON_ENQUIRY',
        isDefault: true,
      },
      {
        id: 'var-cup-12',
        sku: 'PCC-CUP-12',
        title: 'Box of 12 Cupcakes / Assorted',
        optionValues: {
          Quantity: 'Box of 12 Cupcakes',
          'Flavour Mix': 'Assorted Signature Flavours',
        },
        price: 170,
        compareAtPrice: 180,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
      {
        id: 'var-cup-24',
        sku: 'PCC-CUP-24',
        title: 'Box of 24 Cupcakes / Assorted',
        optionValues: {
          Quantity: 'Box of 24 Cupcakes',
          'Flavour Mix': 'Assorted Signature Flavours',
        },
        price: 320,
        compareAtPrice: 350,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
    ],
    createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-03-03T11:00:00Z',
  },

  // ==========================================
  // PASTRIES
  // ==========================================
  {
    id: 'prod-pastry-01',
    slug: 'flaky-golden-meat-pies',
    name: 'Flaky Golden Meat & Savory Pies',
    shortDescription:
      'Traditional tender shortcrust pastry filled with seasoned minced beef, fragrant herbs, and slow-braised vegetables.',
    description:
      'Traditional tender shortcrust pastry filled with seasoned minced beef, fragrant herbs, and slow-braised vegetables. Freshly baked to order for snacks, parties, and office meetings.',
    categoryId: 'pastries',
    subcategoryId: 'sub-pies',
    categoryName: 'Pastries',
    category: 'pastries',
    image:
      'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Golden baked flaky meat pies fresh from the oven',
    images: [
      'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 60,
    priceNumeric: 60,
    priceFormatted: 'GH₵ 60.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 25,
    trackInventory: false,
    madeToOrder: true,
    customizable: false,
    featured: true,
    tags: ['Pastry', 'Savory', 'Meat Pie', 'Ghanaian Favorite'],
    specifications: [
      { label: 'Serving', value: 'Pack of 5, 10, or 20 pies' },
      { label: 'Preparation', value: 'Baked fresh to order' },
      { label: 'Notice Required', value: '24 hours notice' },
    ],
    specs: [
      { label: 'Serving', value: 'Pack of 5, 10, or 20 pies' },
      { label: 'Preparation', value: 'Baked fresh to order' },
    ],
    leadTime: '24 hours notice',
    servings: 'Pack of 5, 10, or 20 pies',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 20,
    options: [
      {
        id: 'opt-pie-filling',
        name: 'Filling',
        values: ['Seasoned Minced Beef', 'Spiced Chicken', 'Vegetable Herb'],
      },
      {
        id: 'opt-pie-qty',
        name: 'Quantity',
        values: ['Pack of 5 Pies', 'Party Platter of 10', 'Event Box of 20'],
      },
    ],
    variants: [
      {
        id: 'var-pie-5',
        sku: 'PCC-PIE-5',
        title: 'Pack of 5 Pies / Beef',
        optionValues: {
          Filling: 'Seasoned Minced Beef',
          Quantity: 'Pack of 5 Pies',
        },
        price: 60,
        availability: 'AVAILABLE_ON_ENQUIRY',
        isDefault: true,
      },
      {
        id: 'var-pie-10',
        sku: 'PCC-PIE-10',
        title: 'Party Platter of 10 / Beef',
        optionValues: {
          Filling: 'Seasoned Minced Beef',
          Quantity: 'Party Platter of 10',
        },
        price: 115,
        compareAtPrice: 120,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
      {
        id: 'var-pie-20',
        sku: 'PCC-PIE-20',
        title: 'Event Box of 20 / Beef',
        optionValues: {
          Filling: 'Seasoned Minced Beef',
          Quantity: 'Event Box of 20',
        },
        price: 220,
        compareAtPrice: 240,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
    ],
    createdAt: '2026-02-15T08:30:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
  },
  {
    id: 'prod-pastry-02',
    slug: 'fruit-glazed-tartlets',
    name: 'Fruit Glazed Tartlets',
    shortDescription:
      'Buttery sweet sablé tart shells filled with creamy vanilla bean custard and topped with seasonal fruits.',
    description:
      'Buttery sweet sablé tart shells filled with creamy vanilla bean custard and topped with vibrant seasonal fruits. A refined addition to dessert spreads and private gatherings.',
    categoryId: 'pastries',
    subcategoryId: 'sub-sweet-pastries',
    categoryName: 'Pastries',
    category: 'pastries',
    image:
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Mini fruit tartlets with glazed berries and vanilla cream',
    images: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 80,
    priceNumeric: 80,
    priceFormatted: 'GH₵ 80.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'MADE_TO_ORDER',
    stockQuantity: 15,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: false,
    tags: ['Sweet Pastries', 'Tarts', 'Dessert Tables', 'Glazed Fruit'],
    specifications: [
      { label: 'Pack Size', value: 'Box of 4, 8, or 16' },
      { label: 'Notice Required', value: '24 hours notice' },
      { label: 'Storage', value: 'Keep chilled until serving' },
    ],
    specs: [
      { label: 'Pack Size', value: 'Box of 4, 8, or 16' },
      { label: 'Notice Required', value: '24 hours notice' },
    ],
    leadTime: '24 hours notice',
    servings: 'Box of 4, 8, or 16',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 8,
    options: [
      {
        id: 'opt-tart-qty',
        name: 'Quantity',
        values: ['Box of 4 Tartlets', 'Box of 8 Tartlets', 'Box of 16 Tartlets'],
      },
    ],
    variants: [
      {
        id: 'var-tart-4',
        sku: 'PCC-TRT-4',
        title: 'Box of 4 Tartlets',
        optionValues: { Quantity: 'Box of 4 Tartlets' },
        price: 80,
        availability: 'MADE_TO_ORDER',
        isDefault: true,
      },
      {
        id: 'var-tart-8',
        sku: 'PCC-TRT-8',
        title: 'Box of 8 Tartlets',
        optionValues: { Quantity: 'Box of 8 Tartlets' },
        price: 150,
        availability: 'MADE_TO_ORDER',
      },
      {
        id: 'var-tart-16',
        sku: 'PCC-TRT-16',
        title: 'Box of 16 Tartlets',
        optionValues: { Quantity: 'Box of 16 Tartlets' },
        price: 280,
        availability: 'MADE_TO_ORDER',
      },
    ],
    createdAt: '2026-02-16T11:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },

  // ==========================================
  // BREAD
  // ==========================================
  {
    id: 'prod-bread-01',
    slug: 'artisan-sourdough-country-loaf',
    name: 'Artisan Sourdough & Country Loaf',
    shortDescription:
      'Naturally leavened artisan loaf with a caramelized blistered crust and open airy crumb.',
    description:
      'Naturally leavened artisan loaf with a caramelized blistered crust, open airy crumb, and subtle sourdough finish. Ideal for gourmet tables, toast, and artisan sandwiches.',
    categoryId: 'bread',
    subcategoryId: 'sub-artisanal-loaves',
    categoryName: 'Bread',
    category: 'bread',
    image:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Country artisan loaf sliced to reveal open airy interior',
    images: [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 45,
    priceNumeric: 45,
    priceFormatted: 'GH₵ 45.00',
    currency: 'GH₵',
    pricingType: 'FIXED_PRICE',
    availability: 'IN_STOCK',
    stockQuantity: 15,
    trackInventory: false,
    madeToOrder: true,
    customizable: false,
    featured: true,
    tags: ['Artisan Loaf', 'Oven Fresh', 'Natural Leaven', 'Sourdough'],
    specifications: [
      { label: 'Weight', value: 'Approx. 800g loaf' },
      { label: 'Baking Schedule', value: 'Baked fresh to order' },
      { label: 'Ingredients', value: 'Unbleached flour, water, natural starter, sea salt' },
    ],
    specs: [
      { label: 'Weight', value: 'Approx. 800g loaf' },
      { label: 'Baking Schedule', value: 'Baked to order' },
    ],
    leadTime: 'Next day delivery/pickup in Accra',
    servings: 'Approx. 800g loaf',
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 10,
    createdAt: '2026-02-18T07:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z',
  },
  {
    id: 'prod-bread-02',
    slug: 'sweet-butter-brioche-loaf',
    name: 'Sweet Butter Brioche Loaf',
    shortDescription:
      'Tender, golden-glazed brioche baked with pure dairy butter for a tender melt-in-the-mouth texture.',
    description:
      'Tender, golden-glazed brioche baked with pure dairy butter for a cloud-like melt-in-the-mouth texture. Prepared as a full sliced loaf or pack of golden individual buns.',
    categoryId: 'bread',
    subcategoryId: 'sub-brioche-rolls',
    categoryName: 'Bread',
    category: 'bread',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Golden glazed butter brioche loaf and rolls',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 50,
    priceNumeric: 50,
    priceFormatted: 'GH₵ 50.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 12,
    trackInventory: false,
    madeToOrder: true,
    customizable: false,
    featured: false,
    tags: ['Brioche', 'Breakfast', 'Sweet Breads', 'Pure Butter'],
    specifications: [
      { label: 'Serving', value: 'Whole sliced loaf (approx 700g) or pack of 6 buns' },
      { label: 'Notice Required', value: '24 hours notice' },
    ],
    specs: [
      { label: 'Serving', value: 'Whole sliced loaf or buns' },
    ],
    leadTime: '24 hours notice',
    servings: 'Whole sliced loaf or buns',
    options: [
      {
        id: 'opt-brioche-fmt',
        name: 'Format',
        values: ['Whole Sliced Loaf (approx 700g)', 'Pack of 6 Brioche Buns'],
      },
    ],
    variants: [
      {
        id: 'var-br-loaf',
        sku: 'PCC-BR-LF',
        title: 'Whole Sliced Loaf (approx 700g)',
        optionValues: { Format: 'Whole Sliced Loaf (approx 700g)' },
        price: 50,
        availability: 'AVAILABLE_ON_ENQUIRY',
        isDefault: true,
      },
      {
        id: 'var-br-buns',
        sku: 'PCC-BR-BUNS',
        title: 'Pack of 6 Brioche Buns',
        optionValues: { Format: 'Pack of 6 Brioche Buns' },
        price: 55,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
    ],
    createdAt: '2026-02-19T07:30:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
  },

  // ==========================================
  // FOOD
  // ==========================================
  {
    id: 'prod-food-01',
    slug: 'gourmet-jollof-grilled-chicken-platter',
    name: 'Gourmet Jollof & Grilled Chicken Platter',
    shortDescription:
      'Slow-cooked signature Ghanaian Jollof rice served alongside marinated grilled chicken, plantains, and sauce.',
    description:
      'Slow-cooked signature Ghanaian Jollof rice infused with smoked tomato reduction, served alongside marinated grilled chicken, fried sweet plantains, and savory pepper sauce.',
    categoryId: 'food',
    subcategoryId: 'sub-rice-dishes',
    categoryName: 'Food',
    category: 'food',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Gourmet prepared rice and grilled savory bowl',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 85,
    priceNumeric: 85,
    priceFormatted: 'GH₵ 85.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 30,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: true,
    tags: ['Ghanaian Cuisine', 'Hot Food', 'Jollof', 'Chef Specialty'],
    specifications: [
      { label: 'Portion', value: 'Single meal, family bowl, or event chafing' },
      { label: 'Notice Required', value: 'Order 3-4 hours ahead or advance booking' },
      { label: 'Sides Included', value: 'Fried plantain, green sauce, shito' },
    ],
    specs: [
      { label: 'Portion', value: 'Single meal, family bowl, or event chafing' },
      { label: 'Notice Required', value: 'Advance order recommended' },
    ],
    leadTime: 'Order 3-4 hours ahead or advance booking',
    servings: 'Single meal, family bowl, or event chafing',
    options: [
      {
        id: 'opt-jollof-portion',
        name: 'Portion Size',
        values: [
          'Single Executive Plate',
          'Family Sharing Bowl (serves 4-5)',
          'Mini Chafing Dish (serves 10-12)',
        ],
      },
      {
        id: 'opt-jollof-protein',
        name: 'Protein Option',
        values: [
          'Grilled Seasoned Chicken',
          'Spiced Fish Fillet',
          'Slow-Braised Tender Beef',
        ],
      },
      {
        id: 'opt-jollof-spice',
        name: 'Spice Preference',
        values: ['Mild / Savory', 'Traditional Medium Heat', 'Extra Spicy Shito'],
      },
    ],
    variants: [
      {
        id: 'var-jollof-single',
        sku: 'PCC-JOL-SGL',
        title: 'Single Executive Plate / Grilled Chicken',
        optionValues: {
          'Portion Size': 'Single Executive Plate',
          'Protein Option': 'Grilled Seasoned Chicken',
          'Spice Preference': 'Traditional Medium Heat',
        },
        price: 85,
        availability: 'AVAILABLE_ON_ENQUIRY',
        isDefault: true,
      },
      {
        id: 'var-jollof-fam',
        sku: 'PCC-JOL-FAM',
        title: 'Family Sharing Bowl (serves 4-5) / Grilled Chicken',
        optionValues: {
          'Portion Size': 'Family Sharing Bowl (serves 4-5)',
          'Protein Option': 'Grilled Seasoned Chicken',
          'Spice Preference': 'Traditional Medium Heat',
        },
        price: 320,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
      {
        id: 'var-jollof-chafing',
        sku: 'PCC-JOL-CHF',
        title: 'Mini Chafing Dish (serves 10-12) / Grilled Chicken',
        optionValues: {
          'Portion Size': 'Mini Chafing Dish (serves 10-12)',
          'Protein Option': 'Grilled Seasoned Chicken',
          'Spice Preference': 'Traditional Medium Heat',
        },
        price: 750,
        availability: 'AVAILABLE_ON_ENQUIRY',
      },
    ],
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-03-06T14:00:00Z',
  },
  {
    id: 'prod-food-02',
    slug: 'executive-continental-lunch-bowl',
    name: 'Executive Continental Lunch Bowl',
    shortDescription:
      'Pan-seared herbed chicken breast or fish fillet served over fragrant rice with garden vegetables.',
    description:
      'Pan-seared herbed chicken breast or fish fillet served over seasoned fragrant rice, sautéed garden vegetables, and delicate citrus reduction. Designed for executive luncheons.',
    categoryId: 'food',
    subcategoryId: 'sub-continental',
    categoryName: 'Food',
    category: 'food',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Healthy and flavorful executive lunch bowl',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 95,
    priceNumeric: 95,
    priceFormatted: 'GH₵ 95.00',
    compareAtPrice: 105,
    currency: 'GH₵',
    pricingType: 'FIXED_PRICE',
    availability: 'IN_STOCK',
    stockQuantity: 20,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: false,
    tags: ['Continental', 'Executive Lunch', 'Healthy Option', 'Fresh Veggies'],
    specifications: [
      { label: 'Portion', value: 'Individual lunch packaging with cutlery' },
      { label: 'Advance Notice', value: 'Same-day morning order or advance booking' },
    ],
    specs: [
      { label: 'Portion', value: 'Individual lunch packaging' },
    ],
    leadTime: 'Advance order or morning request',
    servings: 'Individual lunch packaging',
    createdAt: '2026-02-21T09:00:00Z',
    updatedAt: '2026-03-06T15:00:00Z',
  },

  // ==========================================
  // CATERING
  // ==========================================
  {
    id: 'prod-cat-01',
    slug: 'cocktail-canape-finger-food-buffet',
    name: 'Cocktail Canapé & Finger Food Buffet',
    shortDescription:
      'Curated cocktail service featuring bite-sized spring rolls, meat skewers, and signature dips for stylish gatherings.',
    description:
      'Curated cocktail service featuring bite-sized spring rolls, meat skewers, stuffed pastry puffs, mini slider bites, and signature dips for stylish gatherings and corporate functions in Accra.',
    categoryId: 'catering',
    subcategoryId: 'sub-cocktail-canape',
    categoryName: 'Catering',
    category: 'catering',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Upscale catering platter with assortment of finger foods and canapés',
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505253758473-96b46d5f69fe?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 'Price on enquiry',
    priceNumeric: 1200,
    priceFormatted: 'Price on enquiry',
    currency: 'GH₵',
    pricingType: 'PRICE_ON_ENQUIRY',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 5,
    trackInventory: false,
    madeToOrder: true,
    customizable: true,
    featured: true,
    tags: ['Event Catering', 'Canapés', 'Cocktails', 'Buffet'],
    specifications: [
      { label: 'Capacity', value: 'From 20 to 200+ guests' },
      { label: 'Service', value: 'Drop-off platters or full service setup' },
      { label: 'Advance Booking', value: '3 to 5 days advance notice required' },
    ],
    specs: [
      { label: 'Capacity', value: 'From 20 to 200+ guests' },
      { label: 'Service', value: 'Drop-off platters or full service setup' },
    ],
    leadTime: '3 to 5 days advance booking',
    servings: 'From 20 to 200+ guests',
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-03-07T12:00:00Z',
  },

  // ==========================================
  // TRAINING
  // ==========================================
  {
    id: 'prod-train-01',
    slug: 'professional-cake-artistry-masterclass',
    name: 'Professional Cake Artistry Masterclass',
    shortDescription:
      'Hands-on course covering cake structural engineering, sharp edges, and delicate floral piping.',
    description:
      'Comprehensive hands-on course covering cake structural engineering, silky Swiss meringue buttercream, sharp edges, and delicate floral piping in our Accra workshop.',
    categoryId: 'training',
    subcategoryId: 'sub-cake-masterclasses',
    categoryName: 'Training',
    category: 'training',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Baking workshop participant learning cake finishing techniques',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 850,
    priceNumeric: 850,
    priceFormatted: 'GH₵ 850.00',
    currency: 'GH₵',
    pricingType: 'FIXED_PRICE',
    availability: 'AVAILABLE_ON_ENQUIRY',
    stockQuantity: 8,
    trackInventory: false,
    madeToOrder: false,
    customizable: false,
    featured: true,
    tags: ['Masterclass', 'Cake Decorating', 'Baking Skills', 'Accra Workshops'],
    specifications: [
      { label: 'Location', value: 'Accra Training Kitchen' },
      { label: 'Format', value: 'Small Group Hands-on Practice' },
      { label: 'Level', value: 'Beginner to Intermediate' },
      { label: 'Kit', value: 'Starter tool kit and ingredients provided' },
    ],
    specs: [
      { label: 'Location', value: 'Accra Training Kitchen' },
      { label: 'Format', value: 'Small Group Hands-on Practice' },
      { label: 'Level', value: 'Beginner to Intermediate' },
    ],
    leadTime: 'Registration open for upcoming cohort',
    servings: 'Small Cohort Sessions',
    options: [
      {
        id: 'opt-cohort',
        name: 'Cohort Schedule',
        values: [
          'Weekend Intensive (Saturdays 10am-3pm)',
          'Weekday Morning Cohort (Tue & Thu 9am-1pm)',
        ],
      },
    ],
    createdAt: '2026-02-23T11:00:00Z',
    updatedAt: '2026-03-08T09:00:00Z',
  },

  // ==========================================
  // LIFESTYLE PRODUCTS (Bags, Jewellery, Perfumes)
  // ==========================================
  {
    id: 'prod-life-01',
    slug: 'artisanal-structured-handbag',
    name: 'Artisanal Structured Handbag',
    shortDescription:
      'Elegantly crafted structured handbag designed with refined textured finish and gold-toned accents.',
    description:
      'Elegantly crafted structured handbag designed with refined textured finish, neat hardware, and a timeless silhouette for sophisticated everyday styling in Accra.',
    categoryId: 'bags',
    subcategoryId: 'sub-handbags',
    categoryName: 'Bags',
    category: 'bags',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Structured handbag in warm neutral tone',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 320,
    priceNumeric: 320,
    priceFormatted: 'GH₵ 320.00',
    compareAtPrice: 350,
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'IN_STOCK',
    madeToOrder: false,
    stockQuantity: 10,
    trackInventory: false,
    leadTime: 'In stock / Available to order in Accra',
    servings: '1 Piece',
    customizable: false,
    featured: true,
    tags: ['Lifestyle', 'Bags', 'Accessories', 'Handbags'],
    specifications: [
      { label: 'Material', value: 'Textured craft material' },
      { label: 'Hardware', value: 'Gold-toned accents' },
      { label: 'Dimensions', value: '26cm x 18cm x 10cm' },
    ],
    specs: [
      { label: 'Material', value: 'Textured craft material' },
      { label: 'Hardware', value: 'Gold-toned accents' },
    ],
    options: [
      {
        id: 'opt-bag-color',
        name: 'Colour',
        values: ['Warm Camel Neutral', 'Classic Midnight Black', 'Rich Wine Burgundy'],
      },
    ],
    variants: [
      {
        id: 'var-bag-camel',
        sku: 'PCC-BAG-CAM',
        title: 'Warm Camel Neutral',
        optionValues: { Colour: 'Warm Camel Neutral' },
        price: 320,
        compareAtPrice: 350,
        availability: 'IN_STOCK',
        isDefault: true,
      },
      {
        id: 'var-bag-black',
        sku: 'PCC-BAG-BLK',
        title: 'Classic Midnight Black',
        optionValues: { Colour: 'Classic Midnight Black' },
        price: 320,
        compareAtPrice: 350,
        availability: 'IN_STOCK',
      },
      {
        id: 'var-bag-wine',
        sku: 'PCC-BAG-WNE',
        title: 'Rich Wine Burgundy',
        optionValues: { Colour: 'Rich Wine Burgundy' },
        price: 320,
        compareAtPrice: 350,
        availability: 'IN_STOCK',
      },
    ],
    createdAt: '2026-02-24T12:00:00Z',
    updatedAt: '2026-03-08T14:00:00Z',
  },
  {
    id: 'prod-life-02',
    slug: 'refined-pearl-accent-jewellery-set',
    name: 'Refined Pearl Accent Jewellery Set',
    shortDescription:
      'Delicate handcrafted jewellery pieces combining luminous pearls with minimal gold-toned chains.',
    description:
      'Delicate handcrafted jewellery pieces combining luminous pearls with minimal gold-toned chains, celebrating femininity and timeless grace for celebrations and daily luxury.',
    categoryId: 'jewellery',
    subcategoryId: 'sub-pearl-sets',
    categoryName: 'Jewellery',
    category: 'jewellery',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Fine jewellery necklace and earrings with pearl accents',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 240,
    priceNumeric: 240,
    priceFormatted: 'GH₵ 240.00',
    currency: 'GH₵',
    pricingType: 'FIXED_PRICE',
    availability: 'IN_STOCK',
    madeToOrder: false,
    stockQuantity: 15,
    trackInventory: false,
    leadTime: 'In stock in Accra',
    servings: '2-Piece Set',
    customizable: false,
    featured: true,
    tags: ['Jewellery', 'Pearls', 'Elegance', 'Accessories'],
    specifications: [
      { label: 'Pieces', value: 'Necklace and matching earrings' },
      { label: 'Packaging', value: 'Signature Pearls keepsake box' },
      { label: 'Finish', value: '18k gold-toned hypoallergenic chain' },
    ],
    specs: [
      { label: 'Pieces', value: 'Necklace and matching earrings' },
      { label: 'Packaging', value: 'Signature Pearls keepsake box' },
    ],
    createdAt: '2026-02-25T14:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    id: 'prod-life-03',
    slug: 'signature-luxe-eau-de-parfum',
    name: 'Signature Luxe Eau de Parfum',
    shortDescription:
      'A warm, sophisticated fragrance harmonizing floral notes, warm amber, and subtle citrus zest.',
    description:
      'A warm, sophisticated fragrance harmonizing delicate floral notes, warm amber, and subtle citrus zest. Curated for the modern woman of elegance.',
    categoryId: 'perfumes',
    subcategoryId: 'sub-eau-de-parfum',
    categoryName: 'Perfumes',
    category: 'perfumes',
    image:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    primaryImage:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
    imageAlt: 'Luxury perfume bottle with gold atomizer and warm ambient glow',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
    ],
    price: 280,
    priceNumeric: 280,
    priceFormatted: 'GH₵ 280.00',
    currency: 'GH₵',
    pricingType: 'VARIANT_PRICING',
    availability: 'IN_STOCK',
    madeToOrder: false,
    stockQuantity: 12,
    trackInventory: false,
    leadTime: 'In stock in Accra',
    servings: '50ml Bottle',
    customizable: false,
    featured: true,
    tags: ['Perfumes', 'Fragrance', 'Luxury', 'Scent'],
    specifications: [
      { label: 'Concentration', value: 'Eau de Parfum' },
      { label: 'Fragrance Family', value: 'Floral Amber & Warm Citrus' },
      { label: 'Origin', value: 'Curated essence blend' },
    ],
    specs: [
      { label: 'Volume', value: '50ml Eau de Parfum' },
      { label: 'Notes', value: 'Floral Amber & Citrus' },
    ],
    options: [
      {
        id: 'opt-perfume-volume',
        name: 'Volume',
        values: ['50ml Eau de Parfum', '100ml Eau de Parfum', '15ml Travel Atomizer'],
      },
    ],
    variants: [
      {
        id: 'var-perf-50',
        sku: 'PCC-EDP-50',
        title: '50ml Eau de Parfum',
        optionValues: { Volume: '50ml Eau de Parfum' },
        price: 280,
        availability: 'IN_STOCK',
        isDefault: true,
      },
      {
        id: 'var-perf-100',
        sku: 'PCC-EDP-100',
        title: '100ml Eau de Parfum',
        optionValues: { Volume: '100ml Eau de Parfum' },
        price: 450,
        compareAtPrice: 480,
        availability: 'IN_STOCK',
      },
      {
        id: 'var-perf-15',
        sku: 'PCC-EDP-15',
        title: '15ml Travel Atomizer',
        optionValues: { Volume: '15ml Travel Atomizer' },
        price: 110,
        availability: 'IN_STOCK',
      },
    ],
    createdAt: '2026-02-26T15:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
  },
];

export const TRAINING_PROGRAMS = [
  {
    id: 'training-cake',
    title: 'Cake Training',
    category: 'Cake Training' as const,
    overview:
      'Learn the art of baking tall, moist cakes and mastering modern decorative mediums from buttercream sharp edges to royal icing and floral craft.',
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
