import { NetworkMember } from './networkService';

export interface MatchingFilters {
  industry?: string[];
  country?: string[];
  investmentRange?: string;
  fundingStage?: string;
  marketSize?: string;
  revenueRange?: string;
  teamSize?: string;
  matchScore?: number;
}

// Dummy data for matching
const dummyMatches: NetworkMember[] = [
  // APAC Region
  {
    id: 101,
    name: "Japan Tech Fund",
    role: "Venture Capital",
    company: "JTF Partners",
    description: "Leading Japanese VC firm focusing on deep tech and AI innovations.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Technology",
    location: "Japan",
    investmentRange: "$1M - $5M",
    matchScore: 94,
    preferredSectors: ["AI", "Robotics", "IoT"],
    portfolio: 35,
    totalInvestments: "$150M",
    successfulExits: 8
  },
  {
    id: 102,
    name: "Seoul Ventures",
    role: "Early Stage Investor",
    company: "Seoul Ventures Co.",
    description: "South Korean investment firm specializing in mobile technology and gaming.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Mobile & Gaming",
    location: "South Korea",
    investmentRange: "$500K - $3M",
    matchScore: 87,
    preferredSectors: ["Mobile Apps", "Gaming", "E-sports"],
    portfolio: 28,
    totalInvestments: "$85M",
    successfulExits: 5
  },
  // European Region
  {
    id: 103,
    name: "Nordic Innovation Capital",
    role: "Growth Investor",
    company: "NIC Ventures",
    description: "Scandinavian investment firm focusing on sustainable technology and digital health.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "HealthTech",
    location: "Sweden",
    investmentRange: "$3M - $15M",
    matchScore: 91,
    preferredSectors: ["Digital Health", "CleanTech", "Smart Cities"],
    portfolio: 22,
    totalInvestments: "$180M",
    successfulExits: 6
  },
  {
    id: 104,
    name: "Paris Digital Ventures",
    role: "Series A/B Investor",
    company: "PDV Capital",
    description: "French VC firm specializing in European digital transformation startups.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Digital",
    location: "France",
    investmentRange: "$2M - $8M",
    matchScore: 89,
    preferredSectors: ["E-commerce", "MarTech", "FinTech"],
    portfolio: 31,
    totalInvestments: "$160M",
    successfulExits: 7
  },
  // Middle East Region
  {
    id: 105,
    name: "Dubai Future Fund",
    role: "Technology Investor",
    company: "DFF Investments",
    description: "UAE-based fund focusing on future technologies and smart city solutions.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Smart City",
    location: "United Arab Emirates",
    investmentRange: "$1M - $10M",
    matchScore: 86,
    preferredSectors: ["Smart Infrastructure", "AI", "Blockchain"],
    portfolio: 25,
    totalInvestments: "$120M",
    successfulExits: 4
  },
  // Add original matches after these
  {
    id: 1,
    name: "TechVentures Capital",
    role: "Lead Investor",
    company: "TechVentures Global",
    description: "Focusing on early-stage tech startups with global potential. Looking for innovative solutions in AI, blockchain, and IoT.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Technology",
    location: "United States",
    investmentRange: "$500K - $2M",
    matchScore: 95,
    preferredSectors: ["AI", "Blockchain", "IoT"],
    portfolio: 12,
    totalInvestments: "$50M",
    successfulExits: 3
  },
  {
    id: 2,
    name: "Singapore Innovation Fund",
    role: "Growth Investor",
    company: "SIF Ventures",
    description: "Leading Asian investment firm focusing on Series B+ rounds in Southeast Asian startups.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Multiple",
    location: "Singapore",
    investmentRange: "$5M - $20M",
    matchScore: 88,
    preferredSectors: ["E-commerce", "FinTech", "HealthTech"],
    portfolio: 25,
    totalInvestments: "$200M",
    successfulExits: 7
  },
  {
    id: 3,
    name: "EcoInvest Germany",
    role: "Impact Investor",
    company: "EcoInvest GmbH",
    description: "Sustainable technology and renewable energy focused investment firm based in Berlin.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "CleanTech",
    location: "Germany",
    investmentRange: "$1M - $5M",
    matchScore: 92,
    preferredSectors: ["Renewable Energy", "Sustainable Tech", "GreenTech"],
    portfolio: 15,
    totalInvestments: "$75M",
    successfulExits: 4
  },
  {
    id: 4,
    name: "India Growth Partners",
    role: "Series A Investor",
    company: "IGP Ventures",
    description: "Focused on India's emerging tech ecosystem with emphasis on digital transformation.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Technology",
    location: "India",
    investmentRange: "$2M - $10M",
    matchScore: 90,
    preferredSectors: ["SaaS", "Mobile Apps", "Digital Payments"],
    portfolio: 20,
    totalInvestments: "$100M",
    successfulExits: 5
  },
  {
    id: 5,
    name: "Brazil Tech Fund",
    role: "Early Stage Investor",
    company: "BTF Investments",
    description: "Latin America's leading early-stage tech investor with focus on Brazilian startups.",
    imageUrl: "https://example.com/placeholder.jpg",
    type: "investor",
    industry: "Technology",
    location: "Brazil",
    investmentRange: "$250K - $1M",
    matchScore: 85,
    preferredSectors: ["EdTech", "FinTech", "Mobile"],
    portfolio: 30,
    totalInvestments: "$45M",
    successfulExits: 6
  }
];

// Available filter options
export const filterOptions = {
  industries: [
    "Technology",
    "FinTech",
    "HealthTech",
    "CleanTech",
    "E-commerce",
    "EdTech",
    "AI/ML",
    "Blockchain",
    "IoT",
    "SaaS",
    "Mobile Apps",
    "Digital Payments",
    "Renewable Energy",
    "Sustainable Tech",
    "GreenTech"
  ],
  countries: [
    "United States",
    "Singapore",
    "Germany",
    "India",
    "Brazil",
    "United Kingdom",
    "Canada",
    "Australia",
    "Japan",
    "China",
    "France",
    "Israel",
    "Sweden",
    "Netherlands",
    "South Korea"
  ],
  investmentRanges: [
    "Under $250K",
    "$250K - $1M",
    "$1M - $5M",
    "$5M - $20M",
    "$20M+"
  ],
  fundingStages: [
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C+",
    "Growth",
    "Late Stage"
  ],
  marketSizes: [
    "Under $1B",
    "$1B - $10B",
    "$10B - $50B",
    "$50B - $100B",
    "$100B+"
  ],
  revenueRanges: [
    "Pre-revenue",
    "Under $100K",
    "$100K - $1M",
    "$1M - $10M",
    "$10M+"
  ],
  teamSizes: [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "500+"
  ]
};

class MatchingService {
  private matches = dummyMatches;

  async getMatches(filters?: MatchingFilters): Promise<NetworkMember[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!filters) return this.matches;

    return this.matches.filter(match => {
      let score = 100;

      // Filter by industry
      if (filters.industry?.length && !filters.industry.includes(match.industry!)) {
        score -= 20;
      }

      // Filter by country
      if (filters.country?.length && !filters.country.includes(match.location!)) {
        score -= 20;
      }

      // Filter by investment range
      if (filters.investmentRange && match.investmentRange !== filters.investmentRange) {
        score -= 15;
      }

      // Only return matches above 70% match score
      match.matchScore = score;
      return score >= 70;
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  async getMatchingStats(): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      totalMatches: this.matches.length,
      highMatchCount: this.matches.filter(m => (m.matchScore || 0) >= 90).length,
      mediumMatchCount: this.matches.filter(m => (m.matchScore || 0) >= 70 && (m.matchScore || 0) < 90).length,
      lowMatchCount: this.matches.filter(m => (m.matchScore || 0) < 70).length,
      topIndustries: ["Technology", "FinTech", "CleanTech"],
      topCountries: ["United States", "Singapore", "Germany"]
    };
  }
}

export const matchingService = new MatchingService();
