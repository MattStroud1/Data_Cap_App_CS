import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { TimeGrid } from '../components';
import { useSurvey } from '../utils/SurveyContext';
import { TimeAvailability } from '../types/survey';

type TimeAvailabilityScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TimeAvailability'
>;

interface Props {
  navigation: TimeAvailabilityScreenNavigationProp;
}

const TimeAvailabilityScreen: React.FC<Props> = ({ navigation }) => {
  const { surveyData, updateTimeAvailability } = useSurvey();
  const [timeAvailability, setTimeAvailability] = useState<TimeAvailability>(
    surveyData.time_availability
  );

  const handleNext = () => {
    updateTimeAvailability(timeAvailability);
    navigation.navigate('ActivityPreferences');
  };

  // Check if at least one time slot is selected
  const hasSelection = Object.values(timeAvailability).some((day) =>
    Object.values(day).some((slot) => slot)
  );

  return (
    <ScreenLayout
      title="When Are You Free?"
      subtitle="Select the times you're usually available for activities"
      progress={2 / 7}
      onNext={handleNext}
      nextDisabled={!hasSelection}
    >
      <TimeGrid
        question="On a typical week, when are you usually free for activities outside home?"
        value={timeAvailability}
        onChange={setTimeAvailability}
      />
    </ScreenLayout>
  );
};

export default TimeAvailabilityScreen;
