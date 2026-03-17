import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { formatCurrency, formatDate } from '../utils/format';
import { Skeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { Heart, ExternalLink } from 'lucide-react';

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-amber-100 text-amber-700',
  failed:    'bg-red-100 text-red-700',
  refunded:  'bg-surface-100 text-surface-600',
};

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    donationService.getMyDonations()
      .then(({ data }) => setDonations(data))
      .finally(() => setLoading(false));
  }, []);

  const total = donations
    .filter((d) => d.status === 'confirmed')
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-surface-900 mb-2">
        My Donations
      </h1>
      <p className="text-surface-500 mb-8">Your giving history</p>

      {/* Total stat */}
      {!loading && donations.length > 0 && (
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-8
                        flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <Heart size={20} className="text-brand-600 fill-brand-600" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-brand-700">
              {formatCurrency(total)}
            </p>
            <p className="text-sm text-brand-600">
              donated across {donations.filter((d) => d.status === 'confirmed').length} campaigns
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-5">
              <Skeleton lines={3} />
            </div>
          ))}
        </div>
      ) : donations.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No donations yet"
          description="Browse campaigns and make your first donation."
          action={{ label: 'Browse campaigns', href: '/browse' }}
        />
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <div key={d.id}
              className="bg-white rounded-2xl border border-surface-200 p-5
                         hover:border-surface-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-medium text-surface-900 truncate">
                      Campaign ID: {d.campaign_id?.slice(0, 8)}…
                    </p>
                    <span className={`badge text-xs ${STATUS_STYLES[d.status] || STATUS_STYLES.pending}`}>
                      {d.status}
                    </span>
                  </div>
                  {d.message && (
                    <p className="text-sm text-surface-500 italic mt-1 line-clamp-1">
                      "{d.message}"
                    </p>
                  )}
                  <p className="text-xs text-surface-400 mt-2">
                    {formatDate(d.createdAt)} · {d.currency}
                    {d.is_anonymous && ' · Anonymous'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="font-display font-bold text-xl text-surface-900">
                    {formatCurrency(d.amount, d.currency)}
                  </p>
                  <Link to={`/campaign/${d.campaign_id}`}
                    className="p-2 rounded-lg hover:bg-surface-100 text-surface-400
                               hover:text-surface-700 transition-colors">
                    <ExternalLink size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
