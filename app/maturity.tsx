import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import images from "@/constants/images";
import { getPredictions } from "@/utils/getPredictions";

interface Prediction {
  id: string;
  maturity: string;
  pest: string;
  image_url: string;
  timestamp?: string; // Optional in case Firestore doesn't save it properly
}

export default function MaturityScreen() {
  const [maturityData, setMaturityData] = useState([20, 60, 100]);
  const [harvestDays, setHarvestDays] = useState(10);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const growthStages = [
    { date: "Day 1", stage: "Seedling 🌱", image: images.seedling },
    { date: "Day 10", stage: "Vegetative 🌾", image: images.vegetative },
    { date: "Harvest", stage: "Ready to Harvest ✅", image: images.harvest },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPredictions();
      setPredictions(data as Prediction[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%", paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 20, color: "#333" }}>
          🌱 Maturity Prediction
        </Text>

        {/* Chart */}
        <View style={{
          backgroundColor: "#f3f4f6",
          padding: 15,
          borderRadius: 12,
          marginTop: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>
            📈 Growth Over Time
          </Text>
          <LineChart
            data={{
              labels: ["Day 1", "Day 10", "Harvest"],
              datasets: [{ data: maturityData }]
            }}
            width={340}
            height={250}
            yAxisSuffix="%"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 10 },
            }}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* Harvest Estimate */}
        <View style={{
          backgroundColor: "#fff3cd",
          padding: 20,
          borderRadius: 12,
          marginTop: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          alignItems: "center"
        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#856404" }}>⏳ Estimated Harvest</Text>
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "#d97706", marginTop: 5 }}>
            {harvestDays} days
          </Text>
        </View>

        {/* Static Growth Stages */}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 30, color: "#333" }}>📷 Growth Stages</Text>
        {growthStages.map((stage, index) => (
          <View key={`stage-${index}`} style={{
            backgroundColor: "#f9f9f9",
            padding: 15,
            marginTop: 15,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{stage.date}</Text>
            <Text style={{ fontSize: 16, color: "#555", marginBottom: 10 }}>{stage.stage}</Text>
            <Image source={stage.image} style={{ width: "100%", height: 200, borderRadius: 10 }} resizeMode="cover" />
          </View>
        ))}

        {/* Firestore Predictions */}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 30, color: "#333" }}>🔍 Latest Scans</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
          predictions.map((item, index) => (
            <View key={item.id || `pred-${index}`} style={{
              backgroundColor: "#eef2ff",
              padding: 15,
              marginTop: 15,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2
            }}>
              <Image
                source={{ uri: item.image_url }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
                🌱 Maturity: {item.maturity}
              </Text>
              <Text style={{ fontSize: 16, color: "#b91c1c" }}>
                🐛 Pest: {item.pest}
              </Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                {item.timestamp ? new Date(item.timestamp).toLocaleString() : "No timestamp"}
              </Text>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
