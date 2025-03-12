import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/lib/global-provider";
import { Stack } from "expo-router";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#4f46e5" size="large" />
      </SafeAreaView>
    );
  }

  // Redirect to sign-in if user is not logged in
  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      {/* Load Bottom Tabs (Dashboard, Explore, Profile) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Full-Screen Navigation for Additional Screens */}
      <Stack.Screen name="maturity" options={{ title: "Maturity Prediction" }} />
      <Stack.Screen name="pest-detection" options={{ title: "Pest Detection" }} />
    </Stack>
  );
}
