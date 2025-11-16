import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenLayout } from '../components/ScreenLayout';
import { LikertScale } from '../components/LikertScale';
import { useSurvey } from '../utils/SurveyContext';
import {
  startAdaptiveSession,
  getNextItem,
  recordResponse,
  AdaptiveItem,
  ProgressInfo,
} from '../api/adaptiveApi';
import { LikertScore } from '../types/survey';

type AdaptiveQuestioningScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AdaptiveQuestioning'
>;

interface Props {
  navigation: AdaptiveQuestioningScreenNavigationProp;
}

const AdaptiveQuestioningScreen: React.FC<Props> = ({ navigation }) => {
  const { setAdaptiveSessionId, setAdaptiveProfile } = useSurvey();

  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<AdaptiveItem | null>(null);
  const [currentResponse, setCurrentResponse] = useState<LikertScore | undefined>(undefined);
  const [progress, setProgress] = useState<Record<string, ProgressInfo>>({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Start session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);

      // Start adaptive session
      const session = await startAdaptiveSession({
        se_threshold: 0.35,
        max_items_per_trait: 10,
      });

      setSessionId(session.session_id);
      setAdaptiveSessionId(session.session_id);

      // Get first question
      const nextData = await getNextItem(session.session_id);
      setCurrentItem(nextData.item);
      setProgress(nextData.progress);

      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize adaptive session:', err);
      setError('Failed to start adaptive testing. Please try again.');
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!sessionId || !currentItem || currentResponse === undefined) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Record response
      await recordResponse(sessionId, currentItem.item_id, currentResponse);
      setTotalQuestions(totalQuestions + 1);

      // Get next item
      const nextData = await getNextItem(sessionId);
      setProgress(nextData.progress);

      if (nextData.is_done || !nextData.item) {
        // Session complete - navigate to profile
        navigation.navigate('ProfileResults');
      } else {
        // Show next question
        setCurrentItem(nextData.item);
        setCurrentResponse(undefined);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to record response:', err);
      setError('Failed to save your answer. Please try again.');
      setLoading(false);
    }
  };

  const getOverallProgress = (): number => {
    if (!progress || Object.keys(progress).length === 0) return 0;

    const attributes = Object.values(progress);
    const totalDone = attributes.filter((attr) => attr.is_done).length;
    return totalDone / attributes.length;
  };

  const getAttributeLabel = (attrId: string): string => {
    const labels: Record<string, string> = {
      big5_extraversion: 'Extraversion',
      big5_agreeableness: 'Agreeableness',
      big5_conscientiousness: 'Conscientiousness',
      big5_neuroticism: 'Emotional Stability',
      big5_openness: 'Openness',
      need_to_belong: 'Need to Belong',
      sensation_seeking: 'Sensation Seeking',
      activity_novelty: 'Novelty Seeking',
      structure_preference: 'Structure Preference',
      noise_tolerance: 'Noise Tolerance',
    };
    return labels[attrId] || attrId;
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeSession}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && !currentItem) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Preparing your personalized questions...</Text>
      </View>
    );
  }

  if (!currentItem) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No question available</Text>
      </View>
    );
  }

  return (
    <ScreenLayout
      title="About Your Style"
      subtitle="Answer honestly - there are no right or wrong answers"
      progress={0.33 + getOverallProgress() * 0.33}
      onNext={handleNext}
      nextDisabled={currentResponse === undefined || loading}
      nextLabel={loading ? 'Saving...' : 'Next'}
    >
      {/* Progress info */}
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>
          Question {totalQuestions + 1} • {Math.round(getOverallProgress() * 100)}% Complete
        </Text>
        <Text style={styles.domainText}>
          Measuring: {getAttributeLabel(currentItem.attribute_id)}
        </Text>
      </View>

      {/* The actual question */}
      <LikertScale
        question={currentItem.text}
        value={currentResponse}
        onChange={(value) => setCurrentResponse(value)}
        minLabel={currentItem.response_options[0]}
        maxLabel={currentItem.response_options[4]}
      />

      {/* Show uncertainty/progress for current attribute */}
      {progress[currentItem.attribute_id] && (
        <View style={styles.uncertaintyBox}>
          <Text style={styles.uncertaintyLabel}>Confidence in measurement:</Text>
          <View style={styles.uncertaintyBar}>
            <View
              style={[
                styles.uncertaintyFill,
                {
                  width: `${
                    Math.max(
                      0,
                      100 -
                        (progress[currentItem.attribute_id].current_se /
                          progress[currentItem.attribute_id].target_se) *
                          100
                    )
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.uncertaintyText}>
            {progress[currentItem.attribute_id].items_asked} questions asked for{' '}
            {getAttributeLabel(currentItem.attribute_id)}
          </Text>
        </View>
      )}

      {/* Attribution */}
      <Text style={styles.attribution}>Source: {currentItem.source}</Text>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  domainText: {
    fontSize: 13,
    color: '#666',
  },
  uncertaintyBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  uncertaintyLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  uncertaintyBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  uncertaintyFill: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  uncertaintyText: {
    fontSize: 12,
    color: '#999',
  },
  attribution: {
    marginTop: 16,
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default AdaptiveQuestioningScreen;
