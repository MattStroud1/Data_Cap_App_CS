# City Activity Survey App - Phase 1

A mobile survey application designed to collect user preferences about city activities using psychometrically validated questionnaires and discrete choice experiments.

## Project Overview

This app helps understand user preferences for city activities through:
- **Demographics & constraints**: Age, household, transport, budget, time availability
- **Activity preferences**: Interests, novelty vs. routine, structure, noise tolerance, goals
- **Social style**: Group size preferences, need to belong, social identity
- **Discrete choice experiments**: Best-Worst Scaling (BWS) to reveal true preferences

The design is based on established frameworks:
- Big Five personality model
- Self-Determination Theory (SDT)
- Schwartz Values
- Random Utility Theory for choice experiments

## Project Structure

```
.
├── mobile/                 # React Native (Expo) mobile app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── LikertScale.tsx
│   │   │   ├── MultiSelect.tsx
│   │   │   ├── ABTile.tsx
│   │   │   ├── SingleChoice.tsx
│   │   │   ├── BudgetSlider.tsx
│   │   │   ├── TimeGrid.tsx
│   │   │   ├── GroupSizeSelector.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── ScreenLayout.tsx
│   │   ├── screens/       # Survey screens
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── DemographicsScreen.tsx
│   │   │   ├── TimeAvailabilityScreen.tsx
│   │   │   ├── ActivityPreferencesScreen.tsx
│   │   │   ├── SocialStyleScreen.tsx
│   │   │   ├── ChoiceExperimentsScreen.tsx
│   │   │   └── CompletionScreen.tsx
│   │   ├── navigation/    # React Navigation setup
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Survey context (state management)
│   │   ├── api/           # API client for backend
│   │   └── data/          # Choice experiment data
│   ├── App.tsx
│   └── package.json
│
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/  # Survey controller (business logic)
│   │   ├── routes/       # API routes
│   │   ├── data/         # JSON file storage
│   │   └── index.ts      # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
└── docs/                  # Documentation
    └── phase1-schema.md  # Data schema specification

```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already done if you followed initial setup):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

API endpoints:
- `POST /api/survey/submit` - Submit a completed survey
- `GET /api/survey` - Get all surveys (for testing/admin)
- `GET /api/survey/:id` - Get a specific survey by user_id or session_id
- `GET /health` - Health check

### Mobile App Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies (already done if you followed initial setup):
```bash
npm install
```

3. Update the API URL (for local testing):
   - Open `mobile/src/api/surveyApi.ts`
   - Replace `localhost` with your computer's local IP address (e.g., `192.168.1.100`)
   - You can find your IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

4. Start the Expo development server:
```bash
npm start
```

5. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## Features

### Question Types

The app includes several psychometrically-validated question components:

1. **Likert Scale** (1-5): Agreement scales for attitudes and preferences
2. **Multi-Select**: Tag selection for interests and identities
3. **A/B Tiles**: Binary forced-choice scenarios
4. **Single Choice**: Radio button selections for demographics
5. **Budget Slider**: Visual scale for spending preferences
6. **Time Grid**: 7×3 weekly availability selector
7. **Group Size Selector**: Visual tiles with ranked preferences
8. **Event Cards**: Discrete choice experiments (BWS)

### Survey Flow

1. **Welcome Screen**: Introduction and overview
2. **Demographics** (Progress: 1/7): Basic info, transport, budget
3. **Time Availability** (2/7): Weekly free time grid
4. **Activity Preferences** (3/7): Interests, novelty, structure, noise, goals
5. **Social Style** (4/7): Group size, need to belong, identity
6. **Choice Experiments** (5-7/7): 5 discrete choice tasks
7. **Completion**: Submit and show summary

### Data Storage

- **Development**: JSON file storage in `backend/src/data/surveys.json`
- **Production**: Can be easily adapted to PostgreSQL, MongoDB, or any database

Survey responses are stored with:
- Unique `user_id` and `session_id`
- Timestamp (`completed_at`)
- Full response data matching the schema in `docs/phase1-schema.md`

## Data Schema

See `docs/phase1-schema.md` for the complete Phase 1 data schema, including:
- All demographic enums
- Activity preference structures
- Social style attributes
- Choice experiment format

Example response structure:
```json
{
  "user_id": "user_1234567890_abc123",
  "session_id": "session_1234567890_xyz789",
  "completed_at": "2025-11-16T10:30:00Z",
  "version": "phase1-v1.0",
  "demographics": { /* ... */ },
  "time_availability": { /* ... */ },
  "activity_preferences": { /* ... */ },
  "social_style": { /* ... */ },
  "choice_experiments": [ /* ... */ ]
}
```

## Development

### Adding New Questions

1. Create/modify the component in `mobile/src/components/`
2. Add the question to the appropriate screen in `mobile/src/screens/`
3. Update the type definitions in `mobile/src/types/survey.ts`
4. Update the schema documentation in `docs/phase1-schema.md`

### Modifying Choice Experiments

Edit `mobile/src/data/choiceExperiments.ts` to:
- Add/remove choice sets
- Modify event attributes
- Change the number of options per choice

### Customizing Styles

All components use React Native StyleSheet. Main colors:
- Primary: `#007AFF` (iOS blue)
- Success: `#34C759` (green)
- Error: `#FF3B30` (red)
- Background: `#f8f9fa`

## Testing

### Backend Testing

Test the API with curl:
```bash
# Health check
curl http://localhost:3000/health

# Get all surveys
curl http://localhost:3000/api/survey

# Submit a test survey
curl -X POST http://localhost:3000/api/survey/submit \
  -H "Content-Type: application/json" \
  -d '{"version":"phase1-v1.0","demographics":{},...}'
```

### Mobile Testing

1. Use Expo Go for quick testing on physical devices
2. Use iOS Simulator or Android Emulator for local testing
3. Test on both iOS and Android for cross-platform compatibility

## Future Enhancements (Phase 2+)

- [ ] Adaptive question selection (Item Response Theory)
- [ ] Big Five personality battery (full BFI-2)
- [ ] Accessibility features (mobility, safety preferences)
- [ ] Real-time mood/energy context capture
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Analytics dashboard
- [ ] A/B testing framework

## Psychometric Notes

This survey design follows best practices:
- Multiple items per construct (reliability)
- Mixed positive/negative keying (response bias control)
- Validated scales (BFI-2, Need to Belong, etc.)
- Discrete choice experiments (revealed preferences)
- Progressive profiling (minimize burden)

## License

ISC

## Contact

For questions about the psychometric design or implementation, please refer to the original specification document provided.
