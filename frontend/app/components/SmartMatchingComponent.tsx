'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  FaChartLine,
  FaLightbulb,
  FaPercentage,
  FaChartBar,
  FaRocket,
  FaStar
} from 'react-icons/fa';

interface MatchScore {
  compatibility_score: number;
  factor_breakdown: {
    industry_match: number;
    stage_match: number;
    market_match: number;
    risk_score: number;
    growth_potential: number;
    market_size_score: number;
  };
  suggestion_type: 'direct' | 'emerging' | 'diversification';
  confidence_score: number;
  recommendation_strength: 'high' | 'medium' | 'low';
  startup?: string;
  startup_id?: number;
  investor?: string;
  investor_id?: number;
  ai_analysis?: string;
  match_explanation?: string;
}

export default function SmartMatchingComponent() {
  // Start with loading=false so unauthenticated users don't see an infinite spinner
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Allow a configurable API base URL (useful for local backend at /api or external host)
  // Normalize API base: remove trailing slash and any trailing '/api' to avoid double '/api/api' when
  // endpoints include the '/api' prefix already.
  const _API_BASE_RAW = process.env.NEXT_PUBLIC_API_URL || '';
  let API_BASE = _API_BASE_RAW.replace(/\/$/, '');
  API_BASE = API_BASE.replace(/\/api$/, '');

  useEffect(() => {
    console.log('SmartMatchingComponent mounted. isAuthenticated=', isAuthenticated, 'user=', user);
    if (isAuthenticated) {
      fetchMatches();
    } else {
      // prevent permanent loading when not logged in
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Try common localStorage keys for tokens
  const getTokenFromStorage = () => {
    const keys = ['token', 'access', 'authToken', 'access_token'];
    for (const k of keys) {
      const t = localStorage.getItem(k);
      if (t) return t;
    }
    return null;
  };

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear any previous error
      setError(null);

      const profileEndpoint = user?.role === 'investor'
        ? '/api/matchmaking/matches/update_preferences/'
        : '/api/matchmaking/matches/update_factors/';

      const token = getTokenFromStorage();
      console.log('fetchMatches: token found?', !!token);
      if (!token) {
        setError('Authentication required - please login.');
        return;
      }

      // Post profile (backend may update/create) using configured API_BASE
      const profileUrl = `${API_BASE}${profileEndpoint}`;
      console.log('Posting profile to:', profileUrl);

      interface InvestorProfile {
        investor: number;
        preferred_industries: string[];
        investment_stage: string[];
        min_investment: number;
        max_investment: number;
        target_markets: string[];
        risk_appetite: number;
        expected_return: number;
        investment_timeline: number;
      }

      interface StartupProfile {
        startup: number;
        industry: string;
        funding_stage: string;
        target_market: string;
        revenue: number;
        growth_rate: number;
        team_size: number;
        technological_innovation: number;
        market_size: number;
        competition_level: number;
      }

      const profileBody = user?.role === 'investor'
        ? {
            investor: user.id,
            preferred_industries: ['Technology', 'Healthcare', 'Finance'],
            investment_stage: ['Seed', 'Series A'],
            min_investment: 50000,
            max_investment: 1000000,
            target_markets: ['Global', 'North America'],
            risk_appetite: 7,
            expected_return: 25.0,
            investment_timeline: 36
          } as InvestorProfile
        : {
            startup: user?.id,
            industry: 'Technology',
            funding_stage: 'Seed',
            target_market: 'Global',
            revenue: 100000,
            growth_rate: 15.5,
            team_size: 10,
            technological_innovation: 8,
            market_size: 1000000000,
            competition_level: 7
          } as StartupProfile;

      const profileResponse = await fetch(profileUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileBody)
      });

      if (!profileResponse.ok) {
        const txt = await profileResponse.text().catch(() => null);
        throw new Error(`Failed to update profile data (${profileResponse.status}) ${txt || ''}`);
      }

      // Fetch matches
      const matchesUrl = `${API_BASE}/api/matchmaking/matches/get_matches/`;
      console.log('Fetching matches from:', matchesUrl);
      const matchesResponse = await fetch(matchesUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!matchesResponse.ok) {
        const txt = await matchesResponse.text().catch(() => null);
        throw new Error(`Failed to fetch matches (${matchesResponse.status}) ${txt || ''}`);
      }

      const data = await matchesResponse.json();
      console.log('matches response data:', data);

      // Basic validation
      if (!Array.isArray(data)) {
        throw new Error('Invalid matches response from server (expected array)');
      }

      setMatches(data as MatchScore[]);
      if ((data as MatchScore[]).length > 0) setSelectedMatch((data as MatchScore[])[0]);
    } catch (err) {
      console.error('Error in fetchMatches:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching matches');
    } finally {
      setLoading(false);
    }
  };

  const renderFactorBreakdown = (factors: MatchScore['factor_breakdown']) => {
    if (!factors) return <div className="text-sm text-gray-600">No factor data available.</div>;

    const factorLabels = {
      industry_match: 'Industry Alignment',
      stage_match: 'Investment Stage',
      market_match: 'Market Focus',
      risk_score: 'Risk Profile',
      growth_potential: 'Growth Potential',
      market_size_score: 'Market Size'
    } as Record<string, string>;

    return (
      <div className="space-y-4">
        {Object.entries(factors).map(([key, value]) => (
          <div key={key} className="relative pt-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                {factorLabels[key] ?? key}
              </div>
              <div className="text-sm font-medium text-blue-600">
                {Math.round((value ?? 0) * 100)}%
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${(value ?? 0) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getSuggestionTypeIcon = (type: string) => {
    switch (type) {
      case 'direct':
        return <FaChartLine className="w-6 h-6 text-green-500" />;
      case 'emerging':
        return <FaRocket className="w-6 h-6 text-purple-500" />;
      case 'diversification':
        return <FaLightbulb className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button
          onClick={fetchMatches}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matches List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Matches</h2>

          {matches.length === 0 && (
            <div className="text-gray-600">No matches found. Click "Try Again" or check your profile and backend.</div>
          )}

          {matches.map((match, index) => (
            <div
              key={index}
              onClick={() => setSelectedMatch(match)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getSuggestionTypeIcon(match.suggestion_type)}
                  <h3 className="text-lg font-semibold">
                    {user?.role === 'investor' ? match.startup : match.investor}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPercentage className="w-4 h-4 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(match.compatibility_score)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <FaChartBar className="w-4 h-4 mr-1" />
                  {match.suggestion_type.charAt(0).toUpperCase() + match.suggestion_type.slice(1)}
                </span>
                <span className="flex items-center">
                  <FaStar className="w-4 h-4 mr-1" />
                  {match.recommendation_strength.charAt(0).toUpperCase() + match.recommendation_strength.slice(1)} Match
                </span>
              </div>

              <div className="mt-3 text-sm">
                <div className="font-medium text-gray-700 mb-1">AI Analysis:</div>
                <div className="text-gray-600 bg-blue-50 rounded-md p-3">
                  {match.ai_analysis || "Based on our AI analysis, this match shows strong potential for collaboration."}
                </div>
              </div>

              {match.match_explanation && (
                <div className="mt-3 text-sm">
                  <div className="font-medium text-gray-700 mb-1">Why This Match?</div>
                  <div className="text-gray-600">
                    {match.match_explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Match Details */}
        {selectedMatch && (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">AI-Powered Match Analysis</h3>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Overall Compatibility</div>
              <div className="flex items-center space-x-2">
                <div className="text-4xl font-bold text-blue-600">
                  {Math.round(selectedMatch.compatibility_score)}%
                </div>
                <div className="text-sm text-gray-600">
                  {selectedMatch.recommendation_strength === 'high'
                    ? 'Excellent Match'
                    : selectedMatch.recommendation_strength === 'medium'
                      ? 'Good Match'
                      : 'Potential Match'}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-4">Gemini AI Analysis</div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-800 leading-relaxed">
                  {selectedMatch.ai_analysis || "Our AI has analyzed multiple factors to determine this match's potential. The analysis considers industry alignment, market dynamics, growth trajectories, and investment patterns to provide intelligent matching suggestions."}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-4">Factor Breakdown</div>
              {renderFactorBreakdown(selectedMatch.factor_breakdown)}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                {getSuggestionTypeIcon(selectedMatch.suggestion_type)}
                <span className="font-medium text-blue-900">
                  {selectedMatch.suggestion_type === 'direct'
                    ? 'Strong Direct Match'
                    : selectedMatch.suggestion_type === 'emerging'
                      ? 'Emerging Opportunity'
                      : 'Diversification Opportunity'}
                </span>
              </div>
              <p className="text-sm text-blue-800">
                {selectedMatch.suggestion_type === 'direct'
                  ? 'Our AI identifies this as a highly compatible match based on your criteria and preferences.'
                  : selectedMatch.suggestion_type === 'emerging'
                    ? 'While some parameters differ from your typical preferences, our AI detects exceptional potential in this match.'
                    : 'This match presents a strategic diversification opportunity with unique advantages.'}
              </p>
            </div>

            {selectedMatch.match_explanation && (
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-500 mb-2">Detailed Match Explanation</div>
                <div className="text-sm text-gray-600">
                  {selectedMatch.match_explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
