import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { storage, auth } from "@/lib/firebase"; // ⬅️ import auth to check current user

export interface Detection {
  id: string;
  raw_image_url: string;
  detected_image_url: string;
  environment: any;
  growth: any;
}

export const getDetections = async (): Promise<Detection[]> => {
  const detections: Detection[] = [];

  // 🔐 Log the current signed-in user
  console.log("👤 Logged in user:", auth.currentUser?.email || "No user signed in");

  try {
    console.log("📦 Fetching detection_index.json...");

    const indexRef = storageRef(storage, "detections/detection_index.json");
    const indexUrl = await getDownloadURL(indexRef);

    console.log("✅ detection_index.json URL:", indexUrl);

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
          getDownloadURL(growthRef)
        ]);

        console.log(`✅ Files fetched for ${id}`);

        const [envData, growthData] = await Promise.all([
          fetch(envUrl).then((res) => res.json()),
          fetch(growthUrl).then((res) => res.json())
        ]);

        detections.push({
          id,
          raw_image_url: rawUrl,
          detected_image_url: detectedUrl,
          environment: envData,
          growth: growthData
        });

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
