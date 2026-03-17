import { Search } from 'lucide-react';

const CATEGORIES = [
  'All', 'Education', 'Health', 'Environment',
  'Technology', 'Arts', 'Community',
];

export default function CampaignFilters({ filters, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className="input pl-10"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category || ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value, page: 1 })}
        className="input w-full sm:w-44"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c === 'All' ? '' : c.toLowerCase()}>
            {c}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort || 'newest'}
        onChange={(e) => onChange({ ...filters, sort: e.target.value, page: 1 })}
        className="input w-full sm:w-40"
      >
        <option value="newest">Newest</option>
        <option value="ending_soon">Ending Soon</option>
        <option value="most_funded">Most Funded</option>
      </select>
    </div>
  );
}
