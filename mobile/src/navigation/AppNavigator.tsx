import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen imports
import WelcomeScreen from '../screens/WelcomeScreen';
import DemographicsScreen from '../screens/DemographicsScreen';
import TimeAvailabilityScreen from '../screens/TimeAvailabilityScreen';
import AdaptiveQuestioningScreen from '../screens/AdaptiveQuestioningScreen';
import ProfileResultsScreen from '../screens/ProfileResultsScreen';
import ChoiceExperimentsScreen from '../screens/ChoiceExperimentsScreen';
import CompletionScreen from '../screens/CompletionScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Demographics: undefined;
  TimeAvailability: undefined;
  AdaptiveQuestioning: undefined;
  ProfileResults: undefined;
  ChoiceExperiments: undefined;
  Completion: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Welcome', headerShown: false }}
        />
        <Stack.Screen
          name="Demographics"
          component={DemographicsScreen}
          options={{ title: 'About You' }}
        />
        <Stack.Screen
          name="TimeAvailability"
          component={TimeAvailabilityScreen}
          options={{ title: 'Your Availability' }}
        />
        <Stack.Screen
          name="AdaptiveQuestioning"
          component={AdaptiveQuestioningScreen}
          options={{ title: 'Personality & Preferences' }}
        />
        <Stack.Screen
          name="ProfileResults"
          component={ProfileResultsScreen}
          options={{ title: 'Your Profile', headerShown: false }}
        />
        <Stack.Screen
          name="ChoiceExperiments"
          component={ChoiceExperimentsScreen}
          options={{ title: 'Quick Choices' }}
        />
        <Stack.Screen
          name="Completion"
          component={CompletionScreen}
          options={{ title: 'All Done!', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
