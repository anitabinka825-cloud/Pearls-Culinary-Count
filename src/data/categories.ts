/**
 * Pearls Culinary Counts — Stage 2A Categories & Subcategories
 *
 * Stage 2A sample category data for frontend development and testing.
 * It will later be replaced by real categories managed through the Admin Dashboard and backend.
 */

import { Category, CategoryItem } from '../types';

export const ALL_CATEGORIES: Category[] = [
  // Top-Level Categories
  {
    id: 'cakes',
    slug: 'cakes',
    name: 'Cakes',
    description:
      'Tiered celebration cakes, birthday designs, wedding centerpieces, and delicate cupcakes prepared to order.',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 1,
    tagline: 'Bespoke Celebration & Custom Artistry',
    offerings: ['Wedding Cakes', 'Celebration Cakes', 'Cupcakes', 'Bespoke Designs'],
  },
  {
    id: 'pastries',
    slug: 'pastries',
    name: 'Pastries',
    description:
      'Golden croissants, savory hand pies, sweet tarts, and gourmet finger bites baked fresh to order.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 2,
    tagline: 'Delicate Flaky Bakes & Confections',
    offerings: ['Meat & Savory Pies', 'Sweet Tarts', 'Croissants', 'Tea Pastries'],
  },
  {
    id: 'bread',
    slug: 'bread',
    name: 'Bread',
    description:
      'Artisanal breads, soft dinner rolls, sweet brioche, and traditional loaves prepared thoughtfully to order.',
    image:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 3,
    tagline: 'Artisanal Loaves & Soft Brioche',
    offerings: ['Artisan Loaves', 'Brioche & Rolls', 'Specialty Breads'],
  },
  {
    id: 'food',
    slug: 'food',
    name: 'Food',
    description:
      'Flavorful, thoughtfully prepared Ghanaian specialty meals and continental dishes crafted for private orders and gatherings in Accra.',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 4,
    tagline: 'Gourmet Ghanaian & Continental Dining',
    offerings: ['Ghanaian Specialties', 'Continental Dishes', 'Family Platters'],
  },
  {
    id: 'catering',
    slug: 'catering',
    name: 'Catering',
    description:
      'Culinary event catering for private celebrations, intimate gatherings, and corporate luncheons in Accra.',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 5,
    tagline: 'Private & Corporate Catering',
    offerings: ['Wedding Buffets', 'Cocktail Canapés', 'Corporate Luncheons'],
  },
  {
    id: 'training',
    slug: 'training',
    name: 'Training',
    description:
      'Practical baking, pastry, and culinary skills workshops in Accra designed for beginners, passionate home cooks, and future culinary entrepreneurs.',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 6,
    tagline: 'Hands-on Masterclasses & Mentorship',
    offerings: ['Cake Training', 'Pastry Training', 'Food Training'],
  },
  {
    id: 'bags',
    slug: 'bags',
    name: 'Bags',
    description:
      'Elegantly crafted handbags, structured clutches, and artisanal accessories designed for timeless everyday elegance.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 7,
    tagline: 'Artisanal Handbags & Structured Clutches',
    offerings: ['Structured Handbags', 'Totes & Clutches'],
  },
  {
    id: 'jewellery',
    slug: 'jewellery',
    name: 'Jewellery',
    description:
      'Handcrafted jewellery combining luminous pearls and refined gold-toned accents, celebrating timeless grace.',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 8,
    tagline: 'Refined Pearl Accents & Statement Pieces',
    offerings: ['Pearl Necklaces', 'Earring Sets', 'Statement Bracelets'],
  },
  {
    id: 'perfumes',
    slug: 'perfumes',
    name: 'Perfumes',
    description:
      'Curated eau de parfum and signature oil fragrances blending warm amber, rare florals, and delicate vanilla notes.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    parentCategoryId: null,
    active: true,
    sortOrder: 9,
    tagline: 'Signature Fragrances & Luxury Oils',
    offerings: ['Eau de Parfum', 'Fragrance Oils'],
  },

  // Subcategories — Cakes
  {
    id: 'sub-birthday-cakes',
    slug: 'birthday-cakes',
    name: 'Birthday Cakes',
    description: 'Vibrant celebration cakes with custom inscriptions and flavor profiles.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'cakes',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-wedding-cakes',
    slug: 'wedding-cakes',
    name: 'Wedding Cakes',
    description: 'Multi-tiered centerpiece cakes with bespoke sugarcraft and florals.',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'cakes',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-cupcakes',
    slug: 'cupcakes',
    name: 'Cupcakes',
    description: 'Moist gourmet cupcakes with silky buttercream swirls and party boxes.',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'cakes',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'sub-custom-cakes',
    slug: 'custom-cakes',
    name: 'Custom Cakes',
    description: 'Commissioned structural designs and themed celebration tiers.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'cakes',
    active: true,
    sortOrder: 4,
  },

  // Subcategories — Pastries
  {
    id: 'sub-sweet-pastries',
    slug: 'sweet-pastries',
    name: 'Sweet Pastries',
    description: 'Glazed fruit tarts, chocolate eclairs, and delicate cream horns.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'pastries',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-savoury-pastries',
    slug: 'savoury-pastries',
    name: 'Savoury Pastries',
    description: 'Crispy spring rolls, cocktail samosas, and savory sausage rolls.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'pastries',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-pies',
    slug: 'pies',
    name: 'Pies',
    description: 'Traditional Ghanaian seasoned meat pies and chicken turnovers.',
    image: 'https://images.unsplash.com/photo-1621236378699-8597fee6a1ce?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'pastries',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'sub-croissants',
    slug: 'croissants',
    name: 'Croissants',
    description: 'Laminated golden French butter croissants and pain au chocolat.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'pastries',
    active: true,
    sortOrder: 4,
  },

  // Subcategories — Food
  {
    id: 'sub-rice-dishes',
    slug: 'rice-dishes',
    name: 'Rice Dishes',
    description: 'Signature smoky Ghanaian Jollof, fried rice, and savory waakye bowls.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'food',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-local-dishes',
    slug: 'local-dishes',
    name: 'Local Dishes',
    description: 'Authentic Ghanaian meals, spiced chicken, goat meat, and fried plantain.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'food',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-continental',
    slug: 'continental',
    name: 'Continental',
    description: 'Creamy herb pasta, roasted chicken, and fresh salads.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'food',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'sub-platters',
    slug: 'platters',
    name: 'Platters',
    description: 'Executive cocktail snack platters and sharing boxes.',
    image: 'https://images.unsplash.com/photo-1505253758473-96b46d5f69fe?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'food',
    active: true,
    sortOrder: 4,
  },

  // Subcategories — Bread
  {
    id: 'sub-artisanal-loaves',
    slug: 'artisanal-loaves',
    name: 'Artisan Loaves',
    description: 'Naturally leavened sourdough and crusty country bread loaves.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'bread',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-brioche-rolls',
    slug: 'brioche-rolls',
    name: 'Brioche & Rolls',
    description: 'Soft golden brioche loaves, dinner rolls, and burger buns.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'bread',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-specialty-breads',
    slug: 'specialty-breads',
    name: 'Specialty Breads',
    description: 'Herb focaccia, whole wheat loaves, and seeded artisan bread.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'bread',
    active: true,
    sortOrder: 3,
  },

  // Subcategories — Catering
  {
    id: 'sub-cocktail-canape',
    slug: 'cocktail-canape',
    name: 'Cocktail Canapés & Platters',
    description: 'Finger food bites, spring rolls, skewers, and party canapés.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'catering',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-event-buffets',
    slug: 'event-buffets',
    name: 'Event Buffets',
    description: 'Full-service warm buffet chafing setups and celebration banquets.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'catering',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-corporate-luncheons',
    slug: 'corporate-luncheons',
    name: 'Corporate Luncheons',
    description: 'Individual executive lunch boxes and boardroom meeting catering.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'catering',
    active: true,
    sortOrder: 3,
  },

  // Subcategories — Training
  {
    id: 'sub-cake-masterclasses',
    slug: 'cake-masterclasses',
    name: 'Cake Masterclasses',
    description: 'Intensive cake structure, buttercream finishing, and sugarcraft workshops.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'training',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-pastry-workshops',
    slug: 'pastry-workshops',
    name: 'Pastry Workshops',
    description: 'Practical laminated dough, French pastries, and savory pie courses.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'training',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'sub-culinary-classes',
    slug: 'culinary-classes',
    name: 'Culinary & Cooking Classes',
    description: 'Hands-on Ghanaian cooking, continental dishes, and kitchen management.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'training',
    active: true,
    sortOrder: 3,
  },

  // Subcategories — Bags
  {
    id: 'sub-handbags',
    slug: 'handbags',
    name: 'Structured Handbags',
    description: 'Timeless structured handbags and shoulder bags with gold hardware.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'bags',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-clutches',
    slug: 'clutches',
    name: 'Clutches & Evening Bags',
    description: 'Compact clutches and elegant evening statement bags.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'bags',
    active: true,
    sortOrder: 2,
  },

  // Subcategories — Jewellery
  {
    id: 'sub-pearl-sets',
    slug: 'pearl-sets',
    name: 'Pearl Sets & Necklaces',
    description: 'Luminous pearl necklace and earring sets celebrating timeless grace.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'jewellery',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-earrings-bracelets',
    slug: 'earrings-bracelets',
    name: 'Earrings & Bracelets',
    description: 'Handcrafted pearl-accented drop earrings and statement bracelets.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'jewellery',
    active: true,
    sortOrder: 2,
  },

  // Subcategories — Perfumes
  {
    id: 'sub-eau-de-parfum',
    slug: 'eau-de-parfum',
    name: 'Eau de Parfum',
    description: 'Long-lasting signature fragrances with amber, floral, and citrus notes.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'perfumes',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'sub-fragrance-oils',
    slug: 'fragrance-oils',
    name: 'Fragrance Oils & Travel Sprays',
    description: 'Concentrated luxury fragrance oils and compact travel atomizers.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
    parentCategoryId: 'perfumes',
    active: true,
    sortOrder: 2,
  },
];

// Top-level categories for direct navigation / display
export const TOP_LEVEL_CATEGORIES: Category[] = ALL_CATEGORIES.filter(
  (c) => c.parentCategoryId === null && c.active
).sort((a, b) => a.sortOrder - b.sortOrder);

// Backward-compatibility bridge for HomeView and existing components
export const CATEGORIES_DATA: CategoryItem[] = TOP_LEVEL_CATEGORIES.map((cat) => ({
  id: cat.id,
  slug: cat.slug,
  name: cat.name,
  tagline: cat.tagline || cat.description,
  description: cat.description,
  image: cat.image,
  imageAlt: `${cat.name} by Pearls Culinary Counts`,
  itemCount: 'Explore Offerings',
  offerings: cat.offerings,
}));

export const CATEGORIES = CATEGORIES_DATA;
