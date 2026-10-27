import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Sparkles,
  Calendar,
  MapPin,
  Upload,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Phone,
} from 'lucide-react';
import {
  ACCRA_DELIVERY_LOCATIONS,
  BUSINESS_CONFIG,
  createWhatsAppUrl,
} from '../../config/business';
import { CustomOrderEnquiry } from '../../types';
import { submitEnquiry } from '../../services/api';

export const EnquiryView: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CustomOrderEnquiry>({
    productType: '',
    customProductText: '',
    quantity: '',
    preferredDate: '',
    size: '',
    flavour: '',
    filling: '',
    themeDesign: '',
    inscription: '',
    deliveryLocation: '',
    specialInstructions: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });

  const [fileName, setFileName] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string>('');
  const [showWhatsAppRedirect, setShowWhatsAppRedirect] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [savedReference, setSavedReference] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'preferredDate') {
      if (value && value < today) {
        setDateError('Please select today or a future date for your event or order.');
      } else {
        setDateError('');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.preferredDate && formData.preferredDate < today) {
      setDateError('Please select today or a future date.');
      return;
    }

    const lines = [
      `*Custom Order / Commission Enquiry - Pearls Culinary Counts*`,
      `Customer: ${formData.customerName || 'Customer'}`,
      `Phone: ${formData.customerPhone || 'Not provided'}`,
      formData.customerEmail ? `Email: ${formData.customerEmail}` : '',
      `Product / Service: ${formData.productType || 'Custom Commission'}`,
      formData.customProductText ? `Specifications: ${formData.customProductText}` : '',
      `Quantity / Guest Count: ${formData.quantity || 'To be confirmed'}`,
      `Preferred Date: ${formData.preferredDate || 'Flexible / To be confirmed'}`,
      formData.size ? `Size / Tiers: ${formData.size}` : '',
      formData.flavour ? `Flavour: ${formData.flavour}` : '',
      formData.filling ? `Filling: ${formData.filling}` : '',
      formData.themeDesign ? `Theme / Color: ${formData.themeDesign}` : '',
      formData.inscription ? `Inscription: "${formData.inscription}"` : '',
      `Delivery Location / Pickup: ${formData.deliveryLocation || 'Accra (to confirm)'}`,
      formData.specialInstructions ? `Dietary / Notes: ${formData.specialInstructions}` : '',
      fileName
        ? `Reference Image: ${fileName} — customer will attach the image manually in WhatsApp.`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    setSubmitError('');
    setSubmitting(true);
    let reference = '';
    try {
      const saved = await submitEnquiry(formData);
      reference = saved.reference;
    } catch (err: any) {
      // Never block the customer: the WhatsApp channel still works if saving fails.
      setSubmitError(err?.message || 'We could not save your enquiry online.');
    } finally {
      setSubmitting(false);
    }
    setSavedReference(reference);
    const whatsappUrl = createWhatsAppUrl(reference ? `${lines}\nReference: ${reference}` : lines);
    setSubmittedWhatsAppUrl(whatsappUrl);
    setShowWhatsAppRedirect(true);
  };

  const isCakeOrPastry =
    formData.productType.toLowerCase().includes('cake') ||
    formData.productType.toLowerCase().includes('pastr') ||
    formData.productType.toLowerCase().includes('cupcake') ||
    formData.productType === '';

  return (
    <div className="py-12 lg:py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Bespoke Orders & Inquiries</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#121214]">
            Custom Order & Enquiry
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Whether you need a tiered celebration cake, a catering consultation for an upcoming Accra event, a private pastry box, or a culinary training seat, let us know your requirements below.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-sm">
          {showWhatsAppRedirect ? (
            <div className="py-10 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FDF2F7] text-[#DE1B76] border border-[#F9A8D4]/40 flex items-center justify-center mx-auto shadow-2xs">
                <MessageCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#121214]">
                  Continue in WhatsApp
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {savedReference ? <>Your enquiry has been saved (reference <strong>{savedReference}</strong>). </> : null}Tap the button below to open WhatsApp with your prefilled details, then press <strong>Send</strong> so our team can reply quickly.{submitError ? <span className="block mt-2 text-amber-700">Note: {submitError} Your WhatsApp message will still reach us.</span> : null}
                </p>
              </div>

              {fileName && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 text-left space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Reference Photo Reminder:
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    You selected <strong>"{fileName}"</strong>. Browsers cannot automatically upload media into WhatsApp; please tap the attachment clip icon in your WhatsApp conversation to share the image.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 space-y-1">
                <p className="font-medium text-neutral-800">
                  Direct Line & WhatsApp:
                </p>
                <p className="text-[#DE1B76] font-semibold text-sm">
                  {BUSINESS_CONFIG.phoneFormatted}
                </p>
                <p className="text-[11px] text-neutral-500">
                  We reply promptly to confirm dates, design feasibility, and quotes.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={submittedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold py-3 px-6 rounded-full transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open WhatsApp Chat</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppRedirect(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
                >
                  Start New Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Selection & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-productType" className="block text-xs font-semibold text-neutral-700 mb-1">
                    What are you enquiring about? *
                  </label>
                  <select
                    id="enquiry-productType"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                    required
                  >
                    <option value="">-- Please Select Category or Item --</option>
                    <optgroup label="Cakes & Celebrations">
                      <option value="Bespoke Celebration Cake">Bespoke Celebration Cake</option>
                      <option value="Wedding Tiered Cake">Wedding Tiered Cake</option>
                      <option value="Artisan Cupcake Box">Artisan Cupcake Box</option>
                      <option value="Custom Cake Design">Other Custom Cake Design</option>
                    </optgroup>
                    <optgroup label="Pastries & Bread">
                      <option value="Flaky Meat & Savory Pies">Flaky Meat & Savory Pies</option>
                      <option value="Sweet Fruit Tartlets">Sweet Fruit Tartlets</option>
                      <option value="Gourmet Pastry Assortment Box">Gourmet Pastry Assortment Box</option>
                      <option value="Artisan Sourdough Loaf">Artisan Sourdough Loaf</option>
                      <option value="Butter Brioche Loaf / Rolls">Butter Brioche Loaf / Rolls</option>
                    </optgroup>
                    <optgroup label="Food & Catering">
                      <option value="Gourmet Jollof & Grilled Chicken">Gourmet Jollof & Grilled Chicken</option>
                      <option value="Executive Continental Lunch Bowl">Executive Continental Lunch Bowl</option>
                      <option value="Cocktail Canapé & Finger Food Buffet">Cocktail Canapé & Finger Food Buffet</option>
                      <option value="Full Event Catering Package">Full Event Catering Package</option>
                    </optgroup>
                    <optgroup label="Culinary Training">
                      <option value="Cake Training Masterclass">Cake Training Masterclass</option>
                      <option value="Pastry Training Workshop">Pastry Training Workshop</option>
                      <option value="Food Training & Catering Program">Food Training & Catering Program</option>
                    </optgroup>
                    <optgroup label="Lifestyle Products">
                      <option value="Artisanal Structured Handbag">Artisanal Structured Handbag</option>
                      <option value="Pearl Accent Jewellery Set">Pearl Accent Jewellery Set</option>
                      <option value="Signature Luxe Eau de Parfum">Signature Luxe Eau de Parfum</option>
                      <option value="Curated Gift Hamper">Curated Gift Hamper</option>
                    </optgroup>
                    <option value="Other Custom Request">Other Custom Commission / Unlisted Item</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="enquiry-quantity" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Quantity / Portions / Guest Count *
                  </label>
                  <input
                    id="enquiry-quantity"
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 1 tier (15 guests), 2 boxes, or 50 portions"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Free-text custom description */}
              <div>
                <label htmlFor="enquiry-customProductText" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tell us what you would like (Custom Specifications)
                </label>
                <input
                  id="enquiry-customProductText"
                  type="text"
                  name="customProductText"
                  value={formData.customProductText}
                  onChange={handleChange}
                  placeholder="Describe your ideal design, preferred packaging, colors, or menu preferences..."
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                />
              </div>

              {/* Preferred Date & Delivery Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-preferredDate" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Preferred Date / Event Date *
                  </label>
                  <input
                    id="enquiry-preferredDate"
                    type="date"
                    name="preferredDate"
                    min={today}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                    required
                  />
                  {dateError && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{dateError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="enquiry-deliveryLocation" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Delivery Location / Fulfillment *
                  </label>
                  <select
                    id="enquiry-deliveryLocation"
                    name="deliveryLocation"
                    value={formData.deliveryLocation}
                    onChange={handleChange}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                    required
                  >
                    <option value="">-- Select Pickup or Accra Area --</option>
                    {ACCRA_DELIVERY_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Delivery availability and fees are confirmed based on your location.
                  </p>
                </div>
              </div>

              {/* Cake / Confectionery Options */}
              {isCakeOrPastry && (
                <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-neutral-100 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                    Cake & Confectionery Details (Optional)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="enquiry-flavour" className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Preferred Flavour
                      </label>
                      <input
                        id="enquiry-flavour"
                        type="text"
                        name="flavour"
                        value={formData.flavour}
                        onChange={handleChange}
                        placeholder="e.g. Vanilla, Chocolate, Red Velvet..."
                        className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#DE1B76]"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiry-filling" className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Filling
                      </label>
                      <input
                        id="enquiry-filling"
                        type="text"
                        name="filling"
                        value={formData.filling}
                        onChange={handleChange}
                        placeholder="e.g. Salted Caramel, Fruit Compote..."
                        className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#DE1B76]"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiry-size" className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Size / Tiers
                      </label>
                      <input
                        id="enquiry-size"
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="e.g. 8-inch, 2-tier, 10-inch..."
                        className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#DE1B76]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="enquiry-themeDesign" className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Theme or Color Scheme
                      </label>
                      <input
                        id="enquiry-themeDesign"
                        type="text"
                        name="themeDesign"
                        value={formData.themeDesign}
                        onChange={handleChange}
                        placeholder="e.g. Pink & Gold, Botanical, Minimalist..."
                        className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#DE1B76]"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiry-inscription" className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Cake Inscription
                      </label>
                      <input
                        id="enquiry-inscription"
                        type="text"
                        name="inscription"
                        value={formData.inscription}
                        onChange={handleChange}
                        placeholder="e.g. Happy 30th Birthday Nana!"
                        className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-[#DE1B76]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Image Notice */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Reference Photo / Sketch (Optional)
                </label>
                <label className="border border-dashed border-neutral-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Upload className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="text-xs text-neutral-700">
                      {fileName ? (
                        <span className="font-semibold text-neutral-900">{fileName}</span>
                      ) : (
                        'Select an inspirational picture or moodboard image'
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] px-3 py-1 bg-neutral-100 rounded-full text-neutral-600 font-medium">
                    {fileName ? 'Change File' : 'Browse'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Note: Web browsers cannot automatically upload files into WhatsApp chats. When WhatsApp opens, please tap the attachment clip icon to share your selected photo directly with us.
                </p>
              </div>

              {/* Dietary / Special Instructions */}
              <div>
                <label htmlFor="enquiry-specialInstructions" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Dietary Notes or Special Instructions
                </label>
                <textarea
                  id="enquiry-specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Nut allergies, delivery landmark in Accra, packaging requests..."
                  className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
                ></textarea>
              </div>

              {/* Contact Info */}
              <div className="border-t border-neutral-100 pt-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                  Your Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="enquiry-customerName" className="block text-xs font-medium text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="enquiry-customerName"
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="enquiry-customerPhone" className="block text-xs font-medium text-neutral-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="enquiry-customerPhone"
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      placeholder="e.g. 055 247 1271"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="enquiry-customerEmail" className="block text-xs font-medium text-neutral-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      id="enquiry-customerEmail"
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="e.g. name@example.com"
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-full text-sm shadow-xs transition-all duration-200 active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>{submitting ? 'Saving your enquiry…' : 'Submit Enquiry'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
