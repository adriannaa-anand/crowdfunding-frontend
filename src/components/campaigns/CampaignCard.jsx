import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency, calcProgress, daysRemaining, truncate } from '../../utils/format';

const CATEGORY_COLORS = {
  education:   'bg-blue-50 text-blue-700',
  health:      'bg-green-50 text-green-700',
  environment: 'bg-emerald-50 text-emerald-700',
  technology:  'bg-purple-50 text-purple-700',
  arts:        'bg-pink-50 text-pink-700',
  community:   'bg-orange-50 text-orange-700',
  default:     'bg-surface-100 text-surface-600',
};

const getCategoryColor = (cat) =>
  CATEGORY_COLORS[cat?.toLowerCase()] || CATEGORY_COLORS.default;

export default function CampaignCard({ campaign, index = 0 }) {
  const progress = calcProgress(campaign.raised_amount, campaign.goal_amount);
  const days     = daysRemaining(campaign.deadline);
  const delay    = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className={`group block bg-white rounded-2xl overflow-hidden border border-surface-200
                  card-hover animate-fade-up ${delay}`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-brand-100 to-brand-200 overflow-hidden">
        {campaign.media_url ? (
          <img
            src={campaign.media_url}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🎯</span>
          </div>
        )}
        {/* Status badge */}
        {campaign.status === 'completed' && (
          <div className="absolute top-3 right-3 badge bg-green-500 text-white text-xs">
            ✓ Funded
          </div>
        )}
        {days <= 3 && days > 0 && campaign.status === 'active' && (
          <div className="absolute top-3 right-3 badge bg-red-500 text-white text-xs">
            ⚡ {days}d left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {campaign.category && (
          <span className={`badge text-xs mb-3 ${getCategoryColor(campaign.category)}`}>
            {campaign.category}
          </span>
        )}

        <h3 className="font-display font-semibold text-surface-900 text-lg leading-snug
                       mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
          {campaign.title}
        </h3>

        <p className="text-surface-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {truncate(campaign.description, 100)}
        </p>

        {/* Progress */}
        <ProgressBar value={progress} className="mb-3" />

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-body font-semibold text-surface-900">
              {formatCurrency(campaign.raised_amount)}
            </p>
            <p className="text-surface-400 text-xs">
              of {formatCurrency(campaign.goal_amount)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-body font-semibold text-brand-600">{progress}%</p>
            <p className="text-surface-400 text-xs">funded</p>
          </div>
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-100
                        text-xs text-surface-400">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {campaign.donor_count} donors
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {days > 0 ? `${days} days left` : 'Ended'}
          </span>
        </div>
      </div>
    </Link>
  );
}
