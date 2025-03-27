import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { Link, router } from 'expo-router';
import { register } from './utils/auth';
import { registerSchema } from './types/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        birthday: new Date(),
        outreach_id: '',
        phone_number: '',
        cell_leader_id: '',
        is_leader: false,
        is_primary: false,
        is_pastor: false,
        is_ministry_leader: false,
        ministry_id: '',
    });
    const [error, setError] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (_: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleChange('birthday', selectedDate);
        }
    };

    async function handleRegister() {
        try {
            setError('');
            const submitData = {
                ...formData,
                outreach_id: parseInt(formData.outreach_id),
                cell_leader_id: formData.cell_leader_id ? parseInt(formData.cell_leader_id) : null,
                ministry_id: formData.ministry_id ? parseInt(formData.ministry_id) : null,
                birthday: formData.birthday.toISOString().split('T')[0],
            };

            const validatedData = registerSchema.parse(submitData);
            await register(validatedData);
            router.replace('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our community</Text>
                </View>

                <View style={styles.form}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.first_name}
                            onChangeText={(value) => handleChange('first_name', value)}
                            placeholder="Enter your first name"
                            placeholderTextColor="#666666"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.last_name}
                            onChangeText={(value) => handleChange('last_name', value)}
                            placeholder="Enter your last name"
                            placeholderTextColor="#666666"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(value) => handleChange('email', value)}
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
                            value={formData.password}
                            onChangeText={(value) => handleChange('password', value)}
                            placeholder="Create a password"
                            placeholderTextColor="#666666"
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Birthday</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateText}>
                                {formData.birthday.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.birthday}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone_number}
                            onChangeText={(value) => handleChange('phone_number', value)}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#666666"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Outreach ID</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.outreach_id}
                            onChangeText={(value) => handleChange('outreach_id', value)}
                            placeholder="Enter outreach ID"
                            placeholderTextColor="#666666"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Cell Leader ID (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.cell_leader_id}
                            onChangeText={(value) => handleChange('cell_leader_id', value)}
                            placeholder="Enter cell leader ID"
                            placeholderTextColor="#666666"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Roles</Text>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Leader</Text>
                            <Switch
                                value={formData.is_leader}
                                onValueChange={(value) => handleChange('is_leader', value)}
                            />
                        </View>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Primary</Text>
                            <Switch
                                value={formData.is_primary}
                                onValueChange={(value) => handleChange('is_primary', value)}
                            />
                        </View>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Pastor</Text>
                            <Switch
                                value={formData.is_pastor}
                                onValueChange={(value) => handleChange('is_pastor', value)}
                            />
                        </View>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Ministry Leader</Text>
                            <Switch
                                value={formData.is_ministry_leader}
                                onValueChange={(value) => handleChange('is_ministry_leader', value)}
                            />
                        </View>
                    </View>

                    {formData.is_ministry_leader && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Ministry ID</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.ministry_id}
                                onChangeText={(value) => handleChange('ministry_id', value)}
                                placeholder="Enter ministry ID"
                                placeholderTextColor="#666666"
                                keyboardType="numeric"
                            />
                        </View>
                    )}

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Sign In</Text>
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
        paddingBottom: 40,
    },
    header: {
        padding: 20,
        backgroundColor: '#1E1E1E',
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
    dateText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    switchContainer: {
        marginBottom: 20,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    registerButton: {
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
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
    loginLink: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});