import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPredictions, Prediction } from '@/utils/getPredictions';
import { useThemeContext } from '@/lib/ThemeProvider';

export default function Dashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPredictions();
        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.header, isDarkMode && styles.textLight]}>Prediction History</Text>

        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? "#86efac" : "#16A34A"} />
        ) : (
          predictions.length > 0 ? (
            predictions.map((item) => (
              <View key={item.id} style={[styles.card, isDarkMode && styles.cardDark]}>
                {/* ⚡ Base64 safety check before rendering */}
                {item.image_url && item.image_url.length < 100000 ? (
                  <Image source={{ uri: item.image_url }} style={styles.image} />
                ) : (
                  item.image_url && (
                    <Text style={{ color: isDarkMode ? "#9CA3AF" : "#6B7280", marginBottom: 12 }}>
                      (Image too large to display)
                    </Text>
                  )
                )}

                <Text style={[styles.timestamp, isDarkMode && styles.textMuted]}>{item.timestamp}</Text>

                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Growth Stage: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.maturity}</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Pest: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.pest}</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Temperature: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.air_temp}°C</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Humidity: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.humidity}%</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Light: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.light_intensity} lux</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Water Temp: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.water_temp}°C</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Height: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.height} cm</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Leaf Area: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.leaf_area} cm²</Text>
                </Text>
                <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                  Leaf Count: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.leaf_count}</Text>
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noData, isDarkMode && styles.textMuted]}>No data available.</Text>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#1f2937',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#15803D',
  },
  card: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#D1FAE5',
    borderWidth: 1,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    shadowColor: 'transparent',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#065F46',
  },
  value: {
    fontWeight: 'bold',
    color: '#064E3B',
  },
  noData: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
  },
  textLight: {
    color: '#ffffff',
  },
  textMuted: {
    color: '#D1D5DB',
  },
});
