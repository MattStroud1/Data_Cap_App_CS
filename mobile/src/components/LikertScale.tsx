import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LikertScore } from '../types/survey';

interface LikertScaleProps {
  question: string;
  value?: LikertScore;
  onChange: (value: LikertScore) => void;
  minLabel?: string;
  maxLabel?: string;
}

export const LikertScale: React.FC<LikertScaleProps> = ({
  question,
  value,
  onChange,
  minLabel = 'Strongly disagree',
  maxLabel = 'Strongly agree',
}) => {
  const scores: LikertScore[] = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.scaleContainer}>
        {scores.map((score) => (
          <TouchableOpacity
            key={score}
            style={[
              styles.scoreButton,
              value === score && styles.scoreButtonActive,
            ]}
            onPress={() => onChange(score)}
          >
            <Text
              style={[
                styles.scoreText,
                value === score && styles.scoreTextActive,
              ]}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelsContainer}>
        <Text style={styles.label}>{minLabel}</Text>
        <Text style={styles.label}>{maxLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 24,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  scoreButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  scoreTextActive: {
    color: '#ffffff',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: '#666',
    maxWidth: '40%',
  },
});
