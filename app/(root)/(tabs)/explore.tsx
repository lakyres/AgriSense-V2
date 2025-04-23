import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview'; // ✅ Add this
import icons from '@/constants/icons';
import { useThemeContext } from '@/lib/ThemeProvider';

export default function Explore() {
  const { isDarkMode } = useThemeContext();

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.textLight]}>Scan New Growth</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>
        Capture an image to analyze Pechay growth and detect pests.
      </Text>

      {/* ✅ Live Webcam Feed via WebView */}
      <View style={styles.cameraWrapper}>
        <WebView
          source={{ uri: 'http://192.168.1.215:8080/video' }} // 🔁 Replace with your real IP
          style={styles.camera}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      <Image
        source={icons.wifi}
        style={[
          styles.image,
          { tintColor: isDarkMode ? '#86efac' : '#16A34A' },
        ]}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Scan Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  containerDark: {
    backgroundColor: '#1f2937',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  cameraWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textLight: {
    color: 'white',
  },
  textMuted: {
    color: '#D1D5DB',
  },
});
