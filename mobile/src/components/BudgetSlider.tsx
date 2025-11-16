import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BudgetBand } from '../types/survey';

interface BudgetSliderProps {
  question: string;
  value?: BudgetBand;
  onChange: (value: BudgetBand) => void;
}

const budgetOptions = [
  { value: 0 as BudgetBand, label: 'Free', symbol: '£0' },
  { value: 1 as BudgetBand, label: 'Low cost', symbol: '£' },
  { value: 2 as BudgetBand, label: 'Moderate', symbol: '££' },
  { value: 3 as BudgetBand, label: 'Higher', symbol: '£££' },
  { value: 4 as BudgetBand, label: 'Premium', symbol: '££££' },
];

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  question,
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.sliderContainer}>
        {budgetOptions.map((option, index) => {
          const isSelected = value === option.value;
          const isBeforeSelected = value !== undefined && option.value <= value;

          return (
            <TouchableOpacity
              key={option.value}
              style={styles.optionContainer}
              onPress={() => onChange(option.value)}
            >
              <View
                style={[
                  styles.dot,
                  isBeforeSelected && styles.dotActive,
                  isSelected && styles.dotSelected,
                ]}
              />
              <Text style={[styles.symbol, isSelected && styles.symbolSelected]}>
                {option.symbol}
              </Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.track}>
        {value !== undefined && (
          <View style={[styles.trackActive, { width: `${(value / 4) * 100}%` }]} />
        )}
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
    marginBottom: 20,
    lineHeight: 24,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    zIndex: 2,
  },
  optionContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 6,
  },
  dotActive: {
    backgroundColor: '#007AFF',
  },
  dotSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    borderWidth: 4,
    borderColor: '#e8f4ff',
  },
  symbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  symbolSelected: {
    fontSize: 16,
    color: '#007AFF',
  },
  optionLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  track: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: -40,
    marginHorizontal: 8,
    zIndex: 1,
  },
  trackActive: {
    height: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
