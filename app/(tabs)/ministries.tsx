import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Users, Music, Heart, BookOpen } from 'lucide-react-native';

const iconMap: Record<string, React.ElementType> = {
  'Worship Ministry': Music,
  'Children\'s Ministry': Heart,
  'Production Ministry': BookOpen,
  'Default': Users,
};

type Ministry = {
  id: number;
  outreach_id: number;
  name: string;
  description: string;
  day: string;
  start_time?: string | null;
  end_time?: string | null;
  meeting_location: string;
};

export default function MinistriesScreen() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/ministry') // 👈 Replace with your actual IP on device or Railway URL
        .then(res => res.json())
        .then(data => {
          setMinistries(data.ministries);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch ministries:', err);
          setLoading(false);
        });
  }, []);

  if (loading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Ministries</Text>
          <Text style={styles.subtitle}>Find your place to serve and grow</Text>
        </View>

        <View style={styles.ministriesList}>
          {ministries.map((ministry) => {
            const Icon = iconMap[ministry.name] || iconMap.Default;

            return (
                <TouchableOpacity key={ministry.id} style={styles.ministryCard}>
                  <View style={styles.ministryHeader}>
                    <Icon size={24} color="#FFFFFF" />
                    <Text style={styles.ministryName}>{ministry.name}</Text>
                  </View>
                  <Text style={styles.ministryDescription}>{ministry.description}</Text>
                  {ministry.start_time && (
                      <Text style={{ color: '#aaa', marginBottom: 10 }}>
                        Meets on {ministry.day} at {ministry.start_time}
                      </Text>
                  )}
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
            );
          })}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  ministriesList: {
    padding: 20,
  },
  ministryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  ministryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ministryName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#FFFFFF',
  },
  ministryDescription: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 15,
  },
  requirements: {
    marginBottom: 15,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  requirementItem: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 10,
    marginBottom: 3,
  },
  applyButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});