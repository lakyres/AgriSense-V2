import { Text, View, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/card"; // Ensure this exists
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        
        {/* Header Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={images.avatar} style={{ width: 48, height: 48, borderRadius: 24 }} />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'Rubik-Regular' }}>Hello!</Text>
              <Text style={{ fontSize: 18, color: 'gray', fontFamily: 'Rubik-Medium' }}>Kyla Marjes</Text>
            </View>
          </View>
          <Image source={icons.bell} style={{ width: 24, height: 24 }} />
        </View>

        {/* Growth Monitoring */}
        <Card style={{ marginTop: 20, padding: 16, backgroundColor: '#d4edda', borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontFamily: 'Rubik-Medium', color: '#333' }}>Latest Growth Image</Text>
          <Image source={images.latestGrowth} style={{ width: '100%', height: 192, marginTop: 12, borderRadius: 8 }} resizeMode="cover" />
        </Card>

        {/* Growth Stats Section */}
        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Card style={styles.card}>
            <Text style={styles.cardText}>Leaf Count</Text>
            <Text style={styles.cardValue}>5</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardText}>Leaf Area</Text>
            <Text style={styles.cardValue}>1200 mm²</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={styles.cardText}>Height</Text>
            <Text style={styles.cardValue}>25 cm</Text>
          </Card>
        </View>

        {/* Maturity Prediction Section */}
        <TouchableOpacity onPress={() => router.push("/maturity")} activeOpacity={0.8}>
          <View style={{ marginTop: 20, padding: 16, backgroundColor: "#fff3cd", borderRadius: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>Maturity Prediction</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#856404", marginTop: 8 }}>Estimated Harvest: 10 days</Text>
          </View>
        </TouchableOpacity>
        {/* Pest Detection Section */}
        <TouchableOpacity onPress={() => router.push("/pest-detection")} activeOpacity={0.8}>
          <View style={{ marginTop: 20, padding: 16, backgroundColor: "#f8d7da", borderRadius: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>Pest Detection</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#721c24", marginTop: 8 }}>No Pest Detected ✅</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    width: '30%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 14,
    color: 'gray',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});