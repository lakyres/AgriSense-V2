import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images"; // Ensure you have a pest detection image

export default function PestDetectionScreen() {
  const pestDetected = "No Pest Found ✅";
  const isPestDetected = pestDetected !== "No Pest Found ✅"; // Change color based on status

  const pestHistory = [
    { date: "March 1", result: "No Pest", status: "✅" },
    { date: "March 5", result: "🐛 Minor Pest Detected", status: "⚠️" },
    { date: "March 10", result: "No Pest", status: "✅" }
  ];

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%", paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 20, color: "#333" }}>🦟 Pest Detection</Text>

        {/* Pest Status Card */}
        <View style={{
          backgroundColor: isPestDetected ? "#f8d7da" : "#d4edda",
          padding: 15,
          borderRadius: 12,
          marginTop: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          alignItems: "center"
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: "bold",
            color: isPestDetected ? "#721c24" : "#155724",
            textAlign: "center"
          }}>
            {isPestDetected ? "🐛 Pest Detected!" : "✅ No Pest Found"}
          </Text>
        </View>

        {/* Pest Detection History */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 25, color: "#333" }}>📋 Past Pest Checks</Text>
        
        {pestHistory.map((entry, index) => (
          <View key={index} style={{
            backgroundColor: "#f9f9f9",
            padding: 12,
            marginTop: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 16, color: "#333" }}>{entry.date}</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: "bold",
              color: entry.status === "✅" ? "#28a745" : "#ff9800"
            }}>
              {entry.result} {entry.status}
            </Text>
          </View>
        ))}

        {/* Pest Image Example */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 25, color: "#333" }}>🖼 Captured Pest Detection</Text>
        <View style={{
          backgroundColor: "#eee",
          padding: 10,
          borderRadius: 12,
          marginTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        }}>
          <Image source={images.pest} style={{ width: "100%", height: 220, borderRadius: 10 }} resizeMode="cover" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
