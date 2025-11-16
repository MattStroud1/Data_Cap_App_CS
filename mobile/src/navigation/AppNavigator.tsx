import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen imports (we'll create these next)
import WelcomeScreen from '../screens/WelcomeScreen';
import DemographicsScreen from '../screens/DemographicsScreen';
import TimeAvailabilityScreen from '../screens/TimeAvailabilityScreen';
import ActivityPreferencesScreen from '../screens/ActivityPreferencesScreen';
import SocialStyleScreen from '../screens/SocialStyleScreen';
import ChoiceExperimentsScreen from '../screens/ChoiceExperimentsScreen';
import CompletionScreen from '../screens/CompletionScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Demographics: undefined;
  TimeAvailability: undefined;
  ActivityPreferences: undefined;
  SocialStyle: undefined;
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
          name="ActivityPreferences"
          component={ActivityPreferencesScreen}
          options={{ title: 'Activity Preferences' }}
        />
        <Stack.Screen
          name="SocialStyle"
          component={SocialStyleScreen}
          options={{ title: 'Social Style' }}
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
