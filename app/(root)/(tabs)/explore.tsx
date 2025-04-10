import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { useThemeContext } from '@/lib/ThemeProvider';

export default function Explore() {
  const { isDarkMode } = useThemeContext(); // ✅ Move here!

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.title, isDarkMode && styles.textLight]}>Scan New Growth</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.textMuted]}>
        Capture an image to analyze Pechay growth and detect pests.
      </Text>

      <Image
        source={icons.wifi}
        style={[
          styles.image,
          { tintColor: isDarkMode ? '#86efac' : '#16A34A' }, // dynamic tint color
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
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 120,
    height: 120,
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
