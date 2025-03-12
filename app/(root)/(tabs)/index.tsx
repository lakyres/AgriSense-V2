import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontFamily: "Rubik-Bold", fontSize: 24, marginBottom: 10 }}>
  Welcome to AgriSense
</Text>

    </View>
  );
}
