import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useAuthStore } from '../../store/authStore';
import { donationService } from '../../services/donationService';
import { formatCurrency } from '../../utils/format';
import { X, Heart, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const AMOUNTS = [100, 500, 1000, 2500, 5000];

const CARD_STYLE = {
  style: {
    base: {
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '15px',
      color: '#1c1917',
      '::placeholder': { color: '#a8a29e' },
    },
    invalid: { color: '#ef4444' },
  },
};

export default function DonateModal({ campaign, onClose, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const { user } = useAuthStore();

  const [amount,      setAmount]      = useState(500);
  const [customAmt,   setCustomAmt]   = useState('');
  const [name,        setName]        = useState(user?.name || '');
  const [email,       setEmail]       = useState(user?.email || '');
  const [message,     setMessage]     = useState('');
  const [anonymous,   setAnonymous]   = useState(false);
  const [loading,     setLoading]     = useState(false);

  const finalAmount = customAmt ? parseFloat(customAmt) : amount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!name || !email) return toast.error('Name and email are required');
    if (finalAmount < 1)  return toast.error('Minimum donation is ₹1');

    setLoading(true);
    try {
      // 1. Create payment intent
      const { data } = await donationService.createPaymentIntent({
        campaign_id: campaign.id,
        amount: finalAmount,
        currency: 'inr',
        donor_name: name,
        donor_email: email,
        message,
        is_anonymous: anonymous,
      });

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Donation successful! Receipt sent to your email.');
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl
                      animate-scale-in max-h-[90vh] overflow-y-auto"
           onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <Heart size={16} className="text-brand-600 fill-brand-600" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-surface-900">
                Make a Donation
              </h2>
              <p className="text-xs text-surface-400 truncate max-w-[200px]">
                {campaign.title}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-100 transition-colors">
            <X size={18} className="text-surface-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount presets */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">
              Choose amount
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setCustomAmt(''); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all
                    ${amount === a && !customAmt
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300'}`}
                >
                  ₹{a >= 1000 ? `${a / 1000}k` : a}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount (₹)"
              value={customAmt}
              onChange={(e) => { setCustomAmt(e.target.value); setAmount(0); }}
              className="input"
              min="1"
            />
          </div>

          {/* Donor info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">
                Full name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Leave a note of encouragement..."
              className="input resize-none"
            />
          </div>

          {/* Anonymous toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setAnonymous(!anonymous)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer
                ${anonymous ? 'bg-brand-600' : 'bg-surface-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                               transition-transform ${anonymous ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm text-surface-600">Donate anonymously</span>
          </label>

          {/* Card */}
          <div>
            <label className="block text-xs font-medium text-surface-600 mb-1.5">
              Card details
            </label>
            <div className="input py-3.5">
              <CardElement options={CARD_STYLE} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !stripe}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Lock size={14} />
            {loading
              ? 'Processing...'
              : `Donate ${formatCurrency(finalAmount || 0)}`}
          </button>

          <p className="text-center text-xs text-surface-400 flex items-center justify-center gap-1">
            <Lock size={10} />
            Secured by Stripe · Receipt sent to your email
          </p>
        </form>
      </div>
    </div>
  );
}
