// components/features/PreciseTargeting.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaCrosshairs, FaFilter, FaChartLine, FaGlobe, FaDollarSign, FaIndustry, FaUsers, FaSearch } from 'react-icons/fa';

// Define types
interface FilterOptions {
  industries: string[];
  stages: string[];
  regions: string[];
  investmentSizes: string[];
  metrics: string[];
}

interface FilterRanges {
  valuation: { min: number; max: number };
  revenue: { min: number; max: number };
  growth: { min: number; max: number };
}

interface StartupData {
  id: string;
  name: string;
  industry: string;
  stage: string;
  region: string;
  valuation: string;
  metrics: {
    revenue: string;
    growth: string;
    marketSize: string;
  };
  description: string;
  funding: {
    raised: string;
    seeking: string;
  };
}

// Dummy data
const filterOptions: FilterOptions = {
  industries: ['Technology', 'Healthcare', 'Fintech', 'E-commerce', 'AI/ML', 'Clean Energy', 'Biotech'],
  stages: ['Seed', 'Series A', 'Series B', 'Series C', 'Growth'],
  regions: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
  investmentSizes: ['$100K-500K', '$500K-1M', '$1M-5M', '$5M-10M', '$10M+'],
  metrics: ['Revenue Growth', 'User Growth', 'Market Size', 'Profit Margin', 'Unit Economics']
};

const dummyStartups: StartupData[] = Array(20).fill(null).map((_, index) => ({
  id: `startup-${index + 1}`,
  name: `Innovative Startup ${index + 1}`,
  industry: filterOptions.industries[Math.floor(Math.random() * filterOptions.industries.length)],
  stage: filterOptions.stages[Math.floor(Math.random() * filterOptions.stages.length)],
  region: filterOptions.regions[Math.floor(Math.random() * filterOptions.regions.length)],
  valuation: ['$5M', '$10M', '$20M', '$50M', '$100M'][Math.floor(Math.random() * 5)],
  metrics: {
    revenue: ['$500K', '$1M', '$2M', '$5M', '$10M'][Math.floor(Math.random() * 5)],
    growth: ['50%', '100%', '150%', '200%', '300%'][Math.floor(Math.random() * 5)],
    marketSize: ['$1B', '$5B', '$10B', '$50B', '$100B'][Math.floor(Math.random() * 5)],
  },
  description: `A cutting-edge startup revolutionizing the ${filterOptions.industries[Math.floor(Math.random() * filterOptions.industries.length)]} industry with innovative solutions.`,
  funding: {
    raised: ['$1M', '$2M', '$5M', '$10M', '$20M'][Math.floor(Math.random() * 5)],
    seeking: ['$2M', '$5M', '$10M', '$20M', '$50M'][Math.floor(Math.random() * 5)],
  }
}));

export default function PreciseTargeting() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({
    industries: [],
    stages: [],
    regions: [],
    investmentSizes: [],
    metrics: []
  });
  const [filterRanges, setFilterRanges] = useState<FilterRanges>({
    valuation: { min: 0, max: 100 },
    revenue: { min: 0, max: 10 },
    growth: { min: 0, max: 300 }
  });
  const [filteredStartups, setFilteredStartups] = useState<StartupData[]>(dummyStartups);
  const [sortBy, setSortBy] = useState<string>('valuation');

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (updated[category].includes(value)) {
        updated[category] = updated[category].filter(item => item !== value);
      } else {
        updated[category] = [...updated[category], value];
      }
      return updated;
    });
  };

  useEffect(() => {
    // Filter startups based on selected filters and search query
    let filtered = dummyStartups;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(startup => 
        startup.name.toLowerCase().includes(query) ||
        startup.description.toLowerCase().includes(query) ||
        startup.industry.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    filtered = filtered.filter(startup => {
      const matchesIndustry = selectedFilters.industries.length === 0 || 
                             selectedFilters.industries.includes(startup.industry);
      const matchesStage = selectedFilters.stages.length === 0 || 
                          selectedFilters.stages.includes(startup.stage);
      const matchesRegion = selectedFilters.regions.length === 0 || 
                           selectedFilters.regions.includes(startup.region);
      const matchesInvestmentSize = selectedFilters.investmentSizes.length === 0 || 
                                   selectedFilters.investmentSizes.some(size => {
                                     const [min, max] = size.replace(/[^0-9.-]+/g, '').split('-').map(Number);
                                     const startupFunding = Number(startup.funding.seeking.replace(/[^0-9.-]+/g, ''));
                                     return startupFunding >= min && (!max || startupFunding <= max);
                                   });

      // Apply range filters
      const valuationNum = Number(startup.valuation.replace(/[^0-9.-]+/g, ''));
      const revenueNum = Number(startup.metrics.revenue.replace(/[^0-9.-]+/g, ''));
      const growthNum = Number(startup.metrics.growth.replace(/[^0-9.-]+/g, '').replace('%', ''));

      const matchesRanges = 
        valuationNum >= filterRanges.valuation.min && valuationNum <= filterRanges.valuation.max &&
        revenueNum >= filterRanges.revenue.min && revenueNum <= filterRanges.revenue.max &&
        growthNum >= filterRanges.growth.min && growthNum <= filterRanges.growth.max;

      return matchesIndustry && matchesStage && matchesRegion && matchesInvestmentSize && matchesRanges;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'valuation':
          return Number(b.valuation.replace(/[^0-9.-]+/g, '')) - Number(a.valuation.replace(/[^0-9.-]+/g, ''));
        case 'revenue':
          return Number(b.metrics.revenue.replace(/[^0-9.-]+/g, '')) - Number(a.metrics.revenue.replace(/[^0-9.-]+/g, ''));
        case 'growth':
          return Number(b.metrics.growth.replace(/[^0-9.-]+/g, '')) - Number(a.metrics.growth.replace(/[^0-9.-]+/g, ''));
        default:
          return 0;
      }
    });

    setFilteredStartups(filtered);
  }, [selectedFilters, searchQuery, filterRanges, sortBy]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRangeChange = (category: keyof FilterRanges, value: { min: number; max: number }) => {
    setFilterRanges(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search startups by name, industry, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaFilter className="mr-2" /> Filters
            </h3>
            
            {/* Filter Sections */}
            <FilterSection
              title="Industries"
              icon={<FaIndustry className="text-gray-600" />}
              options={filterOptions.industries}
              category="industries"
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
            
            <FilterSection
              title="Stages"
              icon={<FaChartLine className="text-gray-600" />}
              options={filterOptions.stages}
              category="stages"
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />

            <FilterSection
              title="Regions"
              icon={<FaGlobe className="text-gray-600" />}
              options={filterOptions.regions}
              category="regions"
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />

            {/* Range Filters */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Value Ranges</h4>
              <div className="space-y-4">
                <RangeSlider
                  title="Valuation ($M)"
                  min={0}
                  max={100}
                  value={filterRanges.valuation}
                  onChange={(value) => handleRangeChange('valuation', value)}
                />
                <RangeSlider
                  title="Revenue ($M)"
                  min={0}
                  max={10}
                  value={filterRanges.revenue}
                  onChange={(value) => handleRangeChange('revenue', value)}
                />
                <RangeSlider
                  title="Growth Rate (%)"
                  min={0}
                  max={300}
                  value={filterRanges.growth}
                  onChange={(value) => handleRangeChange('growth', value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          {/* Sorting Options */}
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredStartups.length} results found
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="valuation">Sort by Valuation</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="growth">Sort by Growth Rate</option>
            </select>
          </div>

          {/* Startup Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const FilterSection = ({ 
  title, 
  icon, 
  options, 
  category,
  selectedFilters,
  onFilterChange 
}: { 
  title: string;
  icon: React.ReactNode;
  options: string[];
  category: string;
  selectedFilters: {[key: string]: string[]};
  onFilterChange: (category: string, value: string) => void;
}) => (
  <div className="mb-4">
    <div className="flex items-center mb-2">
      {icon}
      <h4 className="text-sm font-semibold text-gray-700 ml-2">{title}</h4>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onFilterChange(category, option)}
          className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
            selectedFilters[category].includes(option)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const RangeSlider = ({ 
  title, 
  min, 
  max, 
  value, 
  onChange 
}: { 
  title: string;
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}) => (
  <div>
    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-600">{title}</span>
      <span className="text-sm text-gray-600">
        {value.min} - {value.max}
      </span>
    </div>
    <div className="flex gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value.min}
        onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
        className="w-1/2"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value.max}
        onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
        className="w-1/2"
      />
    </div>
  </div>
);

const StartupCard = ({ startup }: { startup: StartupData }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{startup.name}</h3>
    <div className="flex flex-wrap gap-2 mb-3">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{startup.industry}</span>
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{startup.stage}</span>
      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{startup.region}</span>
    </div>
    <p className="text-gray-600 text-sm mb-4">{startup.description}</p>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <div className="text-sm text-gray-500">Revenue</div>
        <div className="font-semibold">{startup.metrics.revenue}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Growth</div>
        <div className="font-semibold">{startup.metrics.growth}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Valuation</div>
        <div className="font-semibold">{startup.valuation}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Seeking</div>
        <div className="font-semibold">{startup.funding.seeking}</div>
      </div>
    </div>
    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
      View Details
    </button>
  </div>
);