import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@env';
import theme from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API}/categories/seller`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Category', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API}/categories/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
          } catch (err) {
            console.error('Error deleting category:', err);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <LinearGradient
        colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.55)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.titleOverlay}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      </View>
      <View style={styles.actionsOverlay}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('EditCategory', { category: item })}
        >
          <Ionicons name="create-outline" size={18} color={theme.colors.card} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateCategory')}
      >
        <Ionicons name="add" size={28} color={theme.colors.card} />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories found</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    paddingHorizontal: 15,
    backgroundColor: theme.colors.background 
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: 15,
    ...theme.shadow,
    overflow: 'hidden',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  titleOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.2,
    paddingHorizontal: 2,
  },
  actionsOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    marginHorizontal: 2,
  },
  fab: {
    ...theme.fab,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyText: {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
