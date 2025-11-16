import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EventOption } from '../types/survey';

interface EventCardProps {
  event: EventOption;
  selected?: boolean;
  onPress: () => void;
  selectionType?: 'most' | 'least' | null;
}

const budgetSymbols = ['Free', '£', '££', '£££', '££££'];
const crowdIcons = { small: '👤', medium: '👥', large: '👥👥' };
const noiseIcons = { low: '🔇', medium: '🔉', high: '🔊' };

export const EventCard: React.FC<EventCardProps> = ({
  event,
  selected,
  onPress,
  selectionType,
}) => {
  const getBorderColor = () => {
    if (!selected) return '#e0e0e0';
    if (selectionType === 'most') return '#34C759';
    if (selectionType === 'least') return '#FF3B30';
    return '#007AFF';
  };

  const getBackgroundColor = () => {
    if (!selected) return '#fff';
    if (selectionType === 'most') return '#e8f8ec';
    if (selectionType === 'least') return '#ffe8e8';
    return '#e8f4ff';
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: getBorderColor(), backgroundColor: getBackgroundColor() },
      ]}
      onPress={onPress}
    >
      {selected && selectionType && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: selectionType === 'most' ? '#34C759' : '#FF3B30',
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {selectionType === 'most' ? 'Most Appealing' : 'Least Appealing'}
          </Text>
        </View>
      )}

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>
            {event.distance_minutes} min {event.travel_mode}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>{budgetSymbols[event.price_band]}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {event.day.charAt(0).toUpperCase() + event.day.slice(1)} {event.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>{crowdIcons[event.crowd_size]}</Text>
          <Text style={styles.detailText}>
            {event.crowd_size.charAt(0).toUpperCase() + event.crowd_size.slice(1)} crowd
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>{noiseIcons[event.noise_level]}</Text>
          <Text style={styles.detailText}>
            {event.noise_level.charAt(0).toUpperCase() + event.noise_level.slice(1)} energy
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    width: 24,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});
