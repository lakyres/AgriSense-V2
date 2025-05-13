import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { storage, auth } from "@/lib/firebase";

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

export const getDetections = async (): Promise<Detection[]> => {
  const detections: Detection[] = [];

  console.log("👤 Logged in user:", auth.currentUser?.email || "No user signed in");

  try {
    console.log("📦 Fetching detection_index.json...");

    const indexRef = storageRef(storage, "detections/detection_index.json");
    const indexUrl = await getDownloadURL(indexRef);
    const indexRes = await fetch(indexUrl);
    const folderList: string[] = await indexRes.json();

    console.log("🗂️ Folder list from index:", folderList);

    for (const id of folderList) {
      try {
        console.log(`🔍 Fetching files for: ${id}`);

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

        detections.push({
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
            growth_stage: firstPlant?.growth_stage || "N/A",
            pest_detected: firstPlant?.pest_detected || "None",
            height_cm: firstPlant?.height_cm || 0,
            leaf_area_cm2: firstPlant?.largest_leaf_area || 0,
            leaf_count: firstPlant?.leaf_count || 0,
          },
        });

        console.log(`✅ Processed detection: ${id}`);
      } catch (err) {
        console.warn(`⚠️ Skipping ${id} due to error:`, err);
      }
    }
  } catch (error) {
    console.error("❌ Failed to load detection_index.json:", error);
  }

  console.log("📊 Final detections:", detections);
  return detections;
};
