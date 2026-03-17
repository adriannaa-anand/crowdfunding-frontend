import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import ProgressBar from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import {
  formatCurrency, formatNumber, calcProgress, daysRemaining,
} from '../utils/format';
import {
  TrendingUp, Users, IndianRupee, LayoutGrid, PlusCircle, ExternalLink,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    blue:  'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-bold text-surface-900">{value}</p>
      <p className="text-sm text-surface-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5">
            <Skeleton lines={3} />
          </div>
        ))}
      </div>
    </div>
  );

  const s = data?.summary || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-500 mt-1">Your campaign performance at a glance</p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} />
          New Campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={IndianRupee} color="brand"
          label="Total raised"
          value={formatCurrency(s.total_raised || 0)}
          sub="All time"
        />
        <StatCard
          icon={Users} color="blue"
          label="Total donors"
          value={formatNumber(s.total_donations || 0)}
          sub="Unique donors"
        />
        <StatCard
          icon={TrendingUp} color="green"
          label="Avg donation"
          value={formatCurrency(s.avg_donation || 0)}
          sub="Per donation"
        />
        <StatCard
          icon={LayoutGrid} color="amber"
          label="Campaigns"
          value={data?.campaigns?.length || 0}
          sub="Active + completed"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-8">
        <h2 className="font-display font-semibold text-lg text-surface-900 mb-5">
          Donations — last 30 days
        </h2>
        <AnalyticsChart data={data?.daily_stats || []} />
      </div>

      {/* Campaigns table */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6">
        <h2 className="font-display font-semibold text-lg text-surface-900 mb-5">
          Your campaigns
        </h2>

        {!data?.campaigns?.length ? (
          <EmptyState
            icon={LayoutGrid}
            title="No campaigns yet"
            description="Create your first campaign to start raising funds."
            action={{ label: 'Create campaign', href: '/create' }}
          />
        ) : (
          <div className="space-y-4">
            {data.campaigns.map((c) => (
              <div key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl
                           hover:bg-surface-50 transition-colors border border-transparent
                           hover:border-surface-200">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-surface-900 truncate">{c.title}</p>
                    <span className={`badge text-xs flex-shrink-0
                      ${c.status === 'active'    ? 'bg-green-100 text-green-700'
                      : c.status === 'completed' ? 'bg-blue-100 text-blue-700'
                      : 'bg-surface-100 text-surface-500'}`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-surface-400">
                    <span>{formatCurrency(c.raised_amount)} raised</span>
                    <span>{c.donor_count} donors</span>
                    <span>{daysRemaining(c.deadline)} days left</span>
                  </div>
                  <ProgressBar
                    value={calcProgress(c.raised_amount, c.goal_amount)}
                    className="mt-2 w-48"
                  />
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-brand-600 text-lg">
                    {calcProgress(c.raised_amount, c.goal_amount)}%
                  </p>
                  <p className="text-xs text-surface-400">
                    of {formatCurrency(c.goal_amount)}
                  </p>
                </div>
                <Link to={`/campaign/${c.id}`}
                  className="p-2 rounded-lg hover:bg-surface-100 text-surface-400
                             hover:text-surface-700 transition-colors flex-shrink-0">
                  <ExternalLink size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
