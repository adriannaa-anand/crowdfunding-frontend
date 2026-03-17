import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaigns';
import { useProgress } from '../hooks/useProgress';
import { donationService } from '../services/donationService';
import ProgressBar from '../components/common/ProgressBar';
import DonateModal from '../components/donations/DonateModal';
import DonorList from '../components/donations/DonorList';
import { Skeleton } from '../components/common/Skeleton';
import {
  formatCurrency, formatDate, daysRemaining, calcProgress,
} from '../utils/format';
import {
  Heart, Clock, Users, Share2, ArrowLeft, CheckCircle,
} from 'lucide-react';
import { useEffect } from 'react';

export default function CampaignDetail() {
  const { id } = useParams();
  const { campaign, loading, error } = useCampaign(id);
  const progress = useProgress(id);
  const [showModal,   setShowModal]   = useState(false);
  const [donations,   setDonations]   = useState([]);
  const [donLoading,  setDonLoading]  = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await donationService.getCampaignDonations(id);
        setDonations(data);
      } finally {
        setDonLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-72 rounded-2xl" />
      <Skeleton lines={4} />
    </div>
  );

  if (error || !campaign) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-surface-500 mb-4">Campaign not found</p>
      <Link to="/browse" className="btn-outline">Browse campaigns</Link>
    </div>
  );

  const live          = progress || campaign;
  const progressPct   = calcProgress(live.raised_amount, live.goal_amount);
  const days          = daysRemaining(campaign.deadline);
  const isActive      = campaign.status === 'active';
  const isCompleted   = campaign.status === 'completed';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/browse"
        className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-900
                   transition-colors mb-6 text-sm">
        <ArrowLeft size={16} />
        Back to campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-brand-100">
            {campaign.media_url ? (
              <img src={campaign.media_url} alt={campaign.title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">
                🎯
              </div>
            )}
            {isCompleted && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="badge bg-green-500 text-white text-base px-6 py-3">
                  <CheckCircle size={18} />
                  Goal Reached!
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            {campaign.category && (
              <span className="badge bg-brand-100 text-brand-700 text-xs mb-3">
                {campaign.category}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900
                           leading-tight mb-4">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-surface-500">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {days > 0 ? `${days} days remaining` : 'Campaign ended'}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {live.donor_count} donors
              </span>
              <span>Ends {formatDate(campaign.deadline)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-surface max-w-none">
            <p className="text-surface-700 leading-relaxed whitespace-pre-line text-base">
              {campaign.description}
            </p>
          </div>

          {/* Donors */}
          <div>
            <h3 className="font-display font-semibold text-lg text-surface-900 mb-4">
              Recent donors ({donations.length})
            </h3>
            {donLoading
              ? <Skeleton lines={3} />
              : <DonorList donations={donations} />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-surface-200 p-6 space-y-5">
            {/* Stats */}
            <div>
              <p className="font-display text-3xl font-bold text-surface-900">
                {formatCurrency(live.raised_amount)}
              </p>
              <p className="text-surface-400 text-sm mt-1">
                raised of {formatCurrency(live.goal_amount)} goal
              </p>
            </div>

            <ProgressBar value={progressPct} />

            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <p className="font-bold text-lg text-surface-900">{progressPct}%</p>
                <p className="text-xs text-surface-400">funded</p>
              </div>
              <div className="text-center border-x border-surface-100">
                <p className="font-bold text-lg text-surface-900">{live.donor_count}</p>
                <p className="text-xs text-surface-400">donors</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-surface-900">{days}</p>
                <p className="text-xs text-surface-400">days left</p>
              </div>
            </div>

            {/* CTA */}
            {isActive && (
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
                <Heart size={18} />
                Donate Now
              </button>
            )}
            {isCompleted && (
              <div className="flex items-center justify-center gap-2 py-4 rounded-xl
                              bg-green-50 text-green-700 font-medium">
                <CheckCircle size={18} />
                Campaign Funded!
              </div>
            )}

            <button
              onClick={handleShare}
              className="btn-secondary w-full flex items-center justify-center gap-2">
              <Share2 size={16} />
              Copy link
            </button>

            <p className="text-center text-xs text-surface-400">
              Secured by Stripe · Receipts via AWS SES
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <DonateModal
          campaign={campaign}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            donationService.getCampaignDonations(id)
              .then(({ data }) => setDonations(data));
          }}
        />
      )}
    </div>
  );
}
