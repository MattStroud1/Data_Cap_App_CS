# Adaptive Testing Engine

A FastAPI-based adaptive testing service using Item Response Theory (IRT) for psychometric assessment.

## Overview

This service implements **Computerized Adaptive Testing (CAT)** for measuring psychological traits (Big Five, Need to Belong, Sensation Seeking, etc.) with minimal questions while maintaining psychometric validity.

### Key Features

- **IRT-Based Item Selection**: Uses 2-parameter logistic graded response model
- **Bayesian Posterior Updating**: EAP (Expected A Posteriori) estimation
- **Adaptive Stopping Rules**: Stops when SE drops below threshold or max items reached
- **Percentile Normalization**: Converts raw scores to population percentiles
- **Narrative Profile Generation**: Rule-based personality description

## Quick Start

### Installation

```bash
pip install -r requirements.txt
```

### Generate Synthetic Data

```bash
python utils/synthesis.py
```

This creates:
- `data/item_bank.json`: 49 items with IRT parameters
- `data/norms.json`: Population norms for 10 attributes

### Run the Server

```bash
python main.py
```

Server runs on `http://localhost:4000`

## API Endpoints

### 1. Start Session

```bash
POST /session/start
{
  "se_threshold": 0.35,
  "max_items_per_trait": 10
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "attributes": ["big5_extraversion", ...]
}
```

### 2. Get Next Question

```bash
GET /session/{session_id}/next
```

**Response:**
```json
{
  "item": {
    "item_id": "BFI2S_E1",
    "attribute_id": "big5_extraversion",
    "text": "I see myself as someone who is outgoing, sociable.",
    "response_options": ["Strongly disagree", ..., "Strongly agree"],
    ...
  },
  "is_done": false,
  "progress": {
    "big5_extraversion": {
      "items_asked": 1,
      "current_se": 0.71,
      "target_se": 0.35,
      "is_done": false
    },
    ...
  }
}
```

### 3. Record Response

```bash
POST /session/respond
{
  "session_id": "uuid",
  "item_id": "BFI2S_E1",
  "response": 4
}
```

**Response:**
```json
{
  "success": true,
  "updated_estimates": {
    "big5_extraversion": {
      "theta": 0.82,
      "se": 0.71
    },
    ...
  }
}
```

### 4. Get Profile

```bash
GET /session/{session_id}/profile
```

**Response:**
```json
{
  "profile": {
    "big5_extraversion": {
      "theta": 0.85,
      "se": 0.32,
      "percentile": 80,
      "items_asked": 4
    },
    ...
  },
  "narrative": "You're quite socially energetic (higher than 80% of people on Extraversion). ..."
}
```

## How It Works

### 1. Item Selection Algorithm

**Priority Order:**
1. **Seed Items**: Ask 1 high-discrimination item per trait first
2. **Uncertainty Targeting**: Pick trait with highest `SE - threshold`
3. **Information Maximization**: Within trait, pick item with highest Fisher information at current θ

### 2. Posterior Updating

After each response:
1. Apply reverse scoring if needed (for negatively-keyed items)
2. Compute likelihood using graded response model
3. Update posterior: `posterior ∝ likelihood × prior`
4. Compute EAP: `θ̂ = ∫ θ · posterior(θ) dθ`
5. Compute SE: `SE = √Var(posterior)`

### 3. Stopping Rules

Stop asking items for a trait when:
- `SE ≤ threshold` (default: 0.35), OR
- `items_asked ≥ max_items_per_trait` (default: 10)

Session ends when all traits meet stopping criteria.

### 4. Percentile Calculation

```python
z_score = (theta - norm_mean) / norm_sd
percentile = Φ(z_score) × 100
```

where Φ is the standard normal CDF.

## Item Bank Structure

### Attributes Measured

- **Big Five**: Extraversion, Agreeableness, Conscientiousness, Neuroticism, Openness (6 items each)
- **Social**: Need to Belong (6 items)
- **Risk**: Sensation Seeking (6 items)
- **City Preferences**: Novelty, Structure, Noise Tolerance (2-3 items each)

### IRT Parameters

Each item has:
```json
{
  "a": 1.5,  // Discrimination (0.5-3.0)
  "b": [-2.0, -0.5, 0.5, 2.0]  // Thresholds for 5-point Likert
}
```

Higher `a` = better at distinguishing high/low trait levels
`b` values = difficulty thresholds for each response category

## Synthetic Data

**Current data is synthetic** for prototyping. To use real IRT params:

1. Administer full scales to N=500-1000 people
2. Fit IRT models using `mirt` (R) or `pyirt` (Python)
3. Replace `data/item_bank.json` with calibrated parameters
4. Update `data/norms.json` with actual population statistics

## Integration with Mobile App

The mobile app should:

1. **Start session** when user begins survey
2. **Loop**:
   - Call `/next` to get question
   - Show question to user
   - Call `/respond` with answer
   - Repeat until `is_done = true`
3. **Call `/profile`** to get percentiles and narrative
4. **Display** feedback screen with trait visualizations

## Performance

**Typical session:**
- 10 attributes
- ~25-35 questions total
- ~3-5 minutes user time
- Psychometric reliability comparable to full scales

**vs. Non-Adaptive:**
- Full BFI-2: 60 items
- Full NTB: 10 items
- Full SSS: 40 items
- **Total saved: ~70% fewer questions**

## Future Enhancements

- [ ] Database storage (PostgreSQL + Redis for sessions)
- [ ] Real IRT calibration data
- [ ] Multi-dimensional IRT for correlated traits
- [ ] LLM-based narrative generation
- [ ] Be.FM integration for context-aware questioning
- [ ] Real-time bias monitoring

## References

- Soto & John (2017). Short and extra-short forms of the Big Five Inventory-2 (BFI-2).
- Samejima (1969). Estimation of latent ability using a response pattern of graded scores (Graded Response Model).
- Van der Linden & Glas (2010). Elements of Adaptive Testing (CAT algorithms).
