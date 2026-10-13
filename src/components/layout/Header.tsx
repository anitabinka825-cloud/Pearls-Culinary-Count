import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  Phone,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';
import { AppRoute } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  wishlistCount?: number;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  wishlistCount = 0,
  cartCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappGeneralUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I would like to make an enquiry or place an order.'
  );

  const navLinks: { label: string; route: AppRoute }[] = [
    { label: 'Home', route: '/' },
    { label: 'Shop', route: '/shop' },
    { label: 'Cakes', route: '/cakes' },
    { label: 'Pastries', route: '/pastries' },
    { label: 'Food', route: '/food' },
    { label: 'Training', route: '/training' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ];

  return (
    <header
      id="global-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100 py-3'
          : 'bg-white border-b border-neutral-100/80 py-4 sm:py-5'
      }`}
    >
      {/* Top Utility Bar for Desktop */}
      <div className="hidden lg:block border-b border-neutral-100 pb-2 mb-3 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE1B76]"></span>
              {BUSINESS_CONFIG.location}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500 italic">
              {BUSINESS_CONFIG.motto}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="flex items-center gap-1.5 text-neutral-600 hover:text-[#DE1B76] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#DE1B76]" />
              <span>Call: {BUSINESS_CONFIG.phoneFormatted}</span>
            </a>
            <span className="text-neutral-300">•</span>
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-[#DE1B76] hover:text-[#B8125C] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {BUSINESS_CONFIG.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigate('/')}
          id="header-brand-logo"
          className="group flex flex-col text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DE1B76] ring-4 ring-[#FDF2F7] transition-transform group-hover:scale-125"></span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#121214]">
              PEARLS CULINARY <span className="text-[#DE1B76]">COUNTS</span>
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 pl-4 font-sans font-medium">
            Accra, Ghana • {BUSINESS_CONFIG.tagline}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          id="desktop-nav"
          aria-label="Global Primary Navigation"
          className="hidden xl:flex items-center gap-6"
        >
          {navLinks.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.route)}
                id={`desktop-nav-${item.label.toLowerCase()}`}
                className={`text-xs font-semibold uppercase tracking-wider py-1 relative transition-colors ${
                  isActive
                    ? 'text-[#DE1B76]'
                    : 'text-neutral-700 hover:text-[#DE1B76]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DE1B76]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Actions & Auth Triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Auth State (Desktop) */}
          {currentUser ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/account')}
                title="Customer Account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF2F7] text-[#DE1B76] text-xs font-semibold hover:bg-[#fae2ee] transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{userProfile?.firstName || 'Account'}</span>
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs font-medium text-neutral-600 hover:text-red-600 px-2 py-1 transition-colors cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-xs font-semibold text-neutral-700 hover:text-[#DE1B76] px-3 py-1.5 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#DE1B76] text-white hover:bg-[#c41465] transition-colors shadow-2xs cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Cart Icon */}
          <button
            type="button"
            onClick={() => onNavigate('/cart')}
            title="Cart"
            aria-label="Shopping Cart"
            className="p-2 rounded-full text-neutral-600 hover:text-[#DE1B76] hover:bg-[#FDF2F7] transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DE1B76] text-white text-[9px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Prominent WhatsApp / Contact Action */}
          <a
            id="nav-order-whatsapp-btn"
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xs hover:shadow transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
            <span>Order on WhatsApp</span>
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="xl:hidden p-2 rounded-lg text-neutral-800 hover:text-[#DE1B76] hover:bg-neutral-50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="xl:hidden border-t border-neutral-100 bg-white px-6 pt-4 pb-6 mt-3 shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col space-y-1 mb-5">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onNavigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-semibold py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-[#FDF2F7] text-[#DE1B76]'
                      : 'text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-neutral-400">›</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 space-y-2.5">
            {currentUser ? (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/account');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#FDF2F7] text-xs font-semibold text-[#DE1B76]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#DE1B76] text-xs font-semibold text-white"
                >
                  <span>Create Account</span>
                </button>
              </div>
            )}

            <div className="mb-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('/cart');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#DE1B76]" />
                <span>Shopping Cart</span>
              </button>
            </div>

            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#DE1B76] text-white font-semibold py-3 rounded-full shadow-sm text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </a>

            <a
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-neutral-100 text-neutral-800 font-medium py-2.5 rounded-full text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-600" />
              <span>Call: {BUSINESS_CONFIG.phoneFormatted}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
