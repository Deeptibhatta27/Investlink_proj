from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from .models import StartupProfile, InvestorPreferences, AIMatch

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .models import StartupProfile, InvestorPreferences, AIMatch


class AIMatchmaker:
    def __init__(self):
        """Initialize the AI Matchmaker"""
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
    def _preprocess_startup_data(self, startup_profile):
        """Convert startup profile to text for matching"""
        # Handle both model instances and dictionaries
        industry = getattr(startup_profile, 'industry', '') if hasattr(startup_profile, 'industry') else startup_profile.get('industry', '')
        funding_stage = getattr(startup_profile, 'funding_stage', '') if hasattr(startup_profile, 'funding_stage') else startup_profile.get('funding_stage', '')
        target_market = getattr(startup_profile, 'target_market', '') if hasattr(startup_profile, 'target_market') else startup_profile.get('target_market', '')
        innovation = getattr(startup_profile, 'technological_innovation', 0) if hasattr(startup_profile, 'technological_innovation') else startup_profile.get('technological_innovation', 0)
        growth = getattr(startup_profile, 'growth_rate', 0) if hasattr(startup_profile, 'growth_rate') else startup_profile.get('growth_rate', 0)
        team = getattr(startup_profile, 'team_size', 0) if hasattr(startup_profile, 'team_size') else startup_profile.get('team_size', 0)
        
        return (f"{industry} {funding_stage} {target_market} "
                f"innovation:{innovation} growth:{growth} team:{team}")

    def _preprocess_investor_data(self, preferences):
        """Convert investor preferences to text for matching"""
        # Handle both model instances and dictionaries
        industries = getattr(preferences, 'preferred_industries', []) if hasattr(preferences, 'preferred_industries') else preferences.get('preferred_industries', [])
        stages = getattr(preferences, 'investment_stage', []) if hasattr(preferences, 'investment_stage') else preferences.get('investment_stage', [])
        markets = getattr(preferences, 'target_markets', []) if hasattr(preferences, 'target_markets') else preferences.get('target_markets', [])
        risk = getattr(preferences, 'risk_appetite', 0) if hasattr(preferences, 'risk_appetite') else preferences.get('risk_appetite', 0)
        returns = getattr(preferences, 'expected_return', 0) if hasattr(preferences, 'expected_return') else preferences.get('expected_return', 0)
        
        return (f"{' '.join(industries)} {' '.join(stages)} {' '.join(markets)} "
                f"risk:{risk} return:{returns}")

    def calculate_compatibility_score(self, startup_profile, investor_preferences):
        """Calculate compatibility score and generate explanation"""
        # Convert profiles to text
        startup_text = self._preprocess_startup_data(startup_profile)
        investor_text = self._preprocess_investor_data(investor_preferences)
        
        # Create TF-IDF matrix
        tfidf_matrix = self.vectorizer.fit_transform([startup_text, investor_text])
        
        # Calculate similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Generate match explanation
        explanation = self._generate_match_explanation(startup_profile, investor_preferences, similarity)
        
        return similarity * 100, explanation

    def _generate_match_explanation(self, startup, investor, score):
        """Generate a human-readable explanation of the match"""
        matches = []
        
        # Industry match
        if startup.industry in investor.preferred_industries:
            matches.append("Industry preferences align")
            
        # Stage match
        if startup.funding_stage in investor.investment_stage:
            matches.append("Investment stage matches")
            
        # Market match
        if startup.target_market in investor.target_markets:
            matches.append("Target market aligns")
            
        # Investment size match
        if startup.revenue >= investor.min_investment:
            matches.append("Revenue meets minimum investment criteria")
            
        explanation = (f"Match Score: {score:.2f}\n"
                      f"Key Factors:\n- " + "\n- ".join(matches))
        
        return explanation

    def get_smart_suggestions(self, startup_data, investor_data, historical_matches=None):
        """Get AI-powered match suggestions with TF-IDF and cosine similarity"""
        try:
            # Create mock objects for TF-IDF processing
            class MockStartup:
                def __init__(self, data):
                    self.industry = data.get('industry', '')
                    self.funding_stage = data.get('funding_stage', '')
                    self.target_market = data.get('target_market', '')
                    self.technological_innovation = data.get('technological_innovation', 0)
                    self.growth_rate = data.get('growth_rate', 0)
                    self.team_size = data.get('team_size', 0)
                    self.revenue = data.get('revenue', 0)
                    
            class MockInvestor:
                def __init__(self, data):
                    self.preferred_industries = data.get('preferred_industries', [])
                    self.investment_stage = data.get('investment_stage', [])
                    self.target_markets = data.get('target_markets', [])
                    self.risk_appetite = data.get('risk_appetite', 0)
                    self.expected_return = data.get('expected_return', 0)
                    self.min_investment = data.get('min_investment', 0)

            # Create mock objects from the input data
            mock_startup = MockStartup(startup_data)
            mock_investor = MockInvestor(investor_data)

            # Calculate compatibility
            score, explanation = self.calculate_compatibility_score(mock_startup, mock_investor)
            
            # Calculate factor breakdown
            factor_breakdown = {
                'industry_match': 1 if mock_startup.industry in mock_investor.preferred_industries else 0,
                'stage_match': 1 if mock_startup.funding_stage in mock_investor.investment_stage else 0,
                'market_match': 1 if mock_startup.target_market in mock_investor.target_markets else 0,
                'risk_score': min(1, mock_investor.risk_appetite / 10),  # Normalize to 0-1
                'growth_potential': min(1, mock_startup.growth_rate / 100),  # Normalize to 0-1
                'market_size_score': min(1, mock_startup.revenue / mock_investor.min_investment if mock_investor.min_investment > 0 else 0)
            }
            
            # Determine suggestion type
            if score >= 80:
                suggestion_type = 'direct'
            elif score >= 60:
                suggestion_type = 'emerging'
            else:
                suggestion_type = 'diversification'
                
            # Return structured response
            return {
                'compatibility_score': score,
                'factor_breakdown': factor_breakdown,
                'suggestion_type': suggestion_type,
                'confidence_score': min(100, score + 10),  # Slight boost for confidence
                'recommendation_strength': 'high' if score >= 80 else 'medium' if score >= 60 else 'low',
                'ai_analysis': f"Based on {len(factor_breakdown)} key factors, this match shows {score:.1f}% compatibility.",
                'match_explanation': explanation
            }

        except Exception as e:
            print(f"Error in get_smart_suggestions: {str(e)}")
            return []

