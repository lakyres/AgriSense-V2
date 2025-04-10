import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ImageBackground, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { auth } from '@/lib/firebase';
import images from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.replace('/sign-in');
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={images.onboarding}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.overlay}>
              <Text style={styles.title}>Create Your Account</Text>

              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/sign-in')}>
                <Text style={styles.link}>Already have an account? Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    padding: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Bold',
    color: '#15803D',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#065F46',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#15803D',
    fontFamily: 'Rubik-Regular',
  },
});

export default SignUp;
