// Loads Paystack's inline popup script on demand. Uses the PUBLIC key only.
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

let loading;
function loadScript() {
  if (window.PaystackPop) return Promise.resolve();
  loading ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = resolve;
    s.onerror = () => { loading = null; reject(new Error('Could not load Paystack. Check your connection.')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Opens the popup. Resolves on success, rejects if the user closes it. */
export async function openPaystack({ email, amountMinor, currency, reference }) {
  if (!PAYSTACK_PUBLIC_KEY) throw new Error('Paystack public key is missing (VITE_PAYSTACK_PUBLIC_KEY).');
  await loadScript();
  return new Promise((resolve, reject) => {
    window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amountMinor,
      currency,
      ref: reference,
      callback: () => resolve(reference),
      onClose: () => reject(new Error('Payment window closed.')),
    }).openIframe();
  });
}
