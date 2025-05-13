import React, { useEffect, useState } from 'react';
import {
  Text, View, Image, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDetections, Detection } from "@/utils/getDetections";
import { useThemeContext } from "@/lib/ThemeProvider";
import { auth } from "@/lib/firebase";


export default function Dashboard() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      console.log("👤 Logged in user:", user.email);
    } else {
      console.warn("❌ No user signed in.");
    }

    const fetch = async () => {
      try {
        const data = await getDetections();
        setDetections(data);
      } catch (e) {
        console.error("❌ Error fetching detections:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {userEmail && (
          <Text style={[styles.emailText, isDarkMode && styles.textMuted]}>
            Logged in as: {userEmail}
          </Text>
        )}
        <Text style={[styles.header, isDarkMode && styles.textLight]}>Detection History</Text>

        {loading ? (
          <ActivityIndicator size="large" color={isDarkMode ? "#86efac" : "#16A34A"} />
        ) : detections.length === 0 ? (
          <Text style={[styles.noData, isDarkMode && styles.textMuted]}>No detections found.</Text>
        ) : (
          detections.map((item) => (
            <View key={item.id} style={[styles.card, isDarkMode && styles.cardDark]}>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, isDarkMode && styles.textMuted, { marginBottom: 4 }]}>Raw</Text>
                  <Image source={{ uri: item.raw_image_url }} style={styles.image} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, isDarkMode && styles.textMuted, { marginBottom: 4 }]}>Detected</Text>
                  <Image source={{ uri: item.detected_image_url }} style={styles.image} />
                </View>
              </View>

              <Text style={[styles.timestamp, isDarkMode && styles.textMuted]}>{item.id}</Text>
              
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Plant Count: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.plant_count}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Growth Stage: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.growth_stage}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Pest: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.pest_detected}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Height: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.height_cm} cm</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Leaf Area: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.leaf_area_cm2} cm²</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Leaf Count: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.growth.leaf_count}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Temp: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.environment.air_temperature_c}°C</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Humidity: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.environment.humidity_percent}%</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Light: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.environment.light_intensity_lux} lux</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Water Temp: <Text style={[styles.value, isDarkMode && styles.textLight]}>{item.environment.water_temperature_c}°C</Text>
              </Text>

              <TouchableOpacity onPress={() => Linking.openURL(item.detected_image_url)}>
                <Text style={{ color: isDarkMode ? "#86efac" : "#15803D", fontWeight: "bold", marginTop: 10 }}>
                  Download Detected Image
                </Text>
              </TouchableOpacity>
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
  emailText: {
    fontSize: 14,
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 10,
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
    aspectRatio: 1,
    borderRadius: 8,
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
