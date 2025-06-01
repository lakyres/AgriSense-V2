import React, { useEffect, useState, useRef } from 'react';
import {
  Text, View, Image, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, Linking, RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "@/lib/ThemeProvider";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { parse, format } from "date-fns";

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
    days_since_transplant: number; // ✅ added
  };
}

const formatTimestampToDateAndTime = (timestamp: string) => {
  if (!timestamp.includes('_')) return { date: timestamp, time: '' };
  const [datePart, timePart] = timestamp.split('_');
  const parsedDate = parse(datePart, 'yyyy-MM-dd', new Date());
  const formattedDate = format(parsedDate, 'MMMM d, yyyy');
  const formattedTime = timePart.replace(/-/g, ':');
  return { date: formattedDate, time: formattedTime };
};

export default function Home() {
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useThemeContext();
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Detection | null>(null);
  const lastDetectionId = useRef<string | null>(null);
  const CACHE_BUSTER = `?t=${Date.now()}`;


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

      const avgDays = leafData.length > 0
        ? Math.round(leafData.reduce((sum: number, plant: any) =>
            sum + (plant.days_since_transplant || 0), 0) / leafData.length)
        : 0;

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
          days_since_transplant: avgDays, // ✅ inserted
        },
      };

      return latest;
    } catch (e) {
      console.error("❌ Failed to fetch latest detection:", e);
      return null;
    }
  };


  const checkAlertCondition = (latest: Detection) => {
    const alerts = [];

    if (latest.environment.light_intensity_lux < 500) {
      alerts.push(`Warning: Low light detected (${latest.environment.light_intensity_lux.toFixed(1)} lux)`);
    } else if (latest.environment.light_intensity_lux > 10000) {
      alerts.push(`Warning: High light detected (${latest.environment.light_intensity_lux.toFixed(1)} lux)`);
    }

    if (latest.growth.pest_detected !== "None") {
      alerts.push(`Alert: Pest detected - ${latest.growth.pest_detected}`);
    }

    if (latest.growth.growth_stage.toLowerCase() === "mature") {
      alerts.push(`Info: Plant has reached mature stage`);
    }

    if (latest.environment.air_temperature_c < 15) {
      alerts.push(`Warning: Low air temperature (${latest.environment.air_temperature_c.toFixed(1)}°C)`);
    } else if (latest.environment.air_temperature_c > 35) {
      alerts.push(`Warning: High air temperature (${latest.environment.air_temperature_c.toFixed(1)}°C)`);
    }

    if (latest.environment.water_temperature_c < 15) {
      alerts.push(`Warning: Low water temperature (${latest.environment.water_temperature_c.toFixed(1)}°C)`);
    } else if (latest.environment.water_temperature_c > 30) {
      alerts.push(`Warning: High water temperature (${latest.environment.water_temperature_c.toFixed(1)}°C)`);
    }

    if (latest.environment.humidity_percent < 40) {
      alerts.push(`Warning: Low humidity (${latest.environment.humidity_percent.toFixed(1)}%)`);
    } else if (latest.environment.humidity_percent > 80) {
      alerts.push(`Warning: High humidity (${latest.environment.humidity_percent.toFixed(1)}%)`);
    }

    return alerts.length > 0 ? alerts.join("\n") : null;
  };

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
          setAlertModalVisible(true);
        } else {
          setAlertMessage(null);
          setAlertModalVisible(false);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndUpdate();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAndUpdate();
    setRefreshing(false);
  };

  const openModal = () => {
    if (detection) {
      setModalData(detection);
      setModalVisible(true);
    }
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
                Days Since Transplant: <Text style={[styles.value, isDarkMode && styles.textLight]}>{detection.growth.days_since_transplant}</Text>
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
              <Text style={[styles.label, isDarkMode && styles.textMuted]}>
                Matured Plants: <Text style={[styles.value, isDarkMode && styles.textLight]}>
                  {detection.growth.growth_stage.toLowerCase() === "mature" ? detection.growth.plant_count : 0}
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
                  <TouchableOpacity onPress={openModal}>
                    <Image source={{ uri: detection.detected_image_url }} style={styles.image} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Timestamp with separate Date & Time */}
              <View style={{ marginBottom: 12 }}>
                {(() => {
                  const { date, time } = formatTimestampToDateAndTime(detection.id);
                  return (
                    <>
                      <Text style={[styles.timestamp, isDarkMode && styles.textMuted]}>
                        Date: {date}
                      </Text>
                      <Text style={[styles.timestamp, isDarkMode && styles.textMuted]}>
                        Time: {time}
                      </Text>
                    </>
                  );
                })()}
              </View>

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
        visible={alertModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginBottom: 12 }}>{alertMessage}</Text>
            <TouchableOpacity onPress={() => setAlertModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for detected image details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalLabel}>
              Raw Image
            </Text>
            <Image
              source={{ uri: modalData?.raw_image_url }}
              style={styles.modalImage}
            />

            <Text style={styles.modalLabel}>
              Detected Image
            </Text>
            <Image
              source={{ uri: modalData?.detected_image_url }}
              style={styles.modalImage}
            />
            <Text style={styles.modalText}>
              🐛 Pest Detected: {modalData?.growth.pest_detected || "None"}
            </Text>
            <Text style={styles.modalText}>
              📅 Days Since Transplant: {modalData?.growth.days_since_transplant || "N/A"}
            </Text>
            <Text style={styles.modalText}>
              🌱 Growth Stage: {modalData?.growth.growth_stage || "N/A"}
            </Text>
            <Text style={styles.modalText}>
              📏 Height: {modalData?.growth.height_cm} cm
            </Text>
            <Text style={styles.modalText}>
              🍃 Leaf Area: {modalData?.growth.leaf_area_cm2} cm²
            </Text>
            <Text style={styles.modalText}>
              🌿 Leaf Count: {modalData?.growth.leaf_count}
            </Text>
            <Text style={styles.modalText}>
              🌡 Air Temp: {modalData?.environment.air_temperature_c}°C
            </Text>
            <Text style={styles.modalText}>
              💧 Humidity: {modalData?.environment.humidity_percent}%
            </Text>
            <Text style={styles.modalText}>
              💡 Light: {modalData?.environment.light_intensity_lux} lux
            </Text>
            <Text style={styles.modalText}>
              🌊 Water Temp: {modalData?.environment.water_temperature_c}°C
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
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
    marginBottom: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginTop: 4,
    color: '#ffffff',
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
    color: '#ffffff',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#15803D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
});
