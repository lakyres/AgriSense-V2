import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import images from '@/constants/images';
import icons from '@/constants/icons';
import { login } from '@/lib/appwrite';
import { Redirect } from 'expo-router';
import { useGlobalContext } from '@/lib/global-provider';

const SignIn = () => {
    const { refetch, loading, isLogged } = useGlobalContext();

    if(!loading && isLogged) return <Redirect href="/" />;

    const handleLogin = async () => {
        const result = await login();
        if (result) {
            console.log("Logged in successfully");
            refetch({});
        }
        else {
            Alert.alert('Error', "Failed to login");
        };
    };
    
    return (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Image 
                    source={images.onboarding} 
                    style={{ width: "100%", height: "66%" }} 
                    resizeMode="contain"
                />

                <View style={{ padding: 40 }}>
                    <Text style={{ 
                        fontFamily: "Rubik-Regular", 
                        fontSize: 16, 
                        textAlign: "center", 
                        textTransform: "uppercase", 
                        color: "#4B5563" // Equivalent to text-black-200
                    }}>
                        Welcome to AgriSense
                    </Text>

                    <Text style={{ 
                        fontFamily: "Rubik-Bold", 
                        fontSize: 24, 
                        textAlign: "center", 
                        color: "#374151", // Equivalent to text-black-300
                        marginTop: 8 
                    }}>
                        Let's Get You Closer to {"\n"}
                        <Text style={{ color: "#1D4ED8" }}>Your Dream Home</Text> {/* Equivalent to text-primary-300 */}
                    </Text>

                    <Text style={{ 
                        fontFamily: "Rubik-Regular", 
                        fontSize: 18, 
                        textAlign: "center", 
                        color: "#4B5563", // Equivalent to text-black-200
                        marginTop: 48 
                    }}>
                        Login to AgriSense with Google
                    </Text>

                    <TouchableOpacity 
                        onPress={handleLogin} 
                        style={{
                            backgroundColor: "white",
                            shadowColor: "#D1D5DB", // Equivalent to shadow-zinc-300
                            shadowOpacity: 0.5,
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 6,
                            borderRadius: 999, // Equivalent to rounded-full
                            width: "100%",
                            paddingVertical: 16,
                            marginTop: 20
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Image 
                                    resizeMode="contain" 
                                    source={icons.google} 
                                    style={{ width: 20, height: 20 }} 
                            />
                            <Text style={{ 
                                fontFamily: "Rubik-Medium", 
                                fontSize: 18, 
                                color: "#374151", // Equivalent to text-black-300
                                marginLeft: 8 
                            }}>
                                Continue with Google
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignIn;
