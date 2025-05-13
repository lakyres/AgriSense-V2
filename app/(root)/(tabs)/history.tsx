import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/lib/ThemeProvider';
import { getDetections, Detection } from '@/utils/getDetections';

export default function HistoryScreen() {
  const { isDarkMode } = useThemeContext();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getDetections();
        setDetections(data);
      } catch (error) {
        console.error("❌ Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  const cardBg = isDarkMode ? '#374151' : '#ECFDF5';
  const cardBorder = isDarkMode ? '#4B5563' : '#D1FAE5';
  const textColor = isDarkMode ? '#D1D5DB' : '#065F46';
  const highlightColor = isDarkMode ? '#86efac' : '#15803D';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.header, { color: highlightColor }]}>
          📜 Detection History
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={highlightColor} />
        ) : detections.length === 0 ? (
          <Text style={[styles.noData, { color: textColor }]}>
            No detection logs found.
          </Text>
        ) : (
          detections.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Text style={[styles.timestamp, { color: textColor }]}>
                📅 {item.id}
              </Text>
              <Text style={[styles.label, { color: textColor }]}>
                🌿 Growth Stage: <Text style={styles.value}>{item.growth.growth_stage}</Text>
              </Text>
              <Text style={[styles.label, { color: textColor }]}>
                🐛 Pest: <Text style={styles.value}>{item.growth.pest_detected}</Text>
              </Text>
              <Text style={[styles.label, { color: textColor }]}>
                🌡 Temp: <Text style={styles.value}>{item.environment.air_temperature_c}°C</Text>
              </Text>
              <Text style={[styles.label, { color: textColor }]}>
                💧 Humidity: <Text style={styles.value}>{item.environment.humidity_percent}%</Text>
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
