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
  const dividerColor = isDarkMode ? '#4B5563' : '#D1FAE5';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          <Text style={[styles.header, { color: headerColor }]}>
            📱 AgriSense
          </Text>

          <Text style={[styles.paragraph, { color: textColor }]}>
            AgriSense is a smart mobile app designed for hydroponic growers, combining machine learning and computer vision to predict Pechay growth stages (seedling, vegetative, mature) and detect pest infestations. Integrated with Raspberry Pi for real-time monitoring, it provides actionable insights to help you manage your crops efficiently.
          </Text>

          <View style={[styles.divider, { borderBottomColor: dividerColor }]} />

          <Text style={[styles.sectionHeader, { color: headerColor }]}>
            👥 Developers
          </Text>
          <Text style={[styles.label, { color: labelColor }]}>• Patrick Joseph R. Magbuhos</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Kyla N. Marjes</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Adrian A. Arcega</Text>
          <Text style={[styles.label, { color: labelColor }]}>• Ma. Angelica P. Sevilla</Text>

          <View style={[styles.divider, { borderBottomColor: dividerColor }]} />

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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
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
    textAlign: 'justify',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 16,
  },
});
