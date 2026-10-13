import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  MapPin,
  ShoppingBag,
  MessageSquare,
  Heart,
  Settings,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function AccountView() {
  const { currentUser, userProfile, signOut, sendEmailVerification, reloadUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'enquiries' | 'wishlist' | 'settings'>('profile');
  const [verificationSent, setVerificationSent] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification();
      setVerificationSent(true);
      setSuccessMsg('Verification email sent! Please check your inbox.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      // handled
    }
  };

  const handleRefreshVerification = async () => {
    try {
      setReloading(true);
      await reloadUser();
      setSuccessMsg('Account status refreshed.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setReloading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAFAFA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FDF2F7] text-[#DE1B76] flex items-center justify-center font-bold text-2xl shadow-inner">
              {userProfile?.firstName?.[0] || currentUser?.email?.[0]?.toUpperCase() || 'P'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Welcome back, {userProfile?.firstName || 'Valued Customer'}!
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  Stage 3 Active
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-0.5">
                Manage your Pearls Culinary Counts customer profile and account information.
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 rounded-xl transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Email Verification Banner */}
        {currentUser && !currentUser.emailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">Email Verification Required</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Your email address ({currentUser.email}) has not been verified yet. Verify your email to secure your account.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 self-end sm:self-center">
              <button
                onClick={handleSendVerification}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                {verificationSent ? 'Verification Sent' : 'Resend Email'}
              </button>
              <button
                onClick={handleRefreshVerification}
                disabled={reloading}
                className="p-2 bg-white hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-300 transition-colors text-xs font-medium flex items-center space-x-1 cursor-pointer"
                title="Check verification status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reloading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-3 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>Saved Addresses</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                  Later Stage
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders & History</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                  Later Stage
                </span>
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'enquiries'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Bespoke Enquiries</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                  Later Stage
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                  Later Stage
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#FDF2F7] text-[#DE1B76]'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                  Later Stage
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Personal Information</h2>
                  <p className="text-sm text-neutral-600">
                    Your authenticated customer identity with Pearls Culinary Counts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      First Name
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-medium text-sm">
                      {userProfile?.firstName || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Last Name
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-medium text-sm">
                      {userProfile?.lastName || 'Not provided'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Email Address (Authentication ID)
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-medium text-sm flex items-center justify-between">
                      <span>{currentUser?.email}</span>
                      {currentUser?.emailVerified ? (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold">Unverified</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                      Phone Number
                    </label>
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-900 font-medium text-sm">
                      {userProfile?.phone || currentUser?.phoneNumber || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Account UID: {currentUser?.uid}</span>
                  <span>Member since: {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Saved Delivery Addresses</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Saved delivery addresses will be available in a later stage. Currently, all Accra delivery locations and instructions are confirmed directly via our customer care team and WhatsApp enquiries.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                    Coming in a later stage
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Orders & History</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Order history and tracking will be available in a later stage. You can currently explore our complete catalogue and place bespoke orders instantly via WhatsApp.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                    Coming in a later stage
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'enquiries' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Bespoke Enquiries</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Enquiry tracking will be available in a later stage. Your celebration cake and event catering custom requests are handled directly by our master chefs via WhatsApp.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                    Coming in a later stage
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Wishlist</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Saved wishlist will be available in a later stage. You can browse all cakes, pastries, bread, food, and lifestyle items freely in our catalogue.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                    Coming in a later stage
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#FDF2F7] text-[#DE1B76] rounded-full flex items-center justify-center mx-auto">
                  <Settings className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">Account Settings</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Advanced account settings and notification preferences will be available in a later stage.
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
                    Coming in a later stage
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
