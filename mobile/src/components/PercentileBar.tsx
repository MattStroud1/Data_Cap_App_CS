import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PercentileBarProps {
  label: string;
  percentile: number;
  theta?: number;
  se?: number;
}

export const PercentileBar: React.FC<PercentileBarProps> = ({
  label,
  percentile,
  theta,
  se,
}) => {
  const getColor = (pct: number): string => {
    if (pct >= 70) return '#007AFF';
    if (pct >= 30) return '#34C759';
    return '#FF9500';
  };

  const getLabel = (pct: number): string => {
    if (pct >= 85) return 'Very High';
    if (pct >= 70) return 'High';
    if (pct >= 55) return 'Above Average';
    if (pct >= 45) return 'Average';
    if (pct >= 30) return 'Below Average';
    if (pct >= 15) return 'Low';
    return 'Very Low';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentileText, { color: getColor(percentile) }]}>
          {getLabel(percentile)}
        </Text>
      </View>

      {/* Percentile bar */}
      <View style={styles.barContainer}>
        {/* Background segments */}
        <View style={styles.barBackground}>
          <View style={[styles.segment, { backgroundColor: '#FFE5E5' }]} />
          <View style={[styles.segment, { backgroundColor: '#FFF4E5' }]} />
          <View style={[styles.segment, { backgroundColor: '#E8F8EC' }]} />
          <View style={[styles.segment, { backgroundColor: '#E5F0FF' }]} />
          <View style={[styles.segment, { backgroundColor: '#E8F4FF' }]} />
        </View>

        {/* Marker */}
        <View style={[styles.marker, { left: `${percentile}%` }]}>
          <View style={[styles.markerDot, { backgroundColor: getColor(percentile) }]} />
          <Text style={styles.markerText}>{percentile}%</Text>
        </View>
      </View>

      {/* Scale labels */}
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>0</Text>
        <Text style={styles.scaleLabel}>25</Text>
        <Text style={styles.scaleLabel}>50</Text>
        <Text style={styles.scaleLabel}>75</Text>
        <Text style={styles.scaleLabel}>100</Text>
      </View>

      {theta !== undefined && se !== undefined && (
        <Text style={styles.details}>
          Score: {theta.toFixed(2)} ± {se.toFixed(2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  percentileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  barContainer: {
    height: 40,
    position: 'relative',
    marginBottom: 8,
  },
  barBackground: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  segment: {
    flex: 1,
  },
  marker: {
    position: 'absolute',
    top: -4,
    marginLeft: -8,
    alignItems: 'center',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#999',
  },
  details: {
    marginTop: 4,
    fontSize: 11,
    color: '#999',
  },
});
