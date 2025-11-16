import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  SurveyResponse,
  Demographics,
  TimeAvailability,
  ActivityPreferences,
  SocialStyle,
  ChoiceExperiment,
} from '../types/survey';

interface SurveyContextType {
  surveyData: SurveyResponse;
  updateDemographics: (data: Partial<Demographics>) => void;
  updateTimeAvailability: (data: TimeAvailability) => void;
  updateActivityPreferences: (data: Partial<ActivityPreferences>) => void;
  updateSocialStyle: (data: Partial<SocialStyle>) => void;
  addChoiceExperiment: (data: ChoiceExperiment) => void;
  resetSurvey: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

const createInitialTimeAvailability = (): TimeAvailability => ({
  monday: { morning: false, afternoon: false, evening: false },
  tuesday: { morning: false, afternoon: false, evening: false },
  wednesday: { morning: false, afternoon: false, evening: false },
  thursday: { morning: false, afternoon: false, evening: false },
  friday: { morning: false, afternoon: false, evening: false },
  saturday: { morning: false, afternoon: false, evening: false },
  sunday: { morning: false, afternoon: false, evening: false },
});

const initialSurveyData: SurveyResponse = {
  version: 'phase1-v1.0',
  demographics: {},
  time_availability: createInitialTimeAvailability(),
  activity_preferences: {},
  social_style: {},
  choice_experiments: [],
};

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [surveyData, setSurveyData] = useState<SurveyResponse>(initialSurveyData);

  const updateDemographics = (data: Partial<Demographics>) => {
    setSurveyData((prev) => ({
      ...prev,
      demographics: { ...prev.demographics, ...data },
    }));
  };

  const updateTimeAvailability = (data: TimeAvailability) => {
    setSurveyData((prev) => ({
      ...prev,
      time_availability: data,
    }));
  };

  const updateActivityPreferences = (data: Partial<ActivityPreferences>) => {
    setSurveyData((prev) => ({
      ...prev,
      activity_preferences: { ...prev.activity_preferences, ...data },
    }));
  };

  const updateSocialStyle = (data: Partial<SocialStyle>) => {
    setSurveyData((prev) => ({
      ...prev,
      social_style: { ...prev.social_style, ...data },
    }));
  };

  const addChoiceExperiment = (data: ChoiceExperiment) => {
    setSurveyData((prev) => ({
      ...prev,
      choice_experiments: [...prev.choice_experiments, data],
    }));
  };

  const resetSurvey = () => {
    setSurveyData(initialSurveyData);
  };

  return (
    <SurveyContext.Provider
      value={{
        surveyData,
        updateDemographics,
        updateTimeAvailability,
        updateActivityPreferences,
        updateSocialStyle,
        addChoiceExperiment,
        resetSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
