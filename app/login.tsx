import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { login } from './utils/auth';
import { loginSchema } from './types/auth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin() {
        try {
            setError('');
            const validatedData = loginSchema.parse({ email, password });
            await login(validatedData.email, validatedData.password);
            router.replace('/(tabs)');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?w=800' }}
                        style={styles.backgroundImage}
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#666666"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#666666"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.registerLink}>Register</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        height: 300,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#CCCCCC',
    },
    form: {
        padding: 20,
    },
    errorText: {
        color: '#FF6B6B',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333333',
    },
    loginButton: {
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#888888',
        fontSize: 16,
    },
    registerLink: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});