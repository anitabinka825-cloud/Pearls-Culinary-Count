import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  ACCRA_DELIVERY_AREAS,
  BUSINESS_CONFIG,
  createWhatsAppUrl,
} from '../../config/business';
import { SocialLinks } from '../ui/SocialLinks';
import { Button } from '../ui/Button';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
    location: ACCRA_DELIVERY_AREAS[0] || 'Airport Residential',
  });
  const [submittedUrl, setSubmittedUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMsg = [
      `*New Contact Message - Pearls Culinary Counts*`,
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : '',
      `Subject: ${formData.subject}`,
      `Location / Area: ${formData.location}`,
      `Message: ${formData.message}`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = createWhatsAppUrl(whatsappMsg);
    setSubmittedUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const whatsappGeneralUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I would like to make an enquiry.'
  );

  return (
    <div className="py-12 lg:py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Connect With Our Team</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#121214]">
            Contact & Enquiries
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            We are always delighted to assist you with custom cake commissions, catering consultations, culinary training enrollment, or product inquiries in Accra, Ghana.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Info Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#121214] text-white rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#DE1B76]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
                  Direct Line & WhatsApp
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Pearls Culinary Counts
                </h3>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400">
                      Location
                    </p>
                    <p className="text-sm font-medium text-white">
                      {BUSINESS_CONFIG.location}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Serving all residential and corporate districts in Greater Accra
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#DE1B76] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400">
                      Phone
                    </p>
                    <a
                      href={`tel:${BUSINESS_CONFIG.phone}`}
                      className="text-sm font-medium text-white hover:text-[#DE1B76] transition-colors"
                    >
                      {BUSINESS_CONFIG.phoneFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MessageCircle className="w-5 h-5 text-[#DE1B76] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400">
                      WhatsApp
                    </p>
                    <a
                      href={whatsappGeneralUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white hover:text-[#DE1B76] transition-colors"
                    >
                      {BUSINESS_CONFIG.phoneFormatted}
                    </a>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Fastest response for quotes & photos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400">
                      Lead Times & Inquiries
                    </p>
                    <p className="text-sm font-medium text-white">
                      Monday to Saturday: 8:00 AM – 6:00 PM
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Sunday orders by advance arrangement
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-4">
                <a
                  href={whatsappGeneralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold py-3 px-6 rounded-full transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-600 block">
                Official Social Media
              </span>
              <p className="text-xs text-neutral-500">
                Follow our bakes, behind-the-scenes masterclasses, and new lifestyle arrivals.
              </p>
              <SocialLinks />
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/70 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
              Send an Enquiry
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm mb-6">
              Complete the form below to connect directly with our Accra kitchen and customer care team.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F7] text-[#DE1B76] border border-[#F9A8D4]/40 flex items-center justify-center mx-auto shadow-2xs">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="font-serif text-2xl font-bold text-neutral-900">
                    Continue in WhatsApp
                  </h4>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    WhatsApp has opened in a new tab with your prefilled enquiry. Please tap <strong>Send</strong> in WhatsApp to submit your message directly to Pearls Culinary Counts (<strong>{BUSINESS_CONFIG.phoneFormatted}</strong>).
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={submittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold py-2.5 px-6 rounded-full transition-colors shadow-xs"
                  >
                    <span>Reopen WhatsApp Chat</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Akua Mensah"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 055 247 1271"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. akua@example.com"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Enquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    >
                      <option value="Celebration Cake">Celebration / Wedding Cake</option>
                      <option value="Pastries Box">Pastries & Bread Orders</option>
                      <option value="Food & Catering">Food & Event Catering</option>
                      <option value="Culinary Training">Culinary & Baking Training</option>
                      <option value="Lifestyle Products">Lifestyle (Bags, Jewellery, Perfumes)</option>
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Location in Accra
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    >
                      {ACCRA_DELIVERY_AREAS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your desired flavors, event date, guest count, or questions..."
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-medium py-3 px-6 rounded-full text-xs transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Continue in WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
