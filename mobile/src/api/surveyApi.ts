import { SurveyResponse } from '../types/survey';

// Change this to your backend URL when deployed
// For local development with Expo, use your computer's IP address
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-url.com/api';

export const submitSurvey = async (surveyData: SurveyResponse): Promise<any> => {
  // Add timestamp and IDs
  const payload = {
    ...surveyData,
    user_id: generateUserId(),
    session_id: generateSessionId(),
    completed_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/survey/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};

// Simple UUID generator
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};
