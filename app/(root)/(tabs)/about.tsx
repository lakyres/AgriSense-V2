import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '@/lib/ThemeProvider';

export default function AboutScreen() {
  const { isDarkMode } = useThemeContext();

  const backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  const textColor = isDarkMode ? '#D1D5DB' : '#065F46';
  const headerColor = isDarkMode ? '#86efac' : '#15803D';
  const labelColor = isDarkMode ? '#D1D5DB' : '#064E3B';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <Text style={[styles.header, { color: headerColor }]}>
            📱 About Pechay AgriSense
          </Text>

          <Text style={[styles.paragraph, { color: textColor }]}>
            A mobile application that utilizes machine learning and computer vision to predict pechay growth stages (seedling, vegetative, mature) and detect pest infestations. Designed for real-time monitoring in hydroponic greenhouses, integrated with Raspberry Pi for automated insights.
          </Text>

          <Text style={[styles.sectionHeader, { color: headerColor }]}>
            👥 Developers
          </Text>
          <Text style={[styles.label, { color: labelColor }]}>• Patrick Joseph R. Magbuhos</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Adrian A. Arcega</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Kyla N. Marjes</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Ma. Angelica P. Sevilla</Text>

          <Text style={[styles.sectionHeader, { color: headerColor }]}>
            📩 Contact Emails
          </Text>
          <Text style={[styles.label, { color: labelColor }]}>patrickjosephmagbuhos@gmail.com</Text>
          <Text style={[styles.label, { color: labelColor }]}>adrianarcega18@gmail.com</Text>
          <Text style={[styles.label, { color: labelColor }]}>kylamarjes11@gmail.com</Text>
          <Text style={[styles.label, { color: labelColor }]}>angelmaesevilla@gmail.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 12,
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
});
