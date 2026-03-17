import { useState } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignCard from '../components/campaigns/CampaignCard';
import CampaignFilters from '../components/campaigns/CampaignFilters';
import { CampaignCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Browse() {
  const [filters, setFilters] = useState({ page: 1, limit: 12, status: 'active' });
  const { campaigns, loading, meta } = useCampaigns(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-surface-900 mb-2">
          Browse campaigns
        </h1>
        <p className="text-surface-500">
          {meta.total ? `${meta.total} campaigns found` : 'Discover and support causes that matter'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <CampaignFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <CampaignCardSkeleton key={i} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No campaigns found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((c, i) => (
            <CampaignCard key={c.id} campaign={c} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            disabled={filters.page <= 1}
            className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-surface-600 px-4">
            Page {filters.page} of {meta.pages}
          </span>
          <button
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            disabled={filters.page >= meta.pages}
            className="p-2 rounded-xl border border-surface-200 hover:bg-surface-50
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
