import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/lib/ThemeProvider';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { parse, format, addDays, differenceInCalendarDays } from 'date-fns';

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

export default function HistoryScreen() {
  const { isDarkMode } = useThemeContext();
  const [allIds, setAllIds] = useState<string[]>([]);
  const [detections, setDetections] = useState<(Detection & {
    transition?: string;
    transitionColor?: string;
    pestTransition?: string;
    pestTransitionColor?: string;
    daysRemaining?: number;
    estimatedMaturityDate?: string;
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Detection | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedPestFilter, setSelectedPestFilter] = useState<'All' | 'Pest' | 'None'>('All');
  const [showPicker, setShowPicker] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Record<string, boolean>>({});

  const stageOrder: Record<string, number> = { Seedling: 1, Vegetative: 2, Mature: 3 };
  const stageDurations = { Seedling: 5, Vegetative: 10, Mature: 0 };

  useEffect(() => {
    const loadDetections = async () => {
      try {
        const indexRef = storageRef(storage, 'detections/detection_index.json');
        const indexUrl = await getDownloadURL(indexRef);
        const res = await fetch(indexUrl);
        const list: string[] = (await res.json()).reverse();
        setAllIds(list);

        const fetchedDetections: Detection[] = [];

        for (const id of list) {
          try {
            const rawRef = storageRef(storage, `detections/${id}/Raw.jpg`);
            const detectedRef = storageRef(storage, `detections/${id}/Detected.jpg`);
            const envRef = storageRef(storage, `detections/${id}/environment_data.json`);
            const growthRef = storageRef(storage, `detections/${id}/growth_parameters.json`);

            const [rawUrl, detectedUrl, envUrl, growthUrl] = await Promise.all([
              getDownloadURL(rawRef),
              getDownloadURL(detectedRef),
              getDownloadURL(envRef),
              getDownloadURL(growthRef),
            ]);

            const [envData, growthData] = await Promise.all([
              fetch(envUrl).then((res) => res.json()),
              fetch(growthUrl).then((res) => res.json()),
            ]);

            const leafData = growthData.leaf_data_per_box || [];
            const firstPlant = leafData[0];

            fetchedDetections.push({
              id,
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
                growth_stage: firstPlant?.growth_stage || 'N/A',
                pest_detected: firstPlant?.pest_detected || 'None',
                height_cm: firstPlant?.height_cm || 0,
                leaf_area_cm2: firstPlant?.largest_leaf_area || 0,
                leaf_count: firstPlant?.leaf_count || 0,
              },
            });
          } catch (err) {
            console.warn(`⚠️ Skipping ${id} due to error:`, err);
          }
        }

        const validStages = ['Seedling', 'Vegetative', 'Mature'];

        let previousStage: string | null = null;
        let previousPest: string | null = null;
        let lastValidStage: string | null = null;

        const detectionsWithTransitions = fetchedDetections.map((det) => {
          let currentStage = det.growth.growth_stage;
          const currentPest = det.growth.pest_detected;

          // Replace invalid or "N/A" stage with last valid stage
          if (!validStages.includes(currentStage)) {
            if (lastValidStage) {
              currentStage = lastValidStage;
            }
          } else {
            lastValidStage = currentStage;
          }

          let transition: string | undefined;
          let transitionColor: string | undefined;
          if (previousStage && currentStage !== previousStage) {
            transition = `🌀 Transitioned from ${previousStage} to ${currentStage}`;
            const from = stageOrder[previousStage] ?? 0;
            const to = stageOrder[currentStage] ?? 0;
            transitionColor = to > from ? '#22c55e' : '#ef4444';
          }
          previousStage = currentStage;

          let pestTransition: string | undefined;
          let pestTransitionColor: string | undefined;
          if (
            previousPest &&
            currentPest !== previousPest &&
            !(previousPest.toLowerCase() === 'none' && currentPest.toLowerCase() === 'none')
          ) {
            pestTransition = `🐛 Pest changed: ${previousPest} → ${currentPest}`;
            pestTransitionColor = currentPest.toLowerCase() === 'none' ? '#22c55e' : '#f59e0b';
          }
          previousPest = currentPest;

          let daysRemaining: number | undefined;
          let estimatedMaturityDate: string | undefined;

          const [datePart] = det.id.split('_');
          const detectionDate = parse(datePart, 'yyyy-MM-dd', new Date());

          const stageDuration = stageDurations[currentStage as keyof typeof stageDurations];
          if (stageDuration !== undefined && stageDuration > 0) {
            const estimatedDate = addDays(detectionDate, stageDuration);
            let diff = differenceInCalendarDays(estimatedDate, new Date());
            if (diff < 0) diff = 0;
            daysRemaining = diff;
            estimatedMaturityDate = format(estimatedDate, 'MMMM d, yyyy');
          }

          return {
            ...det,
            growth: {
              ...det.growth,
              growth_stage: currentStage,
            },
            transition,
            transitionColor,
            pestTransition,
            pestTransitionColor,
            daysRemaining,
            estimatedMaturityDate,
          };
        });

        setDetections(detectionsWithTransitions);
      } catch (err) {
        console.error('❌ Failed to load detection index:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetections();
  }, []);

  const onChangeDate = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  const cardBg = isDarkMode ? '#374151' : '#ECFDF5';
  const cardBorder = isDarkMode ? '#4B5563' : '#D1FAE5';
  const textColor = isDarkMode ? '#D1D5DB' : '#065F46';
  const highlightColor = isDarkMode ? '#86efac' : '#15803D';

  const formatIdToDateTime = (id: string) => {
    const [datePart, timePart] = id.split('_');
    const parsedDate = parse(datePart, 'yyyy-MM-dd', new Date());
    const formattedDate = format(parsedDate, 'MMMM d, yyyy');
    const formattedTime = timePart ? timePart.replace(/-/g, ':') : '';
    return { formattedDate, formattedTime };
  };

  const selectedDateStr = selectedDate
    ? selectedDate.toLocaleDateString('sv-SE')
    : null;

  const filteredDetections = detections.filter((item) => {
    const dateMatch = selectedDateStr ? item.id.includes(selectedDateStr) : true;
    const stageMatch = selectedStage === 'All' || item.growth.growth_stage === selectedStage;

    let pestMatch = true;
    if (selectedPestFilter === 'Pest') {
      pestMatch =
        typeof item.growth.pest_detected === 'string' &&
        item.growth.pest_detected.toLowerCase() !== 'none';
    } else if (selectedPestFilter === 'None') {
      pestMatch =
        typeof item.growth.pest_detected === 'string' &&
        item.growth.pest_detected.toLowerCase() === 'none';
    }

    return dateMatch && stageMatch && pestMatch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.header, { color: highlightColor }]}>📜 Detection History</Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: textColor }]}>Filter by Date:</Text>
          <TouchableWithoutFeedback onPress={() => setShowPicker(true)}>
            <View style={[styles.datePicker, { borderColor: cardBorder }]}>
              <Text style={{ color: textColor }}>
                {selectedDateStr || '📅 Select date'}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: textColor }]}>Filter by Maturity:</Text>
          <Picker
            selectedValue={selectedStage}
            onValueChange={(value) => setSelectedStage(value)}
            style={{ color: textColor }}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Seedling" value="Seedling" />
            <Picker.Item label="Vegetative" value="Vegetative" />
            <Picker.Item label="Mature" value="Mature" />
          </Picker>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.label, { color: textColor }]}>Filter by Pest:</Text>
          <Picker
            selectedValue={selectedPestFilter}
            onValueChange={(value) => setSelectedPestFilter(value)}
            style={{ color: textColor }}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Pest Detected" value="Pest" />
            <Picker.Item label="None" value="None" />
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={highlightColor} />
        ) : filteredDetections.map((item, index) => {
          const { formattedDate, formattedTime } = formatIdToDateTime(item.id);
          return (
            <View
              key={`${item.id}_${index}`}
              style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={[styles.timestamp, { color: textColor }]}>{formattedDate}</Text>
                <Text style={[styles.timestamp, { color: textColor }]}>{formattedTime}</Text>
              </View>

              {item.transition && (
                <Text
                  style={{
                    color: item.transitionColor || textColor,
                    marginBottom: 6,
                    fontWeight: '600',
                  }}
                >
                  {item.transition}
                </Text>
              )}

              {item.pestTransition && (
                <Text
                  style={{
                    color: item.pestTransitionColor || textColor,
                    marginBottom: 6,
                    fontWeight: '600',
                  }}
                >
                  {item.pestTransition}
                </Text>
              )}

              {item.daysRemaining !== undefined && item.daysRemaining > 0 && (
                <Text style={{ color: textColor, marginBottom: 6 }}>
                  ⏳ {item.daysRemaining} day(s) to maturity (🗓️ {item.estimatedMaturityDate})
                </Text>
              )}

              {item.daysRemaining === 0 && item.growth.growth_stage === 'Mature' && (
                <Text style={{ color: '#22c55e', marginBottom: 6, fontWeight: '600' }}>
                  ✅ Fully matured
                </Text>
              )}

              <TouchableWithoutFeedback
                onPress={() =>
                  setVisibleImages((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
              >
                <Text style={[styles.toggleText, { color: textColor }]}>
                  {visibleImages[item.id] ? '🔽 Hide Image' : '▶️ Show Image'}
                </Text>
              </TouchableWithoutFeedback>

              {visibleImages[item.id] && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setModalData(item);
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri: item.detected_image_url }} style={styles.image} />
                </TouchableWithoutFeedback>
              )}
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <Image
                source={{ uri: modalData?.detected_image_url }}
                style={styles.modalImage}
              />
            </TouchableWithoutFeedback>

            {modalData && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.modalText}>📅 {modalData.id}</Text>
                <Text style={styles.modalText}>🌱 Plant Count: {modalData.growth.plant_count}</Text>
                <Text style={styles.modalText}>🧬 Stage: {modalData.growth.growth_stage}</Text>
                <Text style={styles.modalText}>🐛 Pest: {modalData.growth.pest_detected}</Text>
                <Text style={styles.modalText}>📏 Height: {modalData.growth.height_cm} cm</Text>
                <Text style={styles.modalText}>🍃 Leaf Area: {modalData.growth.leaf_area_cm2} cm²</Text>
                <Text style={styles.modalText}>🌿 Leaf Count: {modalData.growth.leaf_count}</Text>
                <Text style={styles.modalText}>🌡 Air Temp: {modalData.environment.air_temperature_c}°C</Text>
                <Text style={styles.modalText}>💧 Humidity: {modalData.environment.humidity_percent}%</Text>
                <Text style={styles.modalText}>💡 Light: {modalData.environment.light_intensity_lux} lux</Text>
                <Text style={styles.modalText}>🌊 Water Temp: {modalData.environment.water_temperature_c}°C</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    marginBottom: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 10,
    marginBottom: 12,
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
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  datePicker: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
  },
});
