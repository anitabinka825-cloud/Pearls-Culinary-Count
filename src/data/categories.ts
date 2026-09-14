import { CategoryItem } from '../types';

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'cakes',
    slug: 'cakes',
    name: 'Cakes',
    tagline: 'Bespoke Celebration & Custom Artistry',
    description:
      'Tiered celebration cakes, birthday designs, wedding centerpieces, and delicate cupcakes prepared to order.',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Handcrafted celebratory tiered cake with elegant florals and icing',
    itemCount: 'Custom & Made to Order',
    subcategories: ['Wedding Cakes', 'Celebration Cakes', 'Cupcakes', 'Bespoke Designs'],
  },
  {
    id: 'pastries',
    slug: 'pastries',
    name: 'Pastries',
    tagline: 'Delicate Flaky Bakes & Confections',
    description:
      'Golden croissants, savory hand pies, sweet tarts, and gourmet finger bites baked fresh to perfection.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Freshly baked artisanal pastries and flaky confections',
    itemCount: 'Freshly Baked to Order',
    subcategories: ['Meat & Savory Pies', 'Sweet Tarts', 'Croissants', 'Tea Pastries'],
  },
  {
    id: 'bread',
    slug: 'bread',
    name: 'Bread',
    tagline: 'Artisanal Loaves & Soft Brioche',
    description:
      'Artisanal breads, soft dinner rolls, sweet brioche, and traditional loaves prepared thoughtfully to order.',
    image:
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Golden crusted artisan bread loaf sliced fresh',
    itemCount: 'Oven-Fresh Loaves',
    subcategories: ['Artisan Loaves', 'Brioche & Rolls', 'Specialty Breads'],
  },
  {
    id: 'food',
    slug: 'food',
    name: 'Food',
    tagline: 'Gourmet Ghanaian & Continental Dining',
    description:
      'Flavorful, thoughtfully prepared Ghanaian specialty meals and continental dishes crafted for private orders and executive lunches.',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Gourmet culinary bowl with fresh colorful ingredients',
    itemCount: 'Chef-Curated Menus',
    subcategories: ['Ghanaian Specialties', 'Continental Dishes', 'Family Platters'],
  },
  {
    id: 'catering',
    slug: 'catering',
    name: 'Catering',
    tagline: 'Private & Corporate Catering',
    description:
      'Culinary event catering for private celebrations, intimate gatherings, and corporate luncheons in Accra.',
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Professional catering buffet table presentation with elegant platters',
    itemCount: 'Events & Corporate',
    subcategories: ['Wedding Buffets', 'Cocktail Canapés', 'Corporate Luncheons'],
  },
  {
    id: 'training',
    slug: 'training',
    name: 'Culinary Training',
    tagline: 'Hands-on Masterclasses & Mentorship',
    description:
      'Practical baking, pastry, and culinary skills workshops in Accra designed for beginners, passionate home cooks, and future culinary entrepreneurs.',
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Culinary instructor demonstrating cake decorating and pastry technique',
    itemCount: 'Workshops & Mentorship',
    subcategories: ['Cake Training', 'Pastry Training', 'Food Training'],
  },
  {
    id: 'lifestyle',
    slug: 'lifestyle',
    name: 'Lifestyle Products',
    tagline: 'Bags, Jewellery, Perfumes & Accessories',
    description:
      'Curated lifestyle essentials including chic bags, elegant jewellery, luxury perfumes, and gift hampers complementing the modern lifestyle.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Luxury lifestyle fragrance perfume and elegant accessories',
    itemCount: 'Selected Lifestyle Pieces',
    subcategories: ['Bags', 'Jewellery', 'Perfumes', 'Gift Hampers'],
  },
];

export const CATEGORIES = CATEGORIES_DATA;
