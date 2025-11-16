import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SurveyProvider } from './src/utils/SurveyContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SurveyProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SurveyProvider>
  );
}
