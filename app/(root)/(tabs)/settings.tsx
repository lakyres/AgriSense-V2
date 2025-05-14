import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { useThemeContext } from '@/lib/ThemeProvider';

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const colorScheme = useColorScheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/sign-in');
  };

  

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.header, isDarkMode && styles.textDark]}>Settings</Text>

      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <Text style={[styles.label, isDarkMode && styles.textDark]}>Logged in as:</Text>
        <Text style={[styles.value, isDarkMode && styles.textDark]}>{auth.currentUser?.email}</Text>
      </View>

      <View style={[styles.card, isDarkMode && styles.cardDark]}>
  <Text style={[styles.label, isDarkMode && styles.textDark]}>Dark Mode</Text>
  <Switch
    value={isDarkMode}
    onValueChange={toggleTheme}
    trackColor={{ false: '#d1d5db', true: '#065F46' }}
    thumbColor={isDarkMode ? '#10B981' : '#f4f4f5'}
  />
</View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  containerDark: {
    backgroundColor: '#1f2937',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#15803D',
  },
  card: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardDark: {
    backgroundColor: '#374151',
  },
  label: {
    fontSize: 14,
    color: '#047857',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
  textDark: {
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
