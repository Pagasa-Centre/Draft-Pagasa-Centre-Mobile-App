import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function MediaDetailScreen() {
    const router = useRouter();
    const { videoId, title, description, category } = useLocalSearchParams();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.videoContainer}>
                <WebView
                    style={{ height: 230 }}
                    javaScriptEnabled
                    domStorageEnabled
                    source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
                />
            </View>

            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.category}>{category}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
        flex: 1,
    },
    videoContainer: {
        height: 230,
    },
    backButton: {
        padding: 16,
        backgroundColor: '#1E1E1E',
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    category: {
        fontSize: 16,
        color: '#cccccc',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#888888',
    },
});