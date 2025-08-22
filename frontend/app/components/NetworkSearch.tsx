import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

interface NetworkSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: NetworkFilters) => void;
}

export interface NetworkFilters {
  type: 'all' | 'investor' | 'startup';
  industry?: string;
  location?: string;
}

export default function NetworkSearch({ onSearch, onFilter }: NetworkSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NetworkFilters>({
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing'
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (newFilters: Partial<NetworkFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search network..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaSearch />
          </button>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value as NetworkFilters['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="investor">Investors</option>
                <option value="startup">Startups</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange({ industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location || ''}
                onChange={(e) => handleFilterChange({ location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
