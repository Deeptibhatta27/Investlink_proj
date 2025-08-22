#!/usr/bin/env python3
"""
Script to analyze which investor-startup combinations yield the highest compatibility scores.
"""

import json
import requests
import pandas as pd
from typing import List, Dict, Any
import time

def load_dummy_data():
    """Load dummy investor and startup data."""
    try:
        with open('recommender/dummy_investors.json', 'r') as f:
            investors = json.load(f)
        
        with open('recommender/dummy_startups.json', 'r') as f:
            startups = json.load(f)
        
        return investors, startups
    except Exception as e:
        print(f"Error loading data: {e}")
        return [], []

def test_compatibility(investor_data: Dict[str, Any], startup_data: Dict[str, Any]) -> float:
    """Test compatibility between an investor and startup using the recommender API."""
    
    # Map investor data to the expected format
    investor_input = {
        "preferred_sectors": investor_data.get("preferred_sectors", []),
        "preferred_stages": investor_data.get("preferred_stages", []),
        "avg_check_size": investor_data.get("avg_check_size", 0),
        "min_roi": investor_data.get("min_roi", 0),
        "risk_appetite": investor_data.get("risk_appetite", 0),
        "location": investor_data.get("location", ""),
        "years_active": investor_data.get("years_active", 0),
        "type": investor_data.get("type", ""),
        "total_investments": investor_data.get("total_investments", 0),
        "thesis": investor_data.get("thesis", "")
    }
    
    # Map startup data to the expected format  
    startup_input = {
        "name": startup_data.get("name", ""),
        "sector": startup_data.get("sector", ""),
        "stage": startup_data.get("stage", ""),
        "funding_amount": startup_data.get("funding_amount", 0),
        "location": startup_data.get("location", ""),
        "founded_year": startup_data.get("founded_year", 2020),
        "employees": startup_data.get("employees", 0),
        "description": startup_data.get("description", ""),
        "revenue": startup_data.get("revenue", 0),
        "growth_rate": startup_data.get("growth_rate", 0),
        "market_size": startup_data.get("market_size", 0)
    }
    
    try:
        # Call the recommender API
        response = requests.post(
            "http://localhost:8000/predict_compatibility/",
            json={
                "investor": investor_input,
                "startup": startup_input
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("compatibility_score", 0.0)
        else:
            print(f"API error: {response.status_code} - {response.text}")
            return 0.0
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return 0.0

def analyze_top_combinations(investors: List[Dict], startups: List[Dict], max_combinations: int = 50):
    """Analyze compatibility for random combinations and find the best matches."""
    
    print(f"Testing {max_combinations} investor-startup combinations...")
    print("This may take a few minutes...\n")
    
    results = []
    
    # Test a sample of combinations (to avoid too many API calls)
    import random
    random.seed(42)  # For reproducible results
    
    tested_combinations = 0
    
    for i in range(min(len(investors), 25)):  # Test first 25 investors
        investor = investors[i]
        
        # Test with random startups
        startup_sample = random.sample(startups, min(len(startups), 20))  # 20 random startups per investor
        
        for startup in startup_sample:
            if tested_combinations >= max_combinations:
                break
                
            compatibility_score = test_compatibility(investor, startup)
            
            if compatibility_score > 0:  # Only include successful tests
                results.append({
                    'investor_id': investor.get('id', ''),
                    'investor_name': investor.get('name', ''),
                    'investor_type': investor.get('type', ''),
                    'investor_sectors': ', '.join(investor.get('preferred_sectors', [])),
                    'startup_id': startup.get('id', ''),
                    'startup_name': startup.get('name', ''),
                    'startup_sector': startup.get('sector', ''),
                    'startup_stage': startup.get('stage', ''),
                    'compatibility_score': compatibility_score
                })
                
            tested_combinations += 1
            
            if tested_combinations % 10 == 0:
                print(f"Tested {tested_combinations} combinations...")
            
            # Small delay to avoid overwhelming the API
            time.sleep(0.1)
            
        if tested_combinations >= max_combinations:
            break
    
    return results

def print_top_matches(results: List[Dict], top_n: int = 10):
    """Print the top N matches by compatibility score."""
    
    if not results:
        print("No successful compatibility tests found.")
        return
    
    # Sort by compatibility score (descending)
    sorted_results = sorted(results, key=lambda x: x['compatibility_score'], reverse=True)
    
    print(f"\n{'='*80}")
    print(f"TOP {top_n} HIGHEST COMPATIBILITY MATCHES")
    print(f"{'='*80}")
    
    for i, match in enumerate(sorted_results[:top_n], 1):
        print(f"\n{i}. COMPATIBILITY SCORE: {match['compatibility_score']:.3f}")
        print(f"   INVESTOR: {match['investor_name']} ({match['investor_type']})")
        print(f"   SECTORS: {match['investor_sectors']}")
        print(f"   STARTUP: {match['startup_name']}")
        print(f"   SECTOR: {match['startup_sector']} | STAGE: {match['startup_stage']}")
        print(f"   {'-' * 70}")

def analyze_patterns(results: List[Dict]):
    """Analyze patterns in high-compatibility matches."""
    
    if not results:
        return
    
    # Get top 25% of matches
    sorted_results = sorted(results, key=lambda x: x['compatibility_score'], reverse=True)
    top_25_percent = sorted_results[:len(sorted_results)//4]
    
    print(f"\n{'='*80}")
    print(f"PATTERNS IN HIGH-COMPATIBILITY MATCHES (Top 25%)")
    print(f"{'='*80}")
    
    # Analyze by investor type
    investor_types = {}
    for match in top_25_percent:
        inv_type = match['investor_type']
        investor_types[inv_type] = investor_types.get(inv_type, 0) + 1
    
    print(f"\nMost successful investor types:")
    for inv_type, count in sorted(investor_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  {inv_type}: {count} high-compatibility matches")
    
    # Analyze by sector matches
    sector_matches = {}
    for match in top_25_percent:
        startup_sector = match['startup_sector']
        investor_sectors = match['investor_sectors']
        if startup_sector in investor_sectors:
            sector_matches[startup_sector] = sector_matches.get(startup_sector, 0) + 1
    
    print(f"\nMost successful sectors for matches:")
    for sector, count in sorted(sector_matches.items(), key=lambda x: x[1], reverse=True):
        print(f"  {sector}: {count} high-compatibility matches")
    
    # Analyze by startup stage
    stages = {}
    for match in top_25_percent:
        stage = match['startup_stage']
        stages[stage] = stages.get(stage, 0) + 1
    
    print(f"\nMost successful startup stages:")
    for stage, count in sorted(stages.items(), key=lambda x: x[1], reverse=True):
        print(f"  {stage}: {count} high-compatibility matches")

def main():
    print("🔍 INVESTLINK COMPATIBILITY ANALYZER")
    print("Analyzing which investor-startup combinations yield the highest compatibility...\n")
    
    # Check if FastAPI recommender is running
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print("✅ FastAPI recommender is running")
    except:
        print("❌ FastAPI recommender is not running!")
        print("Please start it with: cd recommender && python start_recommender.py")
        return
    
    # Load data
    investors, startups = load_dummy_data()
    
    if not investors or not startups:
        print("❌ Failed to load dummy data")
        return
    
    print(f"📊 Loaded {len(investors)} investors and {len(startups)} startups")
    
    # Analyze combinations
    results = analyze_top_combinations(investors, startups, max_combinations=100)
    
    if results:
        print_top_matches(results, top_n=15)
        analyze_patterns(results)
        
        # Save results to CSV for further analysis
        df = pd.DataFrame(results)
        df.to_csv('compatibility_analysis_results.csv', index=False)
        print(f"\n💾 Results saved to compatibility_analysis_results.csv")
        
    else:
        print("❌ No compatibility results obtained. Please check if the recommender API is working correctly.")

if __name__ == "__main__":
    main()
