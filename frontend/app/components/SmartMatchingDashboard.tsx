import { useState, useEffect } from 'react';
import { NetworkMember } from '../services/networkService';
import { matchingService, filterOptions, MatchingFilters } from '../services/matchingService';

export default function SmartMatchingDashboard() {
  const [matches, setMatches] = useState<NetworkMember[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState<MatchingFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
    fetchStats();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await matchingService.getMatches(filters);
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const data = await matchingService.getMatchingStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (filterType: keyof MatchingFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    fetchMatches();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Smart Matching Dashboard</h1>
      
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Match Quality</h3>
            <div className="space-y-2">
              <p className="text-green-600">High Matches: {stats.highMatchCount}</p>
              <p className="text-yellow-600">Medium Matches: {stats.mediumMatchCount}</p>
              <p className="text-red-600">Low Matches: {stats.lowMatchCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Top Industries</h3>
            <ul className="list-disc list-inside">
              {stats.topIndustries.map((industry: string) => (
                <li key={industry}>{industry}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Top Countries</h3>
            <ul className="list-disc list-inside">
              {stats.topCountries.map((country: string) => (
                <li key={country}>{country}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industries
            </label>
            <select
              className="w-full rounded-lg border-gray-300"
              onChange={(e) => handleFilterChange('industry', Array.from(e.target.selectedOptions, option => option.value))}
              multiple
            >
              {filterOptions.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Countries
            </label>
            <select
              className="w-full rounded-lg border-gray-300"
              onChange={(e) => handleFilterChange('country', Array.from(e.target.selectedOptions, option => option.value))}
              multiple
            >
              {filterOptions.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Range
            </label>
            <select
              className="w-full rounded-lg border-gray-300"
              onChange={(e) => handleFilterChange('investmentRange', e.target.value)}
            >
              <option value="">All Ranges</option>
              {filterOptions.investmentRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8">No matches found</div>
        ) : (
          matches.map(match => (
            <div
              key={match.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{match.name}</h3>
                  <p className="text-gray-600">{match.role} at {match.company}</p>
                  <p className="text-sm text-gray-500 mt-2">{match.description}</p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Location:</span> {match.location}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Industry:</span> {match.industry}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Investment Range:</span> {match.investmentRange}
                    </p>
                    {match.preferredSectors && (
                      <p className="text-sm">
                        <span className="font-medium">Preferred Sectors:</span>{' '}
                        {match.preferredSectors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    (match.matchScore || 0) >= 90 ? 'text-green-600' :
                    (match.matchScore || 0) >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {match.matchScore}%
                  </div>
                  <div className="text-sm text-gray-500">Match Score</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
