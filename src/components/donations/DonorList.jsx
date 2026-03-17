import { formatCurrency, timeAgo } from '../../utils/format';
import { Heart } from 'lucide-react';

export default function DonorList({ donations = [] }) {
  if (!donations.length) return (
    <div className="text-center py-8 text-surface-400 text-sm">
      Be the first to donate!
    </div>
  );

  return (
    <div className="space-y-3">
      {donations.map((d) => (
        <div key={d.id}
          className="flex items-start gap-3 p-3 rounded-xl bg-surface-50
                     hover:bg-surface-100 transition-colors">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center
                          justify-center flex-shrink-0">
            <span className="text-brand-600 font-medium text-sm">
              {d.donor_name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-sm text-surface-800 truncate">
                {d.donor_name}
              </span>
              <span className="text-brand-600 font-semibold text-sm flex-shrink-0">
                {formatCurrency(d.amount)}
              </span>
            </div>
            {d.message && (
              <p className="text-surface-500 text-xs mt-0.5 line-clamp-2">
                "{d.message}"
              </p>
            )}
            <p className="text-surface-400 text-xs mt-1">{timeAgo(d.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
