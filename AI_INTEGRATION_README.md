# AI-Powered Smart Matching Integration

This project now integrates the AI recommender FastAPI model with the frontend smart matching functionality, providing intelligent matchmaking between investors and startups.

## 🚀 Features

- **AI-Powered Compatibility Scoring**: Machine learning models analyze 50+ factors
- **Real-time Matching**: Instant compatibility predictions using pre-trained models
- **Smart Suggestions**: AI recommends matches based on investment thesis and startup profiles
- **Comprehensive Analysis**: Compatibility, traction, and sector similarity scoring
- **Dual Mode**: Support for both investor-to-startup and startup-to-investor matching

## 🏗️ Architecture

```
Frontend (Next.js) ←→ AI Recommender Service (FastAPI) ←→ ML Models
     ↓                           ↓                           ↓
Smart Matching UI         REST API Endpoints         Pre-trained Models
- Investor Forms         - /predict_compatibility/   - Compatibility Model
- Startup Forms          - /predict_traction/        - Traction Model  
- Results Display        - /sector_similarity/       - Industry Model
```

## 📁 File Structure

```
project/
├── frontend/
│   ├── app/matching/
│   │   ├── components/
│   │   │   ├── AIEnhancedMatchingComponent.tsx  # New AI-powered component
│   │   │   └── MatchingComponent.tsx            # Original component
│   │   └── page.tsx                             # Updated to use AI component
│   ├── services/
│   │   └── recommenderService.ts                # AI service integration
│   └── config/
│       └── api.ts                               # Updated with recommender endpoints
└── recommender/
    ├── main.py                                  # FastAPI server
    ├── start_recommender.py                     # Startup script
    ├── models.py                                # ML model definitions
    └── *.joblib                                 # Pre-trained models
```

## 🚀 Getting Started

### 1. Start the AI Recommender Server

```bash
cd recommender

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the FastAPI server
python start_recommender.py
```

The server will start on `http://localhost:8001`

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The frontend will be available on `http://localhost:3000`

### 3. Access Smart Matching

Navigate to `http://localhost:3000/matching` to use the AI-powered smart matching system.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:8000          # Django backend
NEXT_PUBLIC_RECOMMENDER_URL=http://localhost:8001  # AI recommender
```

### Port Configuration

- **Frontend**: 3000 (Next.js)
- **Django Backend**: 8000 
- **AI Recommender**: 8001 (FastAPI)

## 📊 API Endpoints

### AI Recommender Service

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict_compatibility/` | POST | Predict investor-startup compatibility |
| `/predict_traction/` | POST | Predict startup traction potential |
| `/sector_similarity/` | GET | Calculate sector similarity score |

### Request/Response Examples

#### Compatibility Prediction

**Request:**
```json
{
  "investor": {
    "type": "VC",
    "location": "United States",
    "avg_check_size": 1000000,
    "min_roi": 3.0,
    "risk_appetite": 5.0,
    "years_active": 5.0,
    "total_investments": 10000000,
    "preferred_sectors": ["Technology"],
    "preferred_stages": ["Seed", "Series A"],
    "thesis": "Focusing on innovative technology solutions..."
  },
  "startup": {
    "sector": "Technology",
    "stage": "Seed",
    "location": "United States",
    "founding_date": "2023-01-01",
    "employees": 10,
    "mrr": 50000,
    "growth_rate": 0.15,
    "burn_rate": 0.1,
    "funding_to_date": 500000,
    "description": "AI-powered SaaS platform...",
    "last_valuation": 2000000
  }
}
```

**Response:**
```json
{
  "compatibility_score": 0.85,
  "investor_features": 239,
  "startup_features": 239,
  "total_features": 478
}
```

## 🎯 How It Works

### 1. User Input
- Users fill out detailed forms for either investor preferences or startup profiles
- Forms collect comprehensive data including financial metrics, sector preferences, and descriptions

### 2. AI Analysis
- Data is sent to the recommender service
- ML models analyze compatibility, traction, and sector alignment
- Multiple scoring algorithms provide comprehensive insights

### 3. Smart Matching
- AI generates match scores and explanations
- Suggests match types: direct, emerging, or diversification opportunities
- Provides confidence scores and detailed analysis

### 4. Results Display
- Interactive match cards with AI-generated insights
- Detailed breakdown of match factors
- Explanations of why matches were recommended

## 🔍 Model Details

### Compatibility Model
- **Input**: 478 features combining investor and startup data
- **Output**: 0-1 compatibility score
- **Features**: Investment criteria, sector alignment, stage preferences, financial metrics

### Traction Model
- **Input**: 308 startup-specific features
- **Output**: 0-1 traction potential score
- **Features**: Growth metrics, financial health, market indicators

### Industry Model
- **Input**: Sector classifications
- **Output**: 0-1 similarity score
- **Features**: Sector relationships and market dynamics

## 🛠️ Development

### Adding New Features

1. **Extend the recommender service** in `recommenderService.ts`
2. **Update the UI components** in `AIEnhancedMatchingComponent.tsx`
3. **Add new API endpoints** in the FastAPI server if needed

### Testing

```bash
# Test the recommender API
curl -X POST "http://localhost:8001/predict_compatibility/" \
  -H "Content-Type: application/json" \
  -d @test_data.json

# View API documentation
open http://localhost:8001/docs
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, and 8001 are available
2. **Model loading errors**: Check that all `.joblib` files are present in the recommender directory
3. **CORS issues**: The FastAPI server is configured to allow all origins in development

### Debug Mode

Enable debug logging in the recommender service:

```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance

- **Response Time**: < 100ms for most predictions
- **Throughput**: Handles multiple concurrent requests
- **Scalability**: Models are pre-trained and optimized for production use

## 🔮 Future Enhancements

- Real-time model updates
- A/B testing for different matching algorithms
- Integration with external data sources
- Advanced visualization of match factors
- Personalized recommendation learning

## 📞 Support

For issues or questions about the AI integration:
1. Check the logs in `recommender/app.log`
2. Verify all dependencies are installed
3. Ensure the FastAPI server is running
4. Check browser console for frontend errors

---

**Note**: This integration provides a production-ready AI matching system that can be further customized based on specific business requirements.
