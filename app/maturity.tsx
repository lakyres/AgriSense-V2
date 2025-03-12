import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";

export default function MaturityScreen() {
  const [maturityData, setMaturityData] = useState([20, 40, 60, 80, 100]); // Sample data
  const [harvestDays, setHarvestDays] = useState(10);

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%", paddingHorizontal: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 20, color: "#333" }}>🌱 Maturity Prediction</Text>
        
        {/* Growth Progress Chart */}
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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 }}>📈 Growth Over Time</Text>
          <LineChart
            data={{
              labels: ["Day 1", "Day 5", "Day 10", "Day 15", "Harvest"],
              datasets: [{ data: maturityData }]
            }}
            width={340}
            height={250}
            yAxisSuffix="%"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green chart color
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 10 },
            }}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* Estimated Harvest */}
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

      </ScrollView>
    </SafeAreaView>
  );
}
