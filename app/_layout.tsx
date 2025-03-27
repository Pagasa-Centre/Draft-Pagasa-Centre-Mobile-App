import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function RootLayout() {
    useFrameworkReady();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            router.replace('/login');
        }
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}