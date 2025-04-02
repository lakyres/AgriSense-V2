import { collection, getDocs, orderBy, query, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Prediction {
  id: string;
  maturity: string;
  pest: string;
  image_url: string;
  timestamp?: string;
}

export const getPredictions = async (): Promise<Prediction[]> => {
  const q = query(
    collection(db, "predictions"),
    orderBy("timestamp", "desc"),
    limit(5)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    let convertedTimestamp: string | undefined;

    if (data.timestamp instanceof Timestamp) {
      convertedTimestamp = data.timestamp.toDate().toISOString();
    } else if (typeof data.timestamp === "string") {
      convertedTimestamp = data.timestamp;
    }

    return {
      id: doc.id,
      maturity: data.maturity,
      pest: data.pest,
      image_url: data.image_url,
      timestamp: convertedTimestamp,
    };
  });
};
