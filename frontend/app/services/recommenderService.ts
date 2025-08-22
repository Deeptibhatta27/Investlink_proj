// AI Recommender Service for Smart Matching
// This service integrates with the FastAPI recommender model

export interface InvestorInput {
  type: string;
  location: string;
  avg_check_size: number;
  min_roi: number;
  risk_appetite: number;
  years_active: number;
  total_investments: number;
  preferred_sectors: string[];
  preferred_stages: string[];
  thesis: string;
}

export interface StartupInput {
  sector: string;
  stage: string;
  location: string;
  founding_date: string;
  employees: number;
  mrr: number;
  growth_rate: number;
  burn_rate: number;
  funding_to_date: number;
  description: string;
  last_valuation: number;
}

export interface CompatibilityScore {
  compatibility_score: number;
  investor_features: number;
  startup_features: number;
  total_features: number;
  error?: string;
}

export interface TractionScore {
  traction_score: number;
  features_used: number;
  error?: string;
}

export interface SectorSimilarity {
  similarity_score: number;
  error?: string;
}

export interface SmartMatchResult {
  compatibility_score: number;
  traction_score?: number;
  sector_similarity?: number;
  match_explanation: string;
  ai_analysis: string;
  recommendation_strength: 'high' | 'medium' | 'low';
  suggestion_type: 'direct' | 'emerging' | 'diversification';
  confidence_score: number;
}

class RecommenderService {
  private baseURL: string;

  constructor() {
    // Default to localhost:8001 for the recommender FastAPI
    this.baseURL = process.env.NEXT_PUBLIC_RECOMMENDER_URL || 'http://localhost:8001';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Recommender API error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Recommender service error:', error);
      throw error;
    }
  }

  async predictCompatibility(investor: InvestorInput, startup: StartupInput): Promise<CompatibilityScore> {
    return this.makeRequest<CompatibilityScore>('/predict_compatibility/', {
      method: 'POST',
      body: JSON.stringify({ investor, startup }),
    });
  }

  async predictTraction(startup: StartupInput): Promise<TractionScore> {
    return this.makeRequest<TractionScore>('/predict_traction/', {
      method: 'POST',
      body: JSON.stringify(startup),
    });
  }

  async getSectorSimilarity(sector1: string, sector2: string): Promise<SectorSimilarity> {
    return this.makeRequest<SectorSimilarity>(`/sector_similarity/?sector1=${encodeURIComponent(sector1)}&sector2=${encodeURIComponent(sector2)}`);
  }

  async getSmartMatch(investor: InvestorInput, startup: StartupInput): Promise<SmartMatchResult> {
    try {
      // Get compatibility score
      const compatibility = await this.predictCompatibility(investor, startup);
      
      // Get traction score
      const traction = await this.predictTraction(startup);
      
      // Get sector similarity if sectors are different
      let sectorSimilarity = 1.0;
      if (investor.preferred_sectors.length > 0 && !investor.preferred_sectors.includes(startup.sector)) {
        const mostSimilarSector = investor.preferred_sectors[0];
        const similarity = await this.getSectorSimilarity(mostSimilarSector, startup.sector);
        sectorSimilarity = similarity.similarity_score;
      }

      // Calculate overall match score
      const overallScore = (compatibility.compatibility_score * 0.6) + 
                          (traction.traction_score * 0.3) + 
                          (sectorSimilarity * 0.1);

      // Determine recommendation strength
      let recommendationStrength: 'high' | 'medium' | 'low';
      if (overallScore >= 0.8) recommendationStrength = 'high';
      else if (overallScore >= 0.6) recommendationStrength = 'medium';
      else recommendationStrength = 'low';

      // Determine suggestion type
      let suggestionType: 'direct' | 'emerging' | 'diversification';
      if (compatibility.compatibility_score >= 0.8) suggestionType = 'direct';
      else if (sectorSimilarity >= 0.7) suggestionType = 'emerging';
      else suggestionType = 'diversification';

      // Generate AI analysis
      const aiAnalysis = this.generateAIAnalysis(compatibility, traction, sectorSimilarity, suggestionType);

      // Generate match explanation
      const matchExplanation = this.generateMatchExplanation(compatibility, traction, sectorSimilarity, suggestionType);

      return {
        compatibility_score: compatibility.compatibility_score,
        traction_score: traction.traction_score,
        sector_similarity: sectorSimilarity,
        match_explanation: matchExplanation,
        ai_analysis: aiAnalysis,
        recommendation_strength: recommendationStrength,
        suggestion_type: suggestionType,
        confidence_score: overallScore,
      };
    } catch (error) {
      console.error('Error getting smart match:', error);
      throw error;
    }
  }

  private generateAIAnalysis(
    compatibility: CompatibilityScore, 
    traction: TractionScore, 
    sectorSimilarity: number,
    suggestionType: string
  ): string {
    const parts = [];
    
    if (compatibility.compatibility_score >= 0.8) {
      parts.push("Excellent compatibility match with strong alignment across investment criteria.");
    } else if (compatibility.compatibility_score >= 0.6) {
      parts.push("Good compatibility with some areas for alignment.");
    } else {
      parts.push("Moderate compatibility - consider if this aligns with your investment thesis.");
    }

    if (traction.traction_score >= 0.7) {
      parts.push("Strong traction indicators suggest promising growth potential.");
    } else if (traction.traction_score >= 0.5) {
      parts.push("Moderate traction with room for growth.");
    } else {
      parts.push("Early stage with potential for development.");
    }

    if (sectorSimilarity >= 0.8) {
      parts.push("High sector alignment with your investment focus.");
    } else if (sectorSimilarity >= 0.6) {
      parts.push("Moderate sector similarity offering diversification opportunities.");
    } else {
      parts.push("Different sector focus providing portfolio diversification.");
    }

    return parts.join(" ");
  }

  private generateMatchExplanation(
    compatibility: CompatibilityScore, 
    traction: TractionScore, 
    sectorSimilarity: number,
    suggestionType: string
  ): string {
    const explanations = [];
    
    if (suggestionType === 'direct') {
      explanations.push("This is a direct match based on your investment criteria and the startup's profile.");
    } else if (suggestionType === 'emerging') {
      explanations.push("While not a perfect sector match, this startup shows strong potential in an emerging area.");
    } else {
      explanations.push("This represents a diversification opportunity that could strengthen your portfolio.");
    }

    explanations.push(`Compatibility Score: ${Math.round(compatibility.compatibility_score * 100)}%`);
    explanations.push(`Traction Score: ${Math.round(traction.traction_score * 100)}%`);
    explanations.push(`Sector Similarity: ${Math.round(sectorSimilarity * 100)}%`);

    return explanations.join(" ");
  }

  // Helper method to convert frontend data to recommender format
  convertToInvestorInput(frontendData: any): InvestorInput {
    return {
      type: frontendData.type || 'VC',
      location: frontendData.location || 'United States',
      avg_check_size: frontendData.avg_check_size || 1000000,
      min_roi: frontendData.min_roi || 3.0,
      risk_appetite: frontendData.risk_appetite || 5.0,
      years_active: frontendData.years_active || 5.0,
      total_investments: frontendData.total_investments || 10000000,
      preferred_sectors: frontendData.preferred_sectors || ['Technology'],
      preferred_stages: frontendData.preferred_stages || ['Seed', 'Series A'],
      thesis: frontendData.thesis || 'Focusing on innovative technology solutions with strong market potential.'
    };
  }

  convertToStartupInput(frontendData: any): StartupInput {
    return {
      sector: frontendData.sector || 'Technology',
      stage: frontendData.stage || 'Seed',
      location: frontendData.location || 'United States',
      founding_date: frontendData.founding_date || '2023-01-01',
      employees: frontendData.employees || 10,
      mrr: frontendData.mrr || 50000,
      growth_rate: frontendData.growth_rate || 0.15,
      burn_rate: frontendData.burn_rate || 0.1,
      funding_to_date: frontendData.funding_to_date || 500000,
      description: frontendData.description || 'Innovative technology startup with strong market potential.',
      last_valuation: frontendData.last_valuation || 2000000
    };
  }
}

export const recommenderService = new RecommenderService();
