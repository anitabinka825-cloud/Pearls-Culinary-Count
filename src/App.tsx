import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useSiteSettings } from './context/SiteSettingsContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CustomerCareButton } from './components/layout/CustomerCareButton';
import { HomeView } from './components/views/HomeView';
import { LoadingState } from './components/ui/LoadingState';
import { AppRoute, CategoryItem, Product } from './types';

// Route-level code splitting: each page is its own chunk, fetched on first visit.
// HomeView stays eager because it is the landing page for most visitors.
const CartView = lazy(() => import('./components/cart/CartView').then((m) => ({ default: m.CartView })));
const CheckoutView = lazy(() => import('./components/cart/CheckoutView').then((m) => ({ default: m.CheckoutView })));
const OrderView = lazy(() => import('./components/cart/OrderView').then((m) => ({ default: m.OrderView })));
const ShopView = lazy(() => import('./components/views/ShopView').then((m) => ({ default: m.ShopView })));
const CakesView = lazy(() => import('./components/views/CakesView').then((m) => ({ default: m.CakesView })));
const PastriesView = lazy(() => import('./components/views/PastriesView').then((m) => ({ default: m.PastriesView })));
const FoodView = lazy(() => import('./components/views/FoodView').then((m) => ({ default: m.FoodView })));
const TrainingView = lazy(() => import('./components/views/TrainingView').then((m) => ({ default: m.TrainingView })));
const AboutView = lazy(() => import('./components/views/AboutView').then((m) => ({ default: m.AboutView })));
const ContactView = lazy(() => import('./components/views/ContactView').then((m) => ({ default: m.ContactView })));
const EnquiryView = lazy(() => import('./components/views/EnquiryView').then((m) => ({ default: m.EnquiryView })));
const ProductDetailView = lazy(() => import('./components/views/ProductDetailView').then((m) => ({ default: m.ProductDetailView })));
const LoginView = lazy(() => import('./components/views/LoginView').then((m) => ({ default: m.LoginView })));
const RegisterView = lazy(() => import('./components/views/RegisterView').then((m) => ({ default: m.RegisterView })));
const ForgotPasswordView = lazy(() => import('./components/views/ForgotPasswordView').then((m) => ({ default: m.ForgotPasswordView })));
const AccountView = lazy(() => import('./components/views/AccountView').then((m) => ({ default: m.AccountView })));
const AdminView = lazy(() => import('./components/views/AdminView').then((m) => ({ default: m.AdminView })));
const NotFoundView = lazy(() => import('./components/views/NotFoundView').then((m) => ({ default: m.NotFoundView })));
const ProductDetailModal = lazy(() => import('./components/products/ProductDetailModal').then((m) => ({ default: m.ProductDetailModal })));
const CustomOrderModal = lazy(() => import('./components/home/CustomOrderModal').then((m) => ({ default: m.CustomOrderModal })));

// Scroll to top helper on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { count: cartCount } = useCart();
  // Reading the settings here re-renders the whole tree when the owner's details load or change.
  const { settings: siteSettings } = useSiteSettings();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState(false);
  const [customOrderPrefill, setCustomOrderPrefill] = useState('');


  // Gracefully migrate legacy hash-based URLs (e.g. /#/shop -> /shop)
  useEffect(() => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const targetPath = window.location.hash.slice(1);
      window.history.replaceState(null, '', targetPath);
      navigate(targetPath, { replace: true });
    }
  }, [navigate]);

  // Set absolute URLs for social share cards (OpenGraph / Twitter) using current origin
  useEffect(() => {
    const origin = window.location.origin;
    const imageUrl = `${origin}/favicon.jpg`;

    const updateMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let tag = document.querySelector(`meta[${attr}="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMeta('og:image', imageUrl);
    updateMeta('og:image:secure_url', imageUrl);
    updateMeta('twitter:image', imageUrl);
    updateMeta('og:url', origin + location.pathname);
  }, [location.pathname]);

  const handleNavigate = (route: AppRoute) => {
    navigate(route);
  };

  const handleExploreCategory = (category: CategoryItem) => {
    if (category.slug === 'cakes') {
      navigate('/cakes');
    } else if (category.slug === 'pastries' || category.slug === 'bread') {
      navigate('/pastries');
    } else if (category.slug === 'food' || category.slug === 'catering') {
      navigate('/food');
    } else if (category.slug === 'training') {
      navigate('/training');
    } else {
      navigate('/shop');
    }
  };

  const handleOpenCustomOrder = (prefillName: string = '') => {
    setCustomOrderPrefill(prefillName);
    setIsCustomOrderOpen(true);
  };

  // Derive currentRoute from location.pathname for active navigation highlighting
  const currentRoute = (location.pathname as AppRoute) || '/';

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-[#121214] dark:text-neutral-100 selection:bg-[#FDF2F7] selection:text-[#DE1B76]">
        <ScrollToTop />

        {siteSettings?.announcement && (
          <div role="status" className="bg-[#121214] text-white text-xs sm:text-sm text-center px-4 py-2">
            {siteSettings.announcement}
          </div>
        )}

        {/* Global Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          wishlistCount={0}
          cartCount={cartCount}

        />

        {/* Main Routed View Area */}
        <main id="main-content" className="flex-1">
          <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><LoadingState message="Loading..." /></div>}>
          <Routes>
            <Route
              path="/"
              element={
                <HomeView
                  onExploreProducts={() => navigate('/shop')}
                  onExploreCategory={handleExploreCategory}
                  onNavigateToTraining={() => navigate('/training')}
                  onOpenCustomOrder={handleOpenCustomOrder}
                  onContactClick={() => navigate('/contact')}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopView
                  onViewProduct={(p) => setSelectedProduct(p)}
                  onOpenCustomOrder={handleOpenCustomOrder}
                />
              }
            />
            <Route
              path="/cakes"
              element={
                <CakesView
                  onViewProduct={(p) => setSelectedProduct(p)}
                  onOpenCustomOrder={handleOpenCustomOrder}
                />
              }
            />
            <Route
              path="/pastries"
              element={
                <PastriesView
                  onViewProduct={(p) => setSelectedProduct(p)}
                  onOpenCustomOrder={handleOpenCustomOrder}
                />
              }
            />
            <Route
              path="/food"
              element={
                <FoodView
                  onViewProduct={(p) => setSelectedProduct(p)}
                  onOpenCustomOrder={handleOpenCustomOrder}
                />
              }
            />
            <Route
              path="/training"
              element={
                <TrainingView
                  onEnquireProgram={(prog) => handleOpenCustomOrder(prog)}
                />
              }
            />
            <Route
              path="/about"
              element={
                <AboutView
                  onNavigateShop={() => navigate('/shop')}
                  onNavigateContact={() => navigate('/contact')}
                />
              }
            />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/enquiry" element={<EnquiryView />} />
            <Route
              path="/product/:slug"
              element={
                <ProductDetailView onOpenCustomOrder={handleOpenCustomOrder} />
              }
            />
            <Route
              path="/product/id/:id"
              element={
                <ProductDetailView onOpenCustomOrder={handleOpenCustomOrder} />
              }
            />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/forgot-password" element={<ForgotPasswordView />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminView />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<CartView />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:reference"
              element={
                <ProtectedRoute>
                  <OrderView />
                </ProtectedRoute>
              }
            />
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFoundView />} />
          </Routes>
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Modals are lazy-loaded and only mounted while open. */}
        <Suspense fallback={null}>
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onOpenCustomOrder={(productName) => handleOpenCustomOrder(productName)}
            />
          )}
          {isCustomOrderOpen && (
            <CustomOrderModal
              isOpen={isCustomOrderOpen}
              onClose={() => setIsCustomOrderOpen(false)}
              prefillProduct={customOrderPrefill}
            />
          )}
        </Suspense>

        {/* Customer Care "Need Help?" floating entry point */}
        <CustomerCareButton
          onOpenCustomOrder={() => handleOpenCustomOrder()}
        />
      </div>
    </AuthProvider>
  );
}
