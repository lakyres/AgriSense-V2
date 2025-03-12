// components/ui/Card.js
import { View } from "react-native";

export default function Card({ children, style }) {
  return <View style={[{ padding: 10, borderRadius: 10, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1 }, style]}>{children}</View>;
}
