import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.195:8080';

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();

        const token = data.token;
        const user = data['user-details']; // <-- updated key

        if (!token || !user) {
            throw new Error('Invalid login response');
        }

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return { token, user };
    } catch (error) {
        throw error;
    }
}
export async function register(userData: any) {
    try {
        const response = await fetch(`${API_URL}/api/v1/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        router.replace('/login');
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

export async function updateProfile(userData: any) {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/v1/user/update-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Profile update failed');
        }

        const { data } = await response.json();

        await AsyncStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getUser() {
    try {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}