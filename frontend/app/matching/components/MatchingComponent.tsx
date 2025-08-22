'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaChartLine,
  FaLightbulb,
  FaPercentage,
  FaChartBar,
  FaRocket,
  FaStar,
  FaRobot,
  FaSpinner
} from 'react-icons/fa';

interface FactorBreakdown {
  industry_match: number;
  stage_match: number;
  market_match: number;
  risk_score: number;
  growth_potential: number;
  market_size_score: number;
}

interface MatchScore {
  compatibility_score: number;
  factor_breakdown: FactorBreakdown;
  suggestion_type: 'direct' | 'emerging' | 'diversification';
  confidence_score: number;
  recommendation_strength: 'high' | 'medium' | 'low';
  ai_analysis?: string;
  match_explanation?: string;
  startup?: string;
  startup_id?: number;
  investor?: string;
  investor_id?: number;
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

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'AI/ML',
  'Clean Energy', 'Biotech', 'EdTech', 'AgriTech', 'Cybersecurity'
];

const FUNDING_STAGES = [
  'Seed', 'Series A', 'Series B', 'Series C', 'Growth'
];

const MARKETS = [
  'North America', 'Europe', 'Asia', 'Global', 'Emerging Markets',
  'LATAM', 'APAC', 'Africa', 'Middle East'
];

export default function MatchingComponent() {
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchScore | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  const [startupForm, setStartupForm] = useState<StartupProfile>({
    startup: 0,
    industry: '',
    funding_stage: '',
    target_market: '',
    revenue: 0,
    growth_rate: 0,
    team_size: 0,
    technological_innovation: 5,
    market_size: 0,
    competition_level: 5
  });

  const [investorForm, setInvestorForm] = useState<InvestorProfile>({
    investor: user?.id || 0,
    preferred_industries: [],
    investment_stage: [],
    min_investment: 0,
    max_investment: 0,
    target_markets: [],
    risk_appetite: 5,
    expected_return: 20,
    investment_timeline: 24
  });

  // Update investor ID when user data becomes available
  useEffect(() => {
    if (user?.id) {
      setInvestorForm(prev => ({ ...prev, investor: user.id }));
    }
  }, [user]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '').replace(/\/api$/, '') || '';

  const getTokenFromStorage = useCallback(() => {
    const keys = ['token', 'access', 'authToken', 'access_token'];
    for (const k of keys) {
      const t = localStorage.getItem(k);
      if (t) return t;
    }
    return null;
  }, []);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting fetchMatches...');
      const token = getTokenFromStorage();
      console.log('Token retrieved:', token);
      
      if (!token) {
        setError('Authentication required - please login.');
        return;
      }

      if (!user?.id) {
        setError('User ID not found - please try logging in again.');
        return;
      }

      // Prepare form data
      const formData = user?.role === 'investor' 
        ? {
            ...investorForm,
            investor: Number(user.id), // Ensure investor ID is a number
            // Ensure arrays are not empty
            preferred_industries: Array.isArray(investorForm.preferred_industries) && investorForm.preferred_industries.length > 0 
              ? investorForm.preferred_industries 
              : ['Any'],
            investment_stage: Array.isArray(investorForm.investment_stage) && investorForm.investment_stage.length > 0 
              ? investorForm.investment_stage 
              : ['Any'],
            target_markets: Array.isArray(investorForm.target_markets) && investorForm.target_markets.length > 0 
              ? investorForm.target_markets 
              : ['Any'],
            // Ensure numeric fields are numbers
            min_investment: Number(investorForm.min_investment),
            max_investment: Number(investorForm.max_investment),
            risk_appetite: Number(investorForm.risk_appetite),
            expected_return: Number(investorForm.expected_return),
            investment_timeline: Number(investorForm.investment_timeline)
          }
        : {
            ...startupForm,
            startup: Number(user.id), // Ensure startup ID is a number
            // Ensure numeric fields are numbers
            revenue: Number(startupForm.revenue),
            growth_rate: Number(startupForm.growth_rate),
            team_size: Number(startupForm.team_size),
            technological_innovation: Number(startupForm.technological_innovation),
            market_size: Number(startupForm.market_size),
            competition_level: Number(startupForm.competition_level)
          };

      // Update profile
      const profileEndpoint = user?.role === 'investor'
        ? '/api/matchmaking/matches/update_preferences/'
        : '/api/matchmaking/matches/update_profile/';

      // Use the prepared form data
      const profileBody = formData;

      console.log('Sending profile update with data:', profileBody); // Debug log
      
      const profileResponse = await fetch(`${API_BASE}${profileEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileBody)
      });
      
      if (!profileResponse.ok) {
        const responseText = await profileResponse.text();
        console.log('Raw error response:', responseText);
        
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.log('Parsed error data:', errorData); // Debug log
        } catch (e) {
          console.error('Failed to parse error response:', e);
          errorData = null;
        }

        // Construct detailed error message
        let errorMessage;
        if (errorData && typeof errorData === 'object') {
          // Handle case where errorData contains field-specific errors
          if (errorData.investor) {
            errorMessage = `Investor error: ${errorData.investor.join(', ')}`;
          } else if (errorData.error || errorData.detail) {
            errorMessage = errorData.error || errorData.detail;
          } else {
            // If errorData is an object with other fields, stringify them
            errorMessage = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        } else {
          errorMessage = responseText || `Failed to update profile: ${profileResponse.status} ${profileResponse.statusText}`;
        }

        console.error('Profile update error details:', {
          status: profileResponse.status,
          statusText: profileResponse.statusText,
          errorData,
          errorMessage,
          rawResponse: responseText
        });

        throw new Error(errorMessage);
      }

      // Fetch matches
      const matchesResponse = await fetch(`${API_BASE}/api/matchmaking/matches/get_matches/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!matchesResponse.ok) {
        throw new Error(`Failed to fetch matches: ${matchesResponse.status}`);
      }

      const data = await matchesResponse.json() as MatchScore[];
      setMatches(data);
      if (data.length > 0) setSelectedMatch(data[0]);
    } catch (err) {
      console.error('Fetch error details:', err);
      let errorMessage;
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err);
      } else {
        errorMessage = 'An unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE, getTokenFromStorage, investorForm, startupForm, user]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated:', isAuthenticated); // Debugging authentication status
      console.log('User details:', user); // Debugging user details
      fetchMatches();
    } else {
      console.log('User is not authenticated.'); // Debugging unauthenticated state
    }
  }, [isAuthenticated, fetchMatches]);

  const renderFactorBreakdown = (factors: FactorBreakdown) => {
    const factorLabels = {
      industry_match: 'Industry Alignment',
      stage_match: 'Investment Stage',
      market_match: 'Market Focus',
      risk_score: 'Risk Profile',
      growth_potential: 'Growth Potential',
      market_size_score: 'Market Size'
    };

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">Key Match Factors:</div>
        {Object.entries(factors).map(([key, value]) => (
          <div key={key} className="relative pt-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                {factorLabels[key as keyof typeof factorLabels]}
              </div>
              <div className="text-sm font-medium text-blue-600">
                {Math.round((value ?? 0) * 100)}%
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-100">
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
      case 'direct': return <FaChartLine className="w-6 h-6 text-green-500" />;
      case 'emerging': return <FaRocket className="w-6 h-6 text-purple-500" />;
      case 'diversification': return <FaLightbulb className="w-6 h-6 text-yellow-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button
          onClick={fetchMatches}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
        <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaRobot className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Matching</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered connections that understand your investment needs
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {user?.role === 'investor' ? 'Investment Preferences' : 'Startup Profile'}
        </h2>
        
        <form onSubmit={(e) => { e.preventDefault(); fetchMatches(); }} className="space-y-6">
          {user?.role === 'investor' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Industries
                  </label>
                  <select
                    multiple
                    value={investorForm.preferred_industries}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setInvestorForm(prev => ({ ...prev, preferred_industries: values }));
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Stages
                  </label>
                  <select
                    multiple
                    value={investorForm.investment_stage}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setInvestorForm(prev => ({ ...prev, investment_stage: values }));
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    {FUNDING_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={investorForm.min_investment}
                      onChange={(e) => setInvestorForm(prev => ({ ...prev, min_investment: Number(e.target.value) }))}
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={investorForm.max_investment}
                      onChange={(e) => setInvestorForm(prev => ({ ...prev, max_investment: Number(e.target.value) }))}
                      className="p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Appetite (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={investorForm.risk_appetite}
                    onChange={(e) => setInvestorForm(prev => ({ ...prev, risk_appetite: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={startupForm.industry}
                    onChange={(e) => setStartupForm(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Stage
                  </label>
                  <select
                    value={startupForm.funding_stage}
                    onChange={(e) => setStartupForm(prev => ({ ...prev, funding_stage: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Stage</option>
                    {FUNDING_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="Revenue"
                    value={startupForm.revenue}
                    onChange={(e) => setStartupForm(prev => ({ ...prev, revenue: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="Growth Rate"
                    value={startupForm.growth_rate}
                    onChange={(e) => setStartupForm(prev => ({ ...prev, growth_rate: Number(e.target.value) }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Finding Matches...' : 'Find Matches'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-200 ${
                selectedMatch === match ? 'ring-2 ring-blue-500' : ''
              }`}
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
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 lg:sticky lg:top-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Match Details</h3>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">Match Score</div>
              <div className="flex items-center space-x-2">
                <div className="text-4xl font-bold text-blue-600">
                  {Math.round(selectedMatch.compatibility_score)}%
                </div>
                <div className="text-sm text-gray-600">
                  Compatibility
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-4">Match Analysis</div>
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <div className="text-sm text-gray-800 leading-relaxed">
                  {selectedMatch.match_explanation || "No match explanation available."}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-4">Match Factors</div>
              {renderFactorBreakdown(selectedMatch.factor_breakdown)}
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