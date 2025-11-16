# Be.FM Encoding Specification

## Overview

This document specifies how to encode user profiles from our survey system into structured prompts for the Be.FM behavioral foundation model.

Be.FM is designed to predict behavior as: **y = F(K, x, c)** where:
- **x** = subject characteristics (person profile)
- **c** = context (event/activity attributes)
- **K** = Be.FM's internal behavioral knowledge
- **y** = predicted behavior (attend, enjoy, engage)

Our encoding strategy creates a **canonical representation** of x and c that maximizes Be.FM's predictive accuracy while being computationally efficient.

---

## Subject Encoding (X)

### Structure

The subject profile is encoded as a **structured JSON object** with fixed slots:

```json
{
  "subject_id": "user_123",
  "demographics": { ... },
  "personality": { ... },
  "social_orientation": { ... },
  "values_motivations": { ... },
  "constraints": { ... },
  "preferences": { ... },
  "recent_behavior": { ... }
}
```

### 1. Demographics

**Direct mappings** from survey data:

```json
{
  "age_band": "25-34",
  "gender": "woman",
  "household_type": "with_partner_and_children",
  "children_ages": ["under_5", "5-12"],
  "employment": "working_full_time",
  "location_area": "North Quarter"
}
```

**Rationale:** Be.FM is trained on datasets with demographic variables; these are presented in standardized categorical form.

---

### 2. Personality (Big Five)

**Standardized scores** from adaptive testing:

```json
{
  "extraversion": {
    "theta": 0.85,
    "percentile": 80,
    "se": 0.32
  },
  "agreeableness": {
    "theta": 0.45,
    "percentile": 67,
    "se": 0.28
  },
  "conscientiousness": {
    "theta": -0.2,
    "percentile": 42,
    "se": 0.30
  },
  "neuroticism": {
    "theta": 0.1,
    "percentile": 54,
    "se": 0.29
  },
  "openness": {
    "theta": 1.2,
    "percentile": 88,
    "se": 0.27
  }
}
```

**Encoding Notes:**
- `theta`: IRT latent trait estimate (standardized, mean=0, SD=1)
- `percentile`: Population percentile (0-100)
- `se`: Standard error (quantifies measurement uncertainty)

**For Be.FM prompts:**
- Use percentile-based descriptions: "High Extraversion (80th percentile)"
- Or categorical bins: "Very High" / "High" / "Average" / "Low" / "Very Low"

---

### 3. Social Orientation

```json
{
  "need_to_belong": {
    "theta": 1.1,
    "percentile": 88
  },
  "preferred_group_size": ["small_2-3", "medium_4-8"],
  "social_identities": ["live_music_crowd", "bookish_artsy"]
}
```

**Prompt Representation:**
```
Social orientation: Strong need for social connection (88th percentile),
prefers small to medium groups (2-8 people), identifies with live-music
and bookish/artsy communities.
```

---

### 4. Values & Motivations

From Schwartz PVQ and SDT-inspired items:

```json
{
  "sensation_seeking": {
    "theta": -0.3,
    "percentile": 38
  },
  "activity_novelty": {
    "theta": 0.9,
    "percentile": 82
  },
  "goals_when_out": {
    "relax_switch_off": 4,
    "learn_stretch": 3,
    "feel_connected": 5,
    "do_things_good_at": 3,
    "meaningful_difference": 4
  }
}
```

**Prompt Representation:**
```
Values: Moderate sensation seeking (38th percentile), high novelty seeking (82nd percentile).
Primary goals when going out: feel connected to others (5/5), relax (4/5),
do meaningful things (4/5).
```

---

### 5. Constraints

**Hard filters** and **soft preferences**:

```json
{
  "max_travel_time": 30,
  "transport_modes": ["walk", "metro"],
  "budget_band": 2,
  "time_windows": {
    "weekday_evening": true,
    "weekend_afternoon": true,
    "weekend_evening": true
  },
  "mobility_needs": ["step_free"],
  "safety_comfort": "medium",
  "family_friendliness_importance": "somewhat_important"
}
```

**Prompt Representation:**
```
Constraints: Max 30-minute travel (walk/metro), moderate budget (££),
available weekday evenings and weekends, requires step-free access,
moderate safety comfort, somewhat values family-friendly options.
```

---

### 6. Activity Preferences

From interest tags and city-specific items:

```json
{
  "interest_domains": ["live_music", "cafes", "museums_galleries", "food_drink"],
  "structure_preference": 2,
  "noise_tolerance": 3
}
```

**Prompt Representation:**
```
Activity preferences: Interested in live music, cafés, museums, and food experiences.
Prefers flexible drop-in activities over structured commitments,
comfortable with moderate noise levels.
```

---

### 7. Recent Behavior (Optional, once user has history)

```json
{
  "last_10_attended": [
    {"category": "live_music", "rating": 5},
    {"category": "food_market", "rating": 4},
    {"category": "museum", "rating": 3}
  ],
  "avg_distance_traveled": 22,
  "avg_price_paid": 18
}
```

---

## Context Encoding (C)

For each event/activity being evaluated:

```json
{
  "event_id": "evt_789",
  "title": "Jazz Trio at The Blue Note",
  "category": "live_music",
  "subcategory": "jazz",
  "venue": {
    "name": "The Blue Note",
    "area": "Central District",
    "distance_from_user": 15,
    "travel_time": 20,
    "travel_mode_available": ["walk", "metro"]
  },
  "timing": {
    "day": "thursday",
    "start_time": "20:00",
    "duration_minutes": 120
  },
  "pricing": {
    "price_band": 2,
    "ticket_price": 15,
    "typical_total_spend": 25
  },
  "vibe": {
    "crowd_size": "medium",
    "noise_level": "medium",
    "energy": "relaxed"
  },
  "accessibility": {
    "step_free": true,
    "accessible_toilets": true
  },
  "family_friendly": false,
  "tags": ["intimate", "live_performance", "seated"]
}
```

---

## Be.FM Prompt Template

### Option 1: Natural Language Prompt

```
You are modeling the behavior of a city resident deciding whether to attend an event.

PERSON PROFILE:
- Demographics: Woman, 25-34, working full-time, lives with partner and young children
- Personality: High Extraversion (80th %ile), High Openness (88th %ile), Average Conscientiousness
- Social: Strong need to belong (88th %ile), prefers small-medium groups, part of live-music community
- Values: High novelty seeking (82nd %ile), goals = connection + relaxation
- Constraints: Max 30min travel, ££ budget, weekday evenings free, needs step-free access
- Interests: Live music, cafés, museums, food experiences

EVENT CONTEXT:
- Event: "Jazz Trio at The Blue Note"
- Category: Live music (jazz)
- Location: 15min walk, Central District
- Time: Thursday 20:00, 2 hours
- Cost: £15 ticket, ~£25 total
- Vibe: Medium crowd, medium noise, relaxed energy, intimate seated performance
- Access: Step-free, accessible toilets
- Not family-friendly

QUESTION:
On a scale of 1-10, how likely is this person to:
1. Click on this event when shown?
2. Save it for later?
3. Actually attend?
4. Rate it highly (4-5 stars) afterward?

Please explain your reasoning based on the match between person and context.
```

### Option 2: Structured JSON Input (for API)

```json
{
  "task": "predict_engagement",
  "subject": {
    "demographics": {...},
    "personality": {...},
    "social": {...},
    "values": {...},
    "constraints": {...},
    "preferences": {...}
  },
  "context": {
    "event": {...}
  },
  "predictions_requested": [
    "click_probability",
    "save_probability",
    "attend_probability",
    "high_rating_probability"
  ]
}
```

---

## Encoding Best Practices

### 1. Normalization

- **Always include percentiles** alongside raw θ scores (Be.FM understands "high" vs "low" better with percentiles)
- **Bin continuous variables** into meaningful categories where appropriate:
  - Distance: "very close (<10min)", "close (10-20min)", "moderate (20-35min)", "far (>35min)"
  - Price: Free, £, ££, £££, ££££

### 2. Uncertainty Handling

- **Low SE (< 0.3):** Use trait estimate confidently
- **High SE (> 0.5):** Either:
  - Mention uncertainty: "Moderate Extraversion (uncertain, SE=0.6)"
  - Ask more questions before making strong predictions
  - Use wider prediction intervals

### 3. Context-Trait Interactions

Be.FM is trained to reason about **interactions**. Highlight potential conflicts or alignments:

```
ALIGNMENT:
- High Extraversion + social event with medium crowd → strong match
- High Openness + novel jazz performance → strong match

POTENTIAL CONFLICTS:
- Has young children + event not family-friendly + weekday evening → logistical barrier
- Prefers step-free access + venue IS step-free → constraint satisfied
```

### 4. Null Handling

- If a trait is missing: omit or mark as "unknown"
- If a constraint is not applicable: omit
- Be.FM can handle partial information but works best with complete profiles

---

## Validation & Iteration

### Offline Evaluation

1. **Collect ground truth:** User click, attend, rating data
2. **Compare Be.FM predictions** to actual behavior
3. **Measure:**
   - AUC-ROC for binary outcomes (attend/not attend)
   - RMSE for ratings
   - Ranking quality (NDCG)

### Prompt Engineering Experiments

Test variants:
- **Verbose vs. concise** descriptions
- **Percentile vs. categorical** trait labels
- **With vs. without uncertainty** quantification
- **With vs. without recent behavior** context

Iterate based on prediction accuracy.

---

## Example End-to-End Flow

1. **User completes survey** → Adaptive engine generates profile with θ, SE, percentiles
2. **System fetches candidate events** from city API
3. **For each event:**
   - Encode subject (x) and context (c) using templates above
   - Call Be.FM: `predict_engagement(x, c)`
   - Receive scores: `{click: 0.72, attend: 0.58, rating: 4.2}`
4. **Rank events** by predicted attend probability
5. **Show top 10** with explanations: "This fits your love of live music and preference for intimate settings"

---

## Future Enhancements

- **Dynamic prompting:** Use Be.FM to suggest which questions to ask next (adaptive engine v2)
- **Counterfactual explanations:** "If this event were 10 minutes closer, attend probability would increase to 0.68"
- **Multi-objective ranking:** Balance novelty, safety, budget, convenience using Be.FM predictions
- **Debiasing layer:** Use Be.FM to generate synthetic preferences for underrepresented user segments

---

## References

- Be.FM paper: Bordt et al. (2024). "Be.FM: A Foundation Model for Human Behavior"
- Encoding best practices informed by prompt engineering literature and discrete choice modeling
