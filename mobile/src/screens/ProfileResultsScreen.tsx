import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { PercentileBar } from '../components/PercentileBar';
import { useSurvey } from '../utils/SurveyContext';
import { getProfile, ProfileResponse } from '../api/adaptiveApi';

type ProfileResultsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileResults'
>;

interface Props {
  navigation: ProfileResultsScreenNavigationProp;
}

const ProfileResultsScreen: React.FC<Props> = ({ navigation }) => {
  const { adaptiveSessionId, setAdaptiveProfile } = useSurvey();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!adaptiveSessionId) {
      setError('No session found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profileData = await getProfile(adaptiveSessionId);
      setProfile(profileData);
      setAdaptiveProfile(profileData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load your profile. Please try again.');
      setLoading(false);
    }
  };

  const getAttributeLabel = (attrId: string): string => {
    const labels: Record<string, string> = {
      big5_extraversion: 'Extraversion',
      big5_agreeableness: 'Agreeableness',
      big5_conscientiousness: 'Conscientiousness',
      big5_neuroticism: 'Emotional Stability',
      big5_openness: 'Openness to Experience',
      need_to_belong: 'Need to Belong',
      sensation_seeking: 'Sensation Seeking',
      activity_novelty: 'Novelty Seeking',
      structure_preference: 'Preference for Structure',
      noise_tolerance: 'Tolerance for Noise',
    };
    return labels[attrId] || attrId;
  };

  const handleContinue = () => {
    navigation.navigate('ChoiceExperiments');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Analyzing your profile...</Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No profile data'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Group attributes by category
  const big5Attrs = Object.keys(profile.profile).filter((k) => k.startsWith('big5_'));
  const socialAttrs = ['need_to_belong'];
  const riskAttrs = ['sensation_seeking'];
  const cityAttrs = ['activity_novelty', 'structure_preference', 'noise_tolerance'];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🎯</Text>
          <Text style={styles.title}>Your Profile</Text>
          <Text style={styles.subtitle}>
            Here's where you stand compared to others. This helps us recommend activities that truly
            fit your style.
          </Text>
        </View>

        {/* Narrative */}
        <View style={styles.narrativeBox}>
          <Text style={styles.narrativeTitle}>Your Style</Text>
          <Text style={styles.narrativeText}>{profile.narrative}</Text>
        </View>

        {/* Big Five */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality (Big Five)</Text>
          {big5Attrs.map((attr) => (
            <PercentileBar
              key={attr}
              label={getAttributeLabel(attr)}
              percentile={profile.profile[attr].percentile}
              theta={profile.profile[attr].theta}
              se={profile.profile[attr].se}
            />
          ))}
        </View>

        {/* Social Orientation */}
        {socialAttrs.some((a) => profile.profile[a]) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Orientation</Text>
            {socialAttrs
              .filter((a) => profile.profile[a])
              .map((attr) => (
                <PercentileBar
                  key={attr}
                  label={getAttributeLabel(attr)}
                  percentile={profile.profile[attr].percentile}
                  theta={profile.profile[attr].theta}
                  se={profile.profile[attr].se}
                />
              ))}
          </View>
        )}

        {/* Risk & Novelty */}
        {riskAttrs.some((a) => profile.profile[a]) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk & Novelty</Text>
            {riskAttrs
              .filter((a) => profile.profile[a])
              .map((attr) => (
                <PercentileBar
                  key={attr}
                  label={getAttributeLabel(attr)}
                  percentile={profile.profile[attr].percentile}
                  theta={profile.profile[attr].theta}
                  se={profile.profile[attr].se}
                />
              ))}
          </View>
        )}

        {/* City Preferences */}
        {cityAttrs.some((a) => profile.profile[a]) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>City Activity Preferences</Text>
            {cityAttrs
              .filter((a) => profile.profile[a])
              .map((attr) => (
                <PercentileBar
                  key={attr}
                  label={getAttributeLabel(attr)}
                  percentile={profile.profile[attr].percentile}
                  theta={profile.profile[attr].theta}
                  se={profile.profile[attr].se}
                />
              ))}
          </View>
        )}

        {/* How to interpret */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How to Read This</Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Percentile</Text> shows where you fall compared to others
            (50% = average)
          </Text>
          <Text style={styles.infoText}>
            • These scores are based on validated psychological research
          </Text>
          <Text style={styles.infoText}>
            • There are no "good" or "bad" scores - just what fits you best
          </Text>
        </View>
      </ScrollView>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Activity Choices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  narrativeBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  narrativeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  narrativeText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ProfileResultsScreen;
