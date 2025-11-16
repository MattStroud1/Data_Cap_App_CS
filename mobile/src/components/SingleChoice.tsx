import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SingleChoiceOption {
  value: string;
  label: string;
}

interface SingleChoiceProps {
  question: string;
  options: SingleChoiceOption[];
  value?: string;
  onChange: (value: string) => void;
  layout?: 'vertical' | 'grid';
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  options,
  value,
  onChange,
  layout = 'vertical',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={[
        styles.optionsContainer,
        layout === 'grid' && styles.optionsContainerGrid,
      ]}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                layout === 'grid' && styles.optionGrid,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => onChange(option.value)}
            >
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  optionsContainer: {
    gap: 10,
  },
  optionsContainerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 14,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionGrid: {
    flex: 1,
    minWidth: '45%',
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#e8f4ff',
    borderColor: '#007AFF',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
