import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GroupSize } from '../types/survey';

interface GroupSizeSelectorProps {
  question: string;
  selectedSizes: GroupSize[];
  onChange: (sizes: GroupSize[]) => void;
  maxSelections?: number;
}

const groupSizeOptions: { value: GroupSize; label: string; icon: string }[] = [
  { value: 'solo', label: 'Solo', icon: '🧍' },
  { value: 'small-2-3', label: '2-3 people', icon: '👥' },
  { value: 'medium-4-8', label: '4-8 people', icon: '👨‍👩‍👧‍👦' },
  { value: 'large-crowd', label: 'Large crowd', icon: '👥👥👥' },
];

export const GroupSizeSelector: React.FC<GroupSizeSelectorProps> = ({
  question,
  selectedSizes,
  onChange,
  maxSelections = 2,
}) => {
  const toggleSize = (size: GroupSize) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      if (selectedSizes.length >= maxSelections) {
        // Replace the first selection
        const newSizes = [...selectedSizes.slice(1), size];
        onChange(newSizes);
      } else {
        onChange([...selectedSizes, size]);
      }
    }
  };

  const getSelectionOrder = (size: GroupSize): number | null => {
    const index = selectedSizes.indexOf(size);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.hint}>
        Select your top {maxSelections} (in order of preference)
      </Text>

      <View style={styles.optionsContainer}>
        {groupSizeOptions.map((option) => {
          const isSelected = selectedSizes.includes(option.value);
          const order = getSelectionOrder(option.value);

          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.tile, isSelected && styles.tileSelected]}
              onPress={() => toggleSize(option.value)}
            >
              {isSelected && order !== null && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{order}</Text>
                </View>
              )}
              <Text style={styles.icon}>{option.icon}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
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
    marginBottom: 8,
    lineHeight: 24,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    position: 'relative',
  },
  tileSelected: {
    backgroundColor: '#e8f4ff',
    borderColor: '#007AFF',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
