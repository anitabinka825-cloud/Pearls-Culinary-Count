import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CustomerCareButton } from './components/layout/CustomerCareButton';
import { HomeView } from './components/views/HomeView';
import { ShopView } from './components/views/ShopView';
import { CakesView } from './components/views/CakesView';
import { PastriesView } from './components/views/PastriesView';
import { FoodView } from './components/views/FoodView';
import { TrainingView } from './components/views/TrainingView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { EnquiryView } from './components/views/EnquiryView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { NotFoundView } from './components/views/NotFoundView';
import { StagePlaceholderView } from './components/views/StagePlaceholderView';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CustomOrderModal } from './components/home/CustomOrderModal';
import { AppRoute, CategoryItem, Product } from './types';

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
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-[#FDF2F7] selection:text-[#DE1B76]">
      <ScrollToTop />

      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        wishlistCount={0}
        cartCount={0}
      />

      {/* Main Routed View Area */}
      <main id="main-content" className="flex-1">
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
            path="/product/:id"
            element={
              <ProductDetailView onOpenCustomOrder={handleOpenCustomOrder} />
            }
          />
          <Route
            path="/account"
            element={
              <StagePlaceholderView
                type="account"
                onNavigateHome={() => navigate('/')}
                onNavigateShop={() => navigate('/shop')}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <StagePlaceholderView
                type="cart"
                onNavigateHome={() => navigate('/')}
                onNavigateShop={() => navigate('/shop')}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <StagePlaceholderView
                type="checkout"
                onNavigateHome={() => navigate('/')}
                onNavigateShop={() => navigate('/shop')}
              />
            }
          />
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Reusable Product Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCustomOrder={(productName) => handleOpenCustomOrder(productName)}
      />

      {/* Reusable Bespoke Order / Enquiry Modal */}
      <CustomOrderModal
        isOpen={isCustomOrderOpen}
        onClose={() => setIsCustomOrderOpen(false)}
        prefillProduct={customOrderPrefill}
      />

      {/* Customer Care "Need Help?" floating entry point */}
      <CustomerCareButton
        onOpenCustomOrder={() => handleOpenCustomOrder()}
      />
    </div>
  );
}
