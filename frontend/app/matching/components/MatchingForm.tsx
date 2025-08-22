import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export const INDUSTRIES = [
  'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'AI/ML',
  'Clean Energy', 'Biotech', 'EdTech', 'AgriTech', 'Cybersecurity'
];

export const FUNDING_STAGES = [
  'Seed', 'Series A', 'Series B', 'Series C', 'Growth'
];

export const MARKETS = [
  'North America', 'Europe', 'Asia', 'Global', 'Emerging Markets',
  'LATAM', 'APAC', 'Africa', 'Middle East'
];

interface Props {
  type: 'startup' | 'investor';
  formData: any;
  updateForm: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function MatchingForm({ type, formData, updateForm, onSubmit, loading }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {type === 'startup' ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Startup Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.industry}
                  onChange={(e) => updateForm('industry', e.target.value)}
                  required
                >
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Funding Stage</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.funding_stage}
                  onChange={(e) => updateForm('funding_stage', e.target.value)}
                  required
                >
                  <option value="">Select Stage</option>
                  {FUNDING_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Market</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.target_market}
                  onChange={(e) => updateForm('target_market', e.target.value)}
                  required
                >
                  <option value="">Select Market</option>
                  {MARKETS.map(market => (
                    <option key={market} value={market}>{market}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Revenue (USD)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.revenue}
                  onChange={(e) => updateForm('revenue', Number(e.target.value))}
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Growth Rate (%)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.growth_rate}
                  onChange={(e) => updateForm('growth_rate', Number(e.target.value))}
                  required
                  min="0"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Team Size</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.team_size}
                  onChange={(e) => updateForm('team_size', Number(e.target.value))}
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Innovation Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="mt-1 block w-full"
                  value={formData.technological_innovation}
                  onChange={(e) => updateForm('technological_innovation', Number(e.target.value))}
                />
                <div className="text-sm text-gray-500 mt-1">Level: {formData.technological_innovation}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Market Size (USD)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.market_size}
                  onChange={(e) => updateForm('market_size', Number(e.target.value))}
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Competition Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="mt-1 block w-full"
                  value={formData.competition_level}
                  onChange={(e) => updateForm('competition_level', Number(e.target.value))}
                />
                <div className="text-sm text-gray-500 mt-1">Level: {formData.competition_level}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Investor Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Industries</label>
                <select
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.preferred_industries}
                  onChange={(e) => updateForm('preferred_industries', 
                    Array.from(e.target.selectedOptions, option => option.value))}
                  required
                >
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Stages</label>
                <select
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.investment_stage}
                  onChange={(e) => updateForm('investment_stage',
                    Array.from(e.target.selectedOptions, option => option.value))}
                  required
                >
                  {FUNDING_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Markets</label>
                <select
                  multiple
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.target_markets}
                  onChange={(e) => updateForm('target_markets',
                    Array.from(e.target.selectedOptions, option => option.value))}
                  required
                >
                  {MARKETS.map(market => (
                    <option key={market} value={market}>{market}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Min Investment (USD)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.min_investment}
                  onChange={(e) => updateForm('min_investment', Number(e.target.value))}
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Investment (USD)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.max_investment}
                  onChange={(e) => updateForm('max_investment', Number(e.target.value))}
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Risk Appetite (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="mt-1 block w-full"
                  value={formData.risk_appetite}
                  onChange={(e) => updateForm('risk_appetite', Number(e.target.value))}
                />
                <div className="text-sm text-gray-500 mt-1">Level: {formData.risk_appetite}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Return (%)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.expected_return}
                  onChange={(e) => updateForm('expected_return', Number(e.target.value))}
                  required
                  min="0"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Timeline (months)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.investment_timeline}
                  onChange={(e) => updateForm('investment_timeline', Number(e.target.value))}
                  required
                  min="1"
                />
              </div>
            </div>
          </>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              'Find Matches'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
