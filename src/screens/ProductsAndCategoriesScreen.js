import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from '../components/ProductScreen';
import CategoriesScreen from '../components/CategoriesScreen';
import theme from '../utils/theme';

export default function ProductsAndCategoriesScreen() {
  const [activeTab, setActiveTab] = useState('products');
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []); 

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Products & Categories</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('products')}
          style={[styles.tabButton, activeTab === 'products' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeText]}>
            Products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('categories')}
          style={[styles.tabButton, activeTab === 'categories' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'categories' && styles.activeText]}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'products' ? <ProductsScreen /> : <CategoriesScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.border,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
  },
  activeText: {
    color: theme.colors.card,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  backButton: { 
    padding: 4, 
    marginRight: 8, 
    position: 'absolute', 
    left: 8, 
    zIndex: 2, 
    backgroundColor: theme.colors.card, 
    borderRadius: 20, 
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  headerBar: { 
    ...theme.header.container,
  },
  headerTitle: { 
    ...theme.header.title,
  },
});
