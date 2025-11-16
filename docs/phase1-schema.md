# Phase 1 Data Schema

## Overview
Phase 1 captures core demographics, activity preferences, social style, and discrete choice experiments.

## Subject Schema (X) - Phase 1

### 1. Demographics & Life Situation

```json
{
  "demographics": {
    "age_band": "25-34",  // enum: "16-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+"
    "gender_identity": "woman",  // enum: "woman" | "man" | "non-binary" | "self-describe" | "prefer-not-to-say"
    "gender_self_describe": "",  // string, only if gender_identity = "self-describe"
    "current_situation": "working-full-time",  // enum: see below
    "household_type": "with-partner",  // enum: see below
    "children_in_household": ["5-12", "13-18"],  // array of: "none" | "under-5" | "5-12" | "13-18"
    "home_area": "North Quarter",  // string (neighborhood/postcode area)
    "transport_modes": ["walk", "metro"],  // array, max 2, from enum below
    "willing_travel_time": "20-35",  // enum: "0-10" | "10-20" | "20-35" | "35-50" | "50+"
    "typical_budget_band": 2  // int 0-4: 0=free, 1=£, 2=££, 3=£££, 4=££££
  },
  "time_availability": {
    // 7x3 grid: days (mon-sun) × time-slots (morning, afternoon, evening)
    // true = usually available
    "monday": { "morning": false, "afternoon": false, "evening": true },
    "tuesday": { "morning": false, "afternoon": false, "evening": true },
    "wednesday": { "morning": false, "afternoon": false, "evening": true },
    "thursday": { "morning": false, "afternoon": true, "evening": true },
    "friday": { "morning": false, "afternoon": true, "evening": true },
    "saturday": { "morning": true, "afternoon": true, "evening": true },
    "sunday": { "morning": true, "afternoon": true, "evening": false }
  }
}
```

**Enums:**
- `current_situation`: "at-school" | "at-university" | "working-full-time" | "working-part-time" | "shift-work" | "home-family" | "retired" | "other"
- `household_type`: "alone" | "with-partner" | "with-partner-and-children" | "with-children-no-partner" | "with-housemates" | "with-parents-family" | "other"
- `transport_modes`: "walk" | "cycle" | "e-scooter" | "bus" | "metro" | "train" | "car-driver" | "car-passenger" | "ride-hailing" | "other"

### 2. Activity Preferences

```json
{
  "activity_preferences": {
    "interest_domains": [
      "live-music",
      "cafes",
      "museums-galleries",
      "outdoor-nature",
      "food-drink"
    ],  // array from enum below
    "interest_other": "Underground art scenes",  // free text

    // Novelty vs Routine (2 A/B questions, stored as binary choices)
    "novelty_q1": "A",  // A = "love trying new places", B = "prefer places I know"
    "novelty_q2": "A",  // A = "something different each week", B = "favourite places"

    // Structure preference (Likert 1-5)
    "structure_like_regular": 4,  // "I like signing up for regular classes/leagues"
    "structure_prefer_dropin": 3,  // "I prefer drop-in things"

    // Noise level tolerance (Likert 1-5)
    "noise_enjoy_loud_busy": 2,  // "I enjoy loud, busy places"
    "noise_prefer_calm_quiet": 4,  // "I prefer calm, quiet spaces"

    // Goals when going out (Likert 1-5)
    "goal_relax_switch_off": 4,
    "goal_learn_stretch": 3,
    "goal_feel_connected": 5,
    "goal_do_things_good_at": 3,
    "goal_meaningful_difference": 4
  }
}
```

**interest_domains enum:**
- "live-music" | "nightlife-bars" | "cafes" | "theatre-dance-performance" | "museums-galleries"
- "sports-watch" | "sports-play" | "outdoor-nature" | "gaming-esports-boardgames"
- "learning-talks-classes" | "volunteering-community" | "faith-spiritual" | "activism-causes"
- "making-diy-craft-tech" | "food-drink" | "other"

### 3. Social Style

```json
{
  "social_style": {
    "preferred_group_size": ["small-2-3", "medium-4-8"],  // array of 2, ranked

    // Alone vs together (Likert 1-5)
    "enjoy_more_with_others": 4,
    "alone_as_good_as_together": 2,  // reverse-coded

    // Need to belong (Likert 1-5)
    "want_others_accept_me": 4,
    "dont_like_alone_long": 3,
    "happy_with_group_i_know": 5,

    // Social identity clusters (multi-select)
    "identity_clusters": ["live-music-crowd", "bookish-artsy"],
    "identity_other": ""  // free text
  }
}
```

**Group size enum:**
- "solo" | "small-2-3" | "medium-4-8" | "large-crowd"

**Identity clusters enum:**
- "live-music-crowd" | "nightlife-people" | "sporty-fitness" | "gamers-geeks"
- "bookish-artsy" | "makers-diy-hackers" | "faith-community" | "activists-social-causes"
- "parenting-family" | "none-fit" | "other"

### 4. Discrete Choice Experiments (3-5 cards)

Each choice presents 3 event options; user picks most appealing (and optionally least appealing for BWS).

```json
{
  "choice_experiments": [
    {
      "choice_id": 1,
      "options_presented": [
        {
          "option_id": "A",
          "title": "Jazz trio at small bar",
          "distance_minutes": 15,
          "travel_mode": "walk",
          "price_band": 2,  // ££
          "day": "thursday",
          "time": "20:00",
          "crowd_size": "small",
          "noise_level": "medium"
        },
        {
          "option_id": "B",
          "title": "Outdoor food market",
          "distance_minutes": 30,
          "travel_mode": "metro",
          "price_band": 1,
          "day": "saturday",
          "time": "18:00",
          "crowd_size": "large",
          "noise_level": "high"
        },
        {
          "option_id": "C",
          "title": "Book talk at library",
          "distance_minutes": 10,
          "travel_mode": "walk",
          "price_band": 0,  // free
          "day": "tuesday",
          "time": "18:30",
          "crowd_size": "small",
          "noise_level": "low"
        }
      ],
      "selected_most_appealing": "A",
      "selected_least_appealing": "B"  // optional for BWS
    }
    // ... 2-4 more choice experiments
  ]
}
```

## Complete Phase 1 Response Object

```json
{
  "user_id": "uuid-v4",
  "session_id": "uuid-v4",
  "completed_at": "2025-11-16T10:30:00Z",
  "version": "phase1-v1.0",

  "demographics": { /* ... */ },
  "time_availability": { /* ... */ },
  "activity_preferences": { /* ... */ },
  "social_style": { /* ... */ },
  "choice_experiments": [ /* ... */ ]
}
```

## Storage

Phase 1: Simple JSON file storage or MongoDB/PostgreSQL with JSON column.

Backend endpoint: `POST /api/survey/submit`

Returns: `{ "success": true, "user_id": "...", "message": "Survey completed!" }`
