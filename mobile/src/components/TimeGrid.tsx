import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeAvailability, TimeSlot, DayOfWeek } from '../types/survey';

interface TimeGridProps {
  question: string;
  value: TimeAvailability;
  onChange: (value: TimeAvailability) => void;
}

const days: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const timeSlots: (keyof TimeSlot)[] = ['morning', 'afternoon', 'evening'];

const timeSlotLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export const TimeGrid: React.FC<TimeGridProps> = ({ question, value, onChange }) => {
  const toggleSlot = (day: DayOfWeek, slot: keyof TimeSlot) => {
    const newValue = {
      ...value,
      [day]: {
        ...value[day],
        [slot]: !value[day][slot],
      },
    };
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.hint}>Tap blocks when you're usually free</Text>

      <View style={styles.grid}>
        {/* Header row with time slots */}
        <View style={styles.headerRow}>
          <View style={styles.dayLabelCell} />
          {timeSlots.map((slot) => (
            <View key={slot} style={styles.headerCell}>
              <Text style={styles.headerText}>{timeSlotLabels[slot]}</Text>
            </View>
          ))}
        </View>

        {/* Day rows */}
        {days.map((day) => (
          <View key={day.key} style={styles.row}>
            <View style={styles.dayLabelCell}>
              <Text style={styles.dayLabel}>{day.label}</Text>
            </View>
            {timeSlots.map((slot) => {
              const isSelected = value[day.key][slot];
              return (
                <TouchableOpacity
                  key={`${day.key}-${slot}`}
                  style={[styles.cell, isSelected && styles.cellSelected]}
                  onPress={() => toggleSlot(day.key, slot)}
                >
                  <View style={[styles.cellInner, isSelected && styles.cellInnerSelected]} />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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
  grid: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayLabelCell: {
    width: 60,
    paddingVertical: 12,
    justifyContent: 'center',
    paddingLeft: 12,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellInner: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cellSelected: {},
  cellInnerSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});
