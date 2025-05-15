import React, { useEffect, useState, useRef } from 'react';
import {
  Text, View, Image, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, Linking, RefreshControl,
  Modal, Button
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "@/lib/ThemeProvider";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref as storageRef } from "firebase/storage";

export interface Detection {
  id: string;
  raw_image_url: string;
  detected_image_url: string;
  environment: {
    air_temperature_c: number;
    water_temperature_c: number;
    humidity_percent: number;
    light_intensity_lux: number;
  };
  growth: {
    plant_count: number;
    growth_stage: string;
    pest_detected: string;
    height_cm: number;
    leaf_area_cm2: number;
    leaf_count: number;
  };
}

export default function Home() {
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { isDarkMode } = useThemeContext();

  // Modal alert states
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Track last detection ID to avoid repeated alerts
  const lastDetectionId = useRef<string | null>(null);

  const CACHE_BUSTER = `?t=${Date.now()}`;

  // Function to fetch the latest detection data from Firebase Storage
  const fetchLatestDetection = async () => {
    try {
      const indexRef = storageRef(storage, "detections/detection_index.json");
      const indexUrl = await getDownloadURL(indexRef);
      const indexRes = await fetch(indexUrl + CACHE_BUSTER);
      const folderList: string[] = await indexRes.json();
      const latestId = folderList[folderList.length - 1].trim();

      const rawRef = storageRef(storage, `detections/${latestId}/Raw.jpg`);
      const detectedRef = storageRef(storage, `detections/${latestId}/Detected.jpg`);
      const envRef = storageRef(storage, `detections/${latestId}/environment_data.json`);
      const growthRef = storageRef(storage, `detections/${latestId}/growth_parameters.json`);

      const growthUrl = (await getDownloadURL(growthRef)) + CACHE_BUSTER;
      const [rawUrl, detectedUrl, envUrl] = await Promise.all([
        getDownloadURL(rawRef),
        getDownloadURL(detectedRef),
        getDownloadURL(envRef),
      ]);

      const [envData, growthData] = await Promise.all([
        fetch(envUrl).then((res) => res.json()),
        fetch(growthUrl).then((res) => res.json()),
      ]);

      const leafData = growthData.leaf_data_per_box || [];
      const firstPlant = leafData[0];

      const latest: Detection = {
        id: latestId,
        raw_image_url: rawUrl,
        detected_image_url: detectedUrl,
        environment: {
          air_temperature_c: envData.air_temperature_c,
          water_temperature_c: envData.water_temperature_c,
          humidity_percent: envData.humidity_percent,
          light_intensity_lux: envData.light_intensity,
        },
        growth: {
          plant_count: leafData.length,
          growth_stage: firstPlant?.growth_stage || "N/A",
          pest_detected: firstPlant?.pest_detected || "None",
          height_cm: firstPlant?.height_cm || 0,
          leaf_area_cm2: firstPlant?.largest_leaf_area || 0,
          leaf_count: firstPlant?.leaf_count || 0,
        },
      };

      return latest;
    } catch (e) {
      console.error("❌ Failed to fetch latest detection:", e);
      return null;
    }
  };

  // Check alert conditions and return combined message or null
  const checkAlertCondition = (latest: Detection) => {
    const alerts = [];

    // Light intensity check
    if (latest.environment.light_intensity_lux < 500) {
      alerts.push(`Warning: Low light detected (${latest.environment.light_intensity_lux.toFixed(1)} lux)`);
    } else if (latest.environment.light_intensity_lux > 10000) {
      alerts.push(`Warning: High light detected (${latest.environment.light_intensity_lux.toFixed(1)} lux)`);
    }

    // Pest detection check
    if (latest.growth.pest_detected !== "None") {
      alerts.push(`Alert: Pest detected - ${latest.growth.pest_detected}`);
    }

    // Mature growth stage check
    if (latest.growth.growth_stage.toLowerCase() === "mature") {
      alerts.push(`Info: Plant has reached mature stage`);
    }

    // Air temperature check
    if (latest.environment.air_temperature_c < 15) {
      alerts.push(`Warning: Low air temperature (${latest.environment.air_temperature_c.toFixed(1)}°C)`);
    } else if (latest.environment.air_temperature_c > 35) {
      alerts.push(`Warning: High air temperature (${latest.environment.air_temperature_c.toFixed(1)}°C)`);
    }

    // Water temperature check
    if (latest.environment.water_temperature_c < 15) {
      alerts.push(`Warning: Low water temperature (${latest.environment.water_temperature_c.toFixed(1)}°C)`);
    } else if (latest.environment.water_temperature_c > 30) {
      alerts.push(`Warning: High water temperature (${latest.environment.water_temperature_c.toFixed(1)}°C)`);
    }

    // Humidity check
    if (latest.environment.humidity_percent < 40) {
      alerts.push(`Warning: Low humidity (${latest.environment.humidity_percent.toFixed(1)}%)`);
    } else if (latest.environment.humidity_percent > 80) {
      alerts.push(`Warning: High humidity (${latest.environment.humidity_percent.toFixed(1)}%)`);
    }

    if (alerts.length === 0) return null;
    return alerts.join("\n");
  };

  // Fetch latest detection and update states + alert
  const fetchAndUpdate = async () => {
    setLoading(true);
    const latest = await fetchLatestDetection();
    if (latest) {
      setDetection(latest);

      if (lastDetectionId.current !== latest.id) {
        lastDetectionId.current = latest.id;
        const alert = checkAlertCondition(latest);
        if (alert) {
          setAlertMessage(alert);
          setModalVisible(true);
        } else {
          setAlertMessage(null);
          setModalVisible(false);
        }
      }
    }
    setLoading(false);
  };

  // On component mount fetch data once
  useEffect(() => {
    fetchAndUpdate();
  }, []);

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAndUpdate();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDarkMode ? "#86efac" : "#16A34A"]}
          />
        }
      >
        <View style={{ marginBottom: 20, alignItems: 'center' }}>
          <Text style={[styles.header, isDarkMode && styles.textLight]}>
            How’s My Pechay?
          </Text>

          {detection ? (
            detection.growth.pest_detected !== "None" ? (
              <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>
                ⚠️ Pest detected — keep an eye out!
              </Text>
            ) : (
              <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>
                ✅ Looks healthy today!
              </Text>
            )
          ) : (
            <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>
              📡 Waiting for scan results...
            </Text>
          )}
        </View>

        {detection && (
          <>
            <View style={[styles.summaryCard, isDarkMode && styles.cardDark]}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#86efac' : '#15803D' }]}>
                ✅ Latest Scan Summary
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Growth Stage: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.growth_stage}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Pest Detected: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.pest_detected}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Moisture Level: <Text style={[styles.value, isDarkMode && styles.textLight]}>
                  {detection.environment.humidity_percent >= 60 ? 'Good' : 'Low'}
                </Text>
              </Text>
            </View>

            <View style={[styles.summaryCard, isDarkMode && styles.cardDark]}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#86efac' : '#15803D' }]}>
                📊 Real-time Stats
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Plant Count: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.plant_count}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Healthy: <Text style={[styles.value, isDarkMode && styles.textLight]}>
                  {detection.growth.plant_count - (detection.growth.pest_detected !== "None" ? 1 : 0)}
                </Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Pest-Detected: <Text style={[styles.value, isDarkMode && styles.textLight]}>
                  {detection.growth.pest_detected !== "None" ? 1 : 0}
                </Text>
              </Text>
            </View>

            <View style={[styles.card, isDarkMode && styles.cardDark]}>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, isDarkMode && styles.textMuted, { marginBottom: 4 }]}>Raw</Text>
                  <Image source={{ uri: detection.raw_image_url }} style={styles.image} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, isDarkMode && styles.textMuted, { marginBottom: 4 }]}>Detected</Text>
                  <Image source={{ uri: detection.detected_image_url }} style={styles.image} />
                </View>
              </View>

              <Text style={[styles.timestamp, isDarkMode && styles.textMuted]}>{detection.id}</Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Height: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.height_cm} cm</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Leaf Area: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.leaf_area_cm2} cm²</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Leaf Count: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.leaf_count}</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Temp: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.environment.air_temperature_c}°C</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Humidity: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.environment.humidity_percent}%</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Light: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.environment.light_intensity_lux} lux</Text>
              </Text>
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Water Temp: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.environment.water_temperature_c}°C</Text>
              </Text>

              <TouchableOpacity onPress={() => Linking.openURL(detection.detected_image_url)}>
                <Text style={{ color: isDarkMode ? "#86efac" : "#15803D", fontWeight: "bold", marginTop: 10 }}>
                  Download Detected Image
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {loading && (
          <ActivityIndicator size="large" color={isDarkMode ? "#86efac" : "#16A34A"} />
        )}
      </ScrollView>

      {/* Modal Alert */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginBottom: 12 }}>{alertMessage}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  containerDark: { backgroundColor: '#1f2937' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#15803D',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4B5563',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  textLight: { color: '#ffffff' },
  textMuted: { color: '#D1D5DB' },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 8,
    elevation: 5,
  },
});
