import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { Play, Bookmark, Share2 } from 'lucide-react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';



type MediaItem = {
  id: number;
  title: string;
  description: string;
  youtube_video_id: string;
  category: string;
  published_at: string;
  thumbnail_url: string;
};
const sermons = [
  {
    id: 1,
    title: 'Finding Peace in Troubled Times',
    pastor: 'Pastor John Smith',
    date: 'March 24, 2024',
    duration: '45:30',
    thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800',
    category: 'Peace Series',
  },
  {
    id: 2,
    title: 'The Power of Prayer',
    pastor: 'Pastor Sarah Johnson',
    date: 'March 17, 2024',
    duration: '38:15',
    thumbnail: 'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?w=800',
    category: 'Prayer Warriors',
  },
  {
    id: 3,
    title: 'Walking in Faith',
    pastor: 'Pastor Michael Brown',
    date: 'March 10, 2024',
    duration: '42:00',
    thumbnail: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
    category: 'Faith Journey',
  },
];

const categories = ['All', 'Sunday Preachings', 'Bible Study', 'Evangelistic Nights'];

export default function MediaScreen() {
  const router = useRouter(); // ✅ Correct spot for useRouter
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const goToDetail = (item: MediaItem) => {
    router.push({
      pathname: '/media/detail',
      params: {
        videoId: item.youtube_video_id,
        title: item.title,
        description: item.description,
        category: item.category,
      },
    });
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get('http://192.168.0.195:8080/api/v1/media'); // Replace <YOUR-IP> if testing on device
        setMedia(response.data.media || []);
      } catch (err) {
        console.error('Failed to fetch media:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = selectedCategory === 'All'
      ? media
      : media.filter(item => item.category === selectedCategory);



  if (loading) {
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
  }

  const featured :MediaItem|undefined = media.find(item => item.category === 'Sunday Preachings');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Media Center</Text>
        <Text style={styles.subtitle}>Watch and listen to our latest messages</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {featured && (
          <View style={styles.featuredContainer}>
            <Text style={styles.sectionTitle}>Featured Series</Text>
            <TouchableOpacity style={styles.featuredCard}>
              <Image
                  source={{ uri: featured.thumbnail_url }}
                  style={styles.featuredImage}
              />
              <View style={styles.featuredOverlay}>
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{featured.title}</Text>
                  <Text style={styles.featuredSubtitle}>Sunday Preachings</Text>
                </View>
                <TouchableOpacity style={styles.playButton} onPress={() => goToDetail(featured)}>
                  <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
      )}

      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Messages</Text>
        {filteredMedia.map((sermon) => (
          <TouchableOpacity key={sermon.id} style={styles.sermonCard}>
            <Image source={{ uri: sermon.thumbnail_url }} style={styles.sermonThumbnail} />
            <View style={styles.sermonInfo}>
              <Text style={styles.sermonTitle}>{sermon.title}</Text>
              <Text style={styles.sermonDetails}>{sermons[0].pastor}</Text>
              <Text style={styles.sermonDetails}>{sermons[0].date} • {sermons[0].duration}</Text>
              <Text style={styles.seriesTag}>{sermon.category}</Text>

              <View style={styles.sermonActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => goToDetail(sermon)} >
                  <Play size={20} color="#FFFFFF" />
                  <Text style={styles.actionText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Bookmark size={20} color="#FFFFFF" />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color="#FFFFFF" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  categoriesContainer: {
    marginVertical: 15,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryButtonActive: {
    backgroundColor: '#333333',
  },
  categoryText: {
    fontSize: 16,
    color: '#888888',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  featuredContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  featuredCard: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentContainer: {
    padding: 20,
  },
  sermonCard: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333',
  },
  sermonThumbnail: {
    width: 120,
    height: 120,
  },
  sermonInfo: {
    flex: 1,
    padding: 15,
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  sermonDetails: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 2,
  },
  seriesTag: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 5,
  },
  sermonActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});