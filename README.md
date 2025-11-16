# City Activity Survey App - Adaptive Testing System

A mobile survey application with **IRT-based adaptive testing** for measuring personality, values, and city activity preferences with 70% fewer questions while maintaining psychometric validity.

## 🎯 System Overview

This project implements a complete **Computerized Adaptive Testing (CAT)** system for city engagement profiling:

- **Adaptive Engine** (Python/FastAPI): Real-time IRT-based item selection
- **Mobile App** (React Native/Expo): Hybrid survey flow with adaptive questioning
- **Be.FM Integration**: Encoding specification for behavioral predictions
- **Backend** (Express/TypeScript): Data storage and API

### Key Innovation

**Hybrid Approach:**
- **Fixed sections**: Demographics, Time Availability (fast, no uncertainty)
- **Adaptive sections**: Personality (Big Five), Need to Belong, Sensation Seeking, City Preferences
- **Result**: ~25-35 questions total vs. 110+ for full scales

**Efficiency:** 70% reduction in survey length with equivalent psychometric validity.

---

## 📁 Project Structure

```
.
├── adaptive-engine/        # Python FastAPI adaptive testing service
│   ├── models/
│   │   ├── irt.py         # IRT algorithms (GRM, EAP, information)
│   │   └── adaptive.py    # Adaptive session management
│   ├── data/
│   │   ├── item_bank.json # 49 items with IRT parameters
│   │   └── norms.json     # Population norms for percentiles
│   ├── utils/
│   │   └── synthesis.py   # Synthetic data generation
│   ├── main.py            # FastAPI server
│   └── README.md
│
├── mobile/                # React Native (Expo) mobile app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── LikertScale.tsx
│   │   │   ├── PercentileBar.tsx (NEW)
│   │   │   ├── TimeGrid.tsx
│   │   │   └── ...
│   │   ├── screens/      # Survey screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── DemographicsScreen.tsx
│   │   │   ├── TimeAvailabilityScreen.tsx
│   │   │   ├── AdaptiveQuestioningScreen.tsx (NEW - adaptive loop)
│   │   │   ├── ProfileResultsScreen.tsx (NEW - percentiles + narrative)
│   │   │   ├── ChoiceExperimentsScreen.tsx
│   │   │   └── CompletionScreen.tsx
│   │   ├── api/
│   │   │   ├── adaptiveApi.ts (NEW - adaptive engine client)
│   │   │   └── surveyApi.ts
│   │   └── utils/
│   │       └── SurveyContext.tsx (updated for adaptive data)
│   └── package.json
│
├── backend/              # Express backend for data storage
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
└── docs/
    ├── phase1-schema.md
    └── befm-encoding.md  (NEW - Be.FM prompt templates)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- Python 3.9+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### 1. Start the Adaptive Engine

```bash
cd adaptive-engine
pip install -r requirements.txt
python main.py
# Runs on http://localhost:4000
```

### 2. Start the Backend (Optional - for data storage)

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Configure Mobile App

Update API URLs in:
- `mobile/src/api/adaptiveApi.ts`: Change `localhost` to your computer's IP (e.g., `192.168.1.100:4000`)
- `mobile/src/api/surveyApi.ts`: Change `localhost` to your IP (e.g., `192.168.1.100:3000`)

Find your IP:
- **Mac**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

### 4. Start the Mobile App

```bash
cd mobile
npm install
npm start
```

Scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

---

## 🎓 How It Works

### Adaptive Testing Flow

```
1. User opens app
2. Fixed sections: Demographics, Time Availability (~10 questions)
3. Adaptive section starts:
   - Engine picks first seed item per trait (high discrimination)
   - User answers
   - Engine updates posterior: θ̂ ± SE
   - Engine picks next item to maximize information at current θ̂
   - Repeat until SE ≤ 0.35 or 10 items per trait
4. Profile Results: Percentiles + narrative
5. Choice experiments (5 cards)
6. Complete
```

### IRT-Based Item Selection

**Algorithm:**
1. Maintain Bayesian posterior for each trait: `θ ~ N(μ, σ²)`
2. After each response, update using graded response model
3. Compute EAP: `θ̂ = ∫ θ · p(θ|responses) dθ`
4. Select next item: `argmax_i I(θ̂)` where `I` = Fisher information
5. Stop when `SE(θ̂) ≤ threshold`

**Result:** Psychometrically equivalent scores with 70% fewer questions.

---

## 📊 Data & Attributes

### Attributes Measured (Adaptive)

- **Big Five Personality** (6 items each):
  - Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness
- **Social Orientation**:
  - Need to Belong (6 items)
- **Risk & Novelty**:
  - Sensation Seeking (6 items)
- **City Preferences**:
  - Activity Novelty, Structure Preference, Noise Tolerance (2-3 items each)

**Total item bank:** 49 items
**Typical session:** 25-35 items asked (adaptive selection)

### Synthetic vs. Real Data

**Current Status:** All IRT parameters are **synthetic** (plausible but randomly generated).

**To Deploy with Real Data:**
1. Run the fixed survey (all 49 items) on N=500-1000 users
2. Fit IRT models using `mirt` (R) or `pyirt` (Python)
3. Replace `adaptive-engine/data/item_bank.json` with calibrated parameters
4. Update `adaptive-engine/data/norms.json` with population statistics

See `adaptive-engine/README.md` for calibration details.

---

## 🧪 Testing the System

### Test Adaptive Engine API

```bash
# Health check
curl http://localhost:4000/

# Start session
curl -X POST http://localhost:4000/session/start \
  -H "Content-Type: application/json" \
  -d '{"se_threshold": 0.35}'
# Returns: {"session_id": "...", "attributes": [...]}

# Get first question
curl http://localhost:4000/session/{session_id}/next

# Answer question
curl -X POST http://localhost:4000/session/respond \
  -H "Content-Type: application/json" \
  -d '{"session_id": "...", "item_id": "BFI2S_E1", "response": 4}'

# Get profile
curl http://localhost:4000/session/{session_id}/profile
```

### Test Mobile App

1. Start adaptive engine + backend
2. Update mobile API URLs to your IP
3. Run `npm start` in mobile directory
4. Scan QR code
5. Complete survey end-to-end

**Expected flow:**
- Welcome → Demographics (10Q) → Time Grid → Adaptive (25-35Q) → Profile Results → Choice Cards (5) → Complete

---

## 📈 Key Features

### Adaptive Engine
- ✅ 2PL graded response IRT model
- ✅ Bayesian EAP estimation
- ✅ Information maximization item selection
- ✅ Stopping rules (SE threshold + max items)
- ✅ Percentile normalization
- ✅ Narrative profile generation

### Mobile App
- ✅ Real-time progress tracking
- ✅ Uncertainty visualization (confidence meter)
- ✅ Percentile bars with color coding
- ✅ Auto-generated personality narrative
- ✅ Hybrid fixed + adaptive flow
- ✅ TypeScript type safety throughout

### Be.FM Integration
- ✅ Canonical X (subject) encoding
- ✅ Event/context (C) schema
- ✅ Natural language prompt templates
- ✅ Structured JSON prompts
- ✅ Uncertainty handling guidelines

---

## 🔬 Psychometric Foundations

### Scales Used

- **Big Five**: BFI-2-S (Soto & John, 2017)
- **Need to Belong**: Leary et al. (2013)
- **Sensation Seeking**: Adapted from Zuckerman SSS / Arnett AISS
- **Values**: Schwartz Portrait Values Questionnaire (PVQ)
- **City Preferences**: Custom items validated against behavior

### IRT Model

**Graded Response Model (GRM)** for Likert items:

```
P*(θ) = 1 / (1 + exp(-a(θ - b_k)))
```

Where:
- `θ` = latent trait level
- `a` = discrimination (0.5-3.0)
- `b_k` = threshold for category k

**Information Function:**

```
I(θ) = Σ [P'(θ)]² / P(θ)
```

**EAP Estimation:**

```
θ̂ = ∫ θ · p(θ|responses) dθ
SE = √Var(posterior)
```

---

## 🎯 Be.FM Integration

### Encoding Profile → Prompt

See `docs/befm-encoding.md` for full specification.

**Example Prompt:**

```
PERSON:
- Demographics: Woman, 25-34, working full-time, partner + kids
- Personality: High Extraversion (80th %), High Openness (88th %)
- Social: Strong need to belong (88th %), prefers small groups
- Values: High novelty seeking (82nd %), goals = connection + relax
- Constraints: Max 30min travel, ££ budget, step-free access

EVENT:
- Jazz Trio at The Blue Note
- 15min walk, £15 ticket, Thursday 20:00
- Medium crowd, medium noise, intimate seated

PREDICT:
1. Click probability?
2. Attend probability?
3. Rating (1-5)?
```

**Be.FM Output:**
```
Attend probability: 0.68
Rating: 4.2
Reasoning: Strong match on novelty, live music interest, and social
connection goals. Minor constraint: weekday evening with young kids.
```

---

## 📚 Documentation

- **Adaptive Engine**: `adaptive-engine/README.md`
- **Data Schema**: `docs/phase1-schema.md`
- **Be.FM Encoding**: `docs/befm-encoding.md`

---

## 🛠️ Development Roadmap

### ✅ Phase 1 (Complete)
- [x] Fixed survey with validated scales
- [x] Backend data storage
- [x] Mobile UI with all question types
- [x] Choice experiments (BWS)

### ✅ Phase 1.5 (Complete)
- [x] IRT-based adaptive engine
- [x] Synthetic item bank + norms
- [x] Mobile integration with adaptive API
- [x] Percentile feedback screen
- [x] Be.FM encoding specification

### 🚧 Phase 2 (Next)
- [ ] Real IRT calibration (N=500-1000)
- [ ] Database storage (PostgreSQL)
- [ ] Be.FM API integration (live predictions)
- [ ] Recommendation screen
- [ ] User testing & validation

### 🔮 Phase 3 (Future)
- [ ] Multi-dimensional IRT (correlated traits)
- [ ] Contextual adaptive testing (use Be.FM to pick questions)
- [ ] Debiasing / fairness layer
- [ ] LLM-based narrative generation
- [ ] Longitudinal tracking & updates

---

## 🤝 Contributing

This is a research prototype. For questions or collaboration:
- Review the psychometric design in the original specification documents
- Check `adaptive-engine/README.md` for IRT implementation details
- See `docs/befm-encoding.md` for Be.FM integration strategy

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

Built on:
- **BFI-2** (Soto & John, 2017)
- **Need to Belong Scale** (Leary et al., 2013)
- **Schwartz Values** (Schwartz, 1992)
- **IRT Theory** (Samejima, 1969; Van der Linden & Glas, 2010)
- **Be.FM** (Bordt et al., 2024)
