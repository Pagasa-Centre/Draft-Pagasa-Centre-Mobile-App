import { Stack } from 'expo-router';

export default function MediaLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTintColor: '#ffffff', // White text/icons
                headerTitle: '', // Empty title
            }}
        />
    );
}