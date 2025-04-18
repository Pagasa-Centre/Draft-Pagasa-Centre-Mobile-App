import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react-native';
import {API_BASE_URL, API_PORT} from "@/app/utils/auth";

type Outreach = {
  id: number;
  name: string;
  image?: string; // Optional for now
  address_line_1: string;
  address_line_2?: string;
  post_code?: string;
  city: string;
  country: string;
  phone?: string;
  coordinates?: { lat: number; lng: number };
  services?: { day: string; time: string }[]; // optional structure for service times
  thumbnail_url:string;
};

const locations = [
  {
    id: 1,
    name: 'Pagasa Centre Dagenham',
    image: 'https://images.unsplash.com/photo-1601926571842-808f051b61e8?w=800',
    address: '123 Faith Street, Metro City',
    services: [
      { day: 'Sunday', time: '2:00 PM' },
    ],
    phone: '+1 (555) 123-4568',
    coordinates: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 2,
    name: 'Pagasa Centre Southend',
    image: 'https://images.unsplash.com/photo-1585129777188-9934d2f6c997?w=800',
    address: '456 Grace Avenue, South District',
    services: [
      { day: 'Saturday', time: '10:00 AM' },
    ],
    phone: '+1 (555) 987-6543',
    coordinates: { lat: 40.7000, lng: -73.9500 },
  },
];

export default function LocationsScreen() {
  const openMaps = (lat: number, lng: number, address: string) => {
    let url = '';
    if (lat && lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    Linking.openURL(url);
  };

  const callOutreach = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };
  const [outreaches, setOutreaches] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutreaches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_PORT}/api/v1/outreach/`);
      setOutreaches(response.data.outreaches); // adjust based on actual response structure
    } catch (err) {
      console.error('Failed to fetch outreach locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutreaches();
  }, []);


  if (loading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
  }

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Outreaches</Text>
          <Text style={styles.subtitle}>Join us at a campus near you</Text>
        </View>

        {[...outreaches].sort((a, b) => {
          if (a.name === 'Pagasa Centre Dagenham') return -1;
          if (b.name === 'Pagasa Centre Dagenham') return 1;
          return 0;
        }).map((outreach) => (
            <View key={outreach.id} style={styles.locationCard}>
              <Image source={{ uri: outreach.thumbnail_url }} style={styles.locationImage} />

              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{outreach.name}</Text>

                <View style={styles.infoRow}>
                  <MapPin size={20} color="#FFFFFF" />
                  <Text style={styles.infoText}>
                    {outreach.address_line_1}
                    {outreach.address_line_2 ? `, ${outreach.address_line_2}` : ''}
                  </Text>
                </View>

                <View style={styles.servicesContainer}>
                  <Clock size={20} color="#FFFFFF" />
                  <View style={styles.services}>
                    {locations[0].services.map((service, index) => (
                        <Text key={index} style={styles.serviceText}>
                          {service.day}: {service.time}
                        </Text>
                    ))}
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.infoText}>
                    {locations[0].phone}
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                      style={styles.button}
                      onPress={() => callOutreach(locations[0].phone)}>
                    <Phone size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={[styles.button, styles.directionsButton]}
                      onPress={() =>
                          openMaps(
                              outreach.coordinates?.lat || 0,
                              outreach.coordinates?.lng || 0,
                              `${outreach.address_line_1}${outreach.address_line_2 ? `, ${outreach.address_line_2}` : ''}, ${outreach.city}, ${outreach.country}`
                          )
                      }
                  >
                    <Navigation size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        ))}
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
  locationCard: {
    margin: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  locationImage: {
    width: '100%',
    height: 200,
  },
  locationInfo: {
    padding: 20,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  servicesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  services: {
    flex: 1,
  },
  serviceText: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#888888',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  directionsButton: {
    backgroundColor: '#2A2A2A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});