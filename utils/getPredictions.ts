import { ref, get } from "firebase/database";
import { realtimeDb } from "@/lib/firebase";

export interface Prediction {
  id: string;
  image_url: string;
  maturity: string;
  pest: string;
  timestamp: string;
  air_temp?: number;
  humidity?: number;
  light_intensity?: number;
  water_temp?: number;
  height?: number;
  leaf_area?: number;
  leaf_count?: number;
  bounding_boxes?: number;
}

export const getPredictions = async (): Promise<Prediction[]> => {
  const detectionsRef = ref(realtimeDb, "detections");
  const snapshot = await get(detectionsRef);
  const data = snapshot.val();

  if (!data) return [];

  const sortedKeys = Object.keys(data).sort().reverse();

  return sortedKeys.map((key) => {
    const entry = data[key];

    const timestampFormatted = key
      .replace(/^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})$/, "$1-$2-$3 $4:$5:$6");

    const base64 = entry?.Detected || "";
    const imageUrl = base64
      ? `data:image/jpeg;base64,${base64}`
      : "";

    return {
      id: key,
      timestamp: timestampFormatted,
      image_url: imageUrl,
      maturity: entry.growth_parameters?.growth_stage || "N/A",
      pest: entry.growth_parameters?.pest_detected || "N/A",
      air_temp: entry.environment_data?.air_temperature_c,
      humidity: entry.environment_data?.humidity_percent,
      light_intensity: entry.environment_data?.light_intensity_lux,
      water_temp: entry.environment_data?.water_temperature_c,
      height: entry.growth_parameters?.height_cm,
      leaf_area: entry.growth_parameters?.leaf_area_cm2,
      leaf_count: entry.growth_parameters?.leaf_count,
      bounding_boxes: entry.growth_parameters?.leaf_data_per_box?.num_bounding_boxes,
    };
  });
};
