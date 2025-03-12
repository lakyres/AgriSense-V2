import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}