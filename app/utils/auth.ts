import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {LoginResponse, RegisterResponse} from "@/app/types/auth";
import {UpdateUserDetailsResponse} from "@/app/types/user";

export const API_BASE_URL:string|undefined = process.env.EXPO_PUBLIC_API_BASE_URL;
export const API_PORT:string|undefined = process.env.EXPO_PUBLIC_API_PORT;


export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_BASE_URL}${API_PORT}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data:LoginResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const token = data.token;
        const user = data.user;

        if (!token || !user) {
            throw new Error('Invalid login response');
        }

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

    } catch (error) {
        throw error;
    }
}
export async function register(userData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}${API_PORT}/api/v1/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data:RegisterResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const token = data.token;
        const user = data.user;

        if (!token || !user) {
            throw new Error('Invalid register response');
        }

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));


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
        const response = await fetch(`${API_BASE_URL}${API_PORT}/api/v1/user/update-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        const  data:UpdateUserDetailsResponse  = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        await AsyncStorage.setItem('user', JSON.stringify(data.user));

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