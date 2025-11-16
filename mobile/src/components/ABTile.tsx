import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ABChoice } from '../types/survey';

interface ABTileProps {
  question: string;
  optionA: string;
  optionB: string;
  value?: ABChoice;
  onChange: (value: ABChoice) => void;
}

export const ABTile: React.FC<ABTileProps> = ({
  question,
  optionA,
  optionB,
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.tilesContainer}>
        <TouchableOpacity
          style={[
            styles.tile,
            value === 'A' && styles.tileSelected,
          ]}
          onPress={() => onChange('A')}
        >
          <View style={styles.tileHeader}>
            <View style={[styles.radioOuter, value === 'A' && styles.radioOuterSelected]}>
              {value === 'A' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.tileLabel}>Option A</Text>
          </View>
          <Text style={[styles.tileText, value === 'A' && styles.tileTextSelected]}>
            {optionA}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tile,
            value === 'B' && styles.tileSelected,
          ]}
          onPress={() => onChange('B')}
        >
          <View style={styles.tileHeader}>
            <View style={[styles.radioOuter, value === 'B' && styles.radioOuterSelected]}>
              {value === 'B' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.tileLabel}>Option B</Text>
          </View>
          <Text style={[styles.tileText, value === 'B' && styles.tileTextSelected]}>
            {optionB}
          </Text>
        </TouchableOpacity>
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
  tilesContainer: {
    gap: 12,
  },
  tile: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  tileSelected: {
    backgroundColor: '#e8f4ff',
    borderColor: '#007AFF',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tileText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  tileTextSelected: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
