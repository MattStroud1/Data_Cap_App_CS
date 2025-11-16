import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurvey } from '../utils/SurveyContext';
import { submitSurvey } from '../api/surveyApi';

type CompletionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Completion'
>;

interface Props {
  navigation: CompletionScreenNavigationProp;
}

const CompletionScreen: React.FC<Props> = ({ navigation }) => {
  const { surveyData, resetSurvey } = useSurvey();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await submitSurvey(surveyData);
      console.log('Survey submitted successfully:', response);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit survey:', err);
      setError('Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartOver = () => {
    resetSurvey();
    navigation.navigate('Welcome');
  };

  if (submitting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Submitting your responses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>{error}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleStartOver}>
            <Text style={styles.secondaryButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>All Done!</Text>
      <Text style={styles.message}>
        Thank you for completing the survey. Your responses will help us understand what you love
        and suggest activities perfectly matched to your style.
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {surveyData.activity_preferences.interest_domains?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Interests</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{surveyData.choice_experiments.length}</Text>
          <Text style={styles.statLabel}>Choices Made</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleStartOver}>
          <Text style={styles.buttonText}>Start New Survey</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Your data has been securely saved and will be used to improve your recommendations.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 17,
    color: '#666',
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 40,
  },
});

export default CompletionScreen;
