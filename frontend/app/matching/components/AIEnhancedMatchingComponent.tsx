'use client';

import React, { useState, useEffect } from 'react';
import { recommenderService } from '../../services/recommenderService';

interface DummyStartup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  founding_date: number;
  employees: number;
  mrr: number;
  growth_rate: number;
  burn_rate: number;
  funding_to_date: number;
  description: string;
  location: string;
  last_valuation: number;
}

interface DummyInvestor {
  id: string;
  name: string;
  type: string;
  avg_check_size: number;
  preferred_sectors: string[];
  preferred_stages: string[];
  min_roi: number;
  risk_appetite: number;
  years_active: number;
  thesis: string;
  location: string;
  total_investments: number;
}

interface MatchResult {
  compatibility: number;
  traction: number;
  sectorAlignment: number;
  aiAnalysis: string;
  startup: DummyStartup;
  investor: DummyInvestor;
}

const AIEnhancedMatchingComponent: React.FC = () => {
  const [startups, setStartups] = useState<DummyStartup[]>([]);
  const [investors, setInvestors] = useState<DummyInvestor[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<string>('');
  const [selectedInvestor, setSelectedInvestor] = useState<string>('');
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load dummy data on component mount
  useEffect(() => {
    const loadDummyData = async () => {
      try {
        // Load startups data
        const startupsResponse = await fetch('/api/dummy-startups');
        if (startupsResponse.ok) {
          const startupsData = await startupsResponse.json();
          setStartups(startupsData);
        }

        // Load investors data
        const investorsResponse = await fetch('/api/dummy-investors');
        if (investorsResponse.ok) {
          const investorsData = await investorsResponse.json();
          setInvestors(investorsData);
        }
      } catch (err) {
        console.error('Error loading dummy data:', err);
        // Fallback to hardcoded data if API fails
        setStartups([
          {
            id: "stp_0",
            name: "Taylor-Cruz",
            sector: "CleanTech",
            stage: "Series A",
            founding_date: 1728604800000,
            employees: 14,
            mrr: 447000,
            growth_rate: 0.7424242132,
            burn_rate: 23000,
            funding_to_date: 4276000,
            description: "Right during will whether value machine certainly. Understand name thing. Scientist staff actually big main song despite.",
            location: "Antigua and Barbuda",
            last_valuation: 8000000
          },
          {
            id: "stp_1",
            name: "Gonzalez-Wilcox",
            sector: "Fintech",
            stage: "Pre-seed",
            founding_date: 1753056000000,
            employees: 196,
            mrr: 0,
            growth_rate: 0.8986384407,
            burn_rate: 75000,
            funding_to_date: 1257000,
            description: "Suggest standard yard address pass of. Window lose under type someone.",
            location: "Colombia",
            last_valuation: 28000000
          },
          {
            id: "stp_2",
            name: "Burns-Ruiz",
            sector: "Tech",
            stage: "Seed",
            founding_date: 1721088000000,
            employees: 116,
            mrr: 476000,
            growth_rate: 0.0533403816,
            burn_rate: 16000,
            funding_to_date: 3297000,
            description: "Share it white down company factor project. Figure bad personal finish. Year name price bad enjoy room probably.",
            location: "Switzerland",
            last_valuation: 33000000
          }
        ]);

        setInvestors([
          {
            id: "inv_0",
            name: "Simmons LLC",
            type: "VC",
            avg_check_size: 62000,
            preferred_sectors: ["Fintech", "Healthcare", "AI/ML"],
            preferred_stages: ["Pre-seed"],
            min_roi: 10,
            risk_appetite: 1,
            years_active: 19,
            thesis: "Second support performance wear. Control sound song after person build crime owner.",
            location: "San Marino",
            total_investments: 59
          },
          {
            id: "inv_1",
            name: "Stewart, Burns and Hurley",
            type: "VC",
            avg_check_size: 65000,
            preferred_sectors: ["Healthcare"],
            preferred_stages: ["Growth"],
            min_roi: 2,
            risk_appetite: 5,
            years_active: 7,
            thesis: "Ask me trip. Billion threat today few stage coach.",
            location: "Taiwan",
            total_investments: 96
          },
          {
            id: "inv_2",
            name: "Mcfarland PLC",
            type: "PE",
            avg_check_size: 162000,
            preferred_sectors: ["Enterprise", "Fintech"],
            preferred_stages: ["Seed"],
            min_roi: 8,
            risk_appetite: 3,
            years_active: 9,
            thesis: "Hear computer serious star way. Resource raise matter chair.",
            location: "Mexico",
            total_investments: 24
          }
        ]);
      }
    };

    loadDummyData();
  }, []);

  const handleMatch = async () => {
    if (!selectedStartup || !selectedInvestor) {
      setError('Please select both a startup and an investor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const startup = startups.find(s => s.id === selectedStartup);
      const investor = investors.find(i => i.id === selectedInvestor);

      if (!startup || !investor) {
        setError('Selected startup or investor not found');
        return;
      }

      // Convert startup founding date from timestamp to YYYY-MM-DD format
      const foundingDate = new Date(startup.founding_date).toISOString().split('T')[0];

      const result = await recommenderService.getSmartMatch(
        {
          type: investor.type,
          preferred_sectors: investor.preferred_sectors,
          preferred_stages: investor.preferred_stages,
          min_roi: investor.min_roi,
          risk_appetite: investor.risk_appetite,
          avg_check_size: investor.avg_check_size,
          years_active: investor.years_active,
          total_investments: investor.total_investments,
          thesis: investor.thesis,
          location: investor.location
        },
        {
          sector: startup.sector,
          stage: startup.stage,
          location: startup.location,
          founding_date: foundingDate,
          employees: startup.employees,
          mrr: startup.mrr,
          growth_rate: startup.growth_rate,
          burn_rate: startup.burn_rate,
          funding_to_date: startup.funding_to_date,
          description: startup.description,
          last_valuation: startup.last_valuation
        }
      );

      const matchResult: MatchResult = {
        compatibility: result.compatibility_score,
        traction: result.traction_score || 0,
        sectorAlignment: result.sector_similarity || 0,
        aiAnalysis: result.ai_analysis,
        startup: startup,
        investor: investor
      };

      setMatchResults([matchResult]);
    } catch (err) {
      setError('Error performing match analysis. Please try again.');
      console.error('Match error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Smart Matching
        </h1>
        <p className="text-xl text-gray-600">
          Discover optimal investor-startup matches using advanced AI algorithms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investor Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Select Investor
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investor
              </label>
              <select
                value={selectedInvestor}
                onChange={(e) => setSelectedInvestor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an investor...</option>
                {investors.map((investor) => (
                  <option key={investor.id} value={investor.id}>
                    {investor.name} - {investor.type} ({investor.location})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedInvestor && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {investors.find(i => i.id === selectedInvestor)?.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Type:</span> {investors.find(i => i.id === selectedInvestor)?.type}</p>
                  <p><span className="font-medium">Location:</span> {investors.find(i => i.id === selectedInvestor)?.location}</p>
                  <p><span className="font-medium">Preferred Sectors:</span> {investors.find(i => i.id === selectedInvestor)?.preferred_sectors.join(', ')}</p>
                  <p><span className="font-medium">Preferred Stages:</span> {investors.find(i => i.id === selectedInvestor)?.preferred_stages.join(', ')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Startup Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Select Startup
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startup
              </label>
              <select
                value={selectedStartup}
                onChange={(e) => setSelectedStartup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a startup...</option>
                {startups.map((startup) => (
                  <option key={startup.id} value={startup.id}>
                    {startup.name} - {startup.sector} ({startup.location})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedStartup && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {startups.find(s => s.id === selectedStartup)?.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Sector:</span> {startups.find(s => s.id === selectedStartup)?.sector}</p>
                  <p><span className="font-medium">Stage:</span> {startups.find(s => s.id === selectedStartup)?.stage}</p>
                  <p><span className="font-medium">Location:</span> {startups.find(s => s.id === selectedStartup)?.location}</p>
                  <p><span className="font-medium">Employees:</span> {startups.find(s => s.id === selectedStartup)?.employees}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match Button */}
      <div className="text-center">
        <button
          onClick={handleMatch}
          disabled={loading || !selectedStartup || !selectedInvestor}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
        >
          {loading ? 'Analyzing Match...' : 'Find AI Match'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Match Results */}
      {matchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            AI Match Analysis Results
          </h2>
          
          {matchResults.map((result, index) => (
            <div key={index} className="space-y-6">
              {/* Match Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.compatibility)}`}>
                    {(result.compatibility * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Compatibility Score</div>
                  <div className={`text-xs font-medium ${getScoreColor(result.compatibility)}`}>
                    {getScoreLabel(result.compatibility)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.traction)}`}>
                    {(result.traction * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Traction Score</div>
                  <div className={`text-xs font-medium ${getScoreColor(result.traction)}`}>
                    {getScoreLabel(result.traction)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(result.sectorAlignment)}`}>
                    {(result.sectorAlignment * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Sector Alignment</div>
                  <div className={`text-xs font-medium ${getScoreColor(result.sectorAlignment)}`}>
                    {getScoreLabel(result.sectorAlignment)}
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">AI Analysis & Insights</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {result.aiAnalysis}
                </p>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Investor Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {result.investor.name}</p>
                    <p><span className="font-medium">Type:</span> {result.investor.type}</p>
                    <p><span className="font-medium">Location:</span> {result.investor.location}</p>
                    <p><span className="font-medium">Preferred Sectors:</span> {result.investor.preferred_sectors.join(', ')}</p>
                    <p><span className="font-medium">Preferred Stages:</span> {result.investor.preferred_stages.join(', ')}</p>
                    <p><span className="font-medium">Average Check Size:</span> ${result.investor.avg_check_size.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Startup Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {result.startup.name}</p>
                    <p><span className="font-medium">Sector:</span> {result.startup.sector}</p>
                    <p><span className="font-medium">Stage:</span> {result.startup.stage}</p>
                    <p><span className="font-medium">Location:</span> {result.startup.location}</p>
                    <p><span className="font-medium">Employees:</span> {result.startup.employees}</p>
                    <p><span className="font-medium">MRR:</span> ${result.startup.mrr.toLocaleString()}</p>
                    <p><span className="font-medium">Valuation:</span> ${result.startup.last_valuation.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIEnhancedMatchingComponent;
