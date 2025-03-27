import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { getUser, updateProfile, logout } from '../utils/auth';
import { UserDetailsResponse } from '../types/auth';
import { LogOut, Save } from 'lucide-react-native';

export default function ProfileScreen() {
    const [user, setUser] = useState<UserDetailsResponse | null>(null);
    const [formData, setFormData] = useState<UserDetailsResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const userData = await getUser();
            if (userData) {
                setUser(userData);
                setFormData(userData);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        }
    }

    const handleChange = (name: keyof UserDetailsResponse, value: any) => {
        setFormData(prev => prev ? { ...prev, [name]: value } : prev);
    };

    async function handleUpdate() {
        try {
            if (!formData) return;
            const updatedUser = await updateProfile(formData);
            setUser(updatedUser);
            setFormData(updatedUser);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    }

    async function handleLogout() {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => logout() },
            ]
        );
    }

    if (!user || !formData) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={24} color="#FF6B6B" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!isEditing ? (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Name</Text>
                                <Text style={styles.value}>{user.first_name} {user.last_name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Email</Text>
                                <Text style={styles.value}>{user.email}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Phone</Text>
                                <Text style={styles.value}>{user.phone_number}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Birthday</Text>
                                <Text style={styles.value}>{user.birthday}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Church Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Outreach ID</Text>
                                <Text style={styles.value}>{user.outreach_id}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Cell Leader ID</Text>
                                <Text style={styles.value}>{user.cell_leader_id || 'N/A'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setIsEditing(true)}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.first_name}
                                onChangeText={(value) => handleChange('first_name', value)}
                                placeholder="Enter first name"
                                placeholderTextColor="#666666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.last_name}
                                onChangeText={(value) => handleChange('last_name', value)}
                                placeholder="Enter last name"
                                placeholderTextColor="#666666"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone_number}
                                onChangeText={(value) => handleChange('phone_number', value)}
                                placeholder="Enter phone number"
                                placeholderTextColor="#666666"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setFormData(user);
                                    setIsEditing(false);
                                }}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleUpdate}>
                                <Save size={20} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        padding: 20,
        backgroundColor: '#1E1E1E',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    infoRow: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    editButton: {
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    form: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#121212',
        borderRadius: 8,
        padding: 15,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333333',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    saveButton: {
        backgroundColor: '#333333',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});