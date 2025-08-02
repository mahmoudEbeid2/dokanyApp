import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "@env";
import ProductCard from './ProductCard';
import theme from '../utils/theme';

export default function ProductScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [token, setToken] = useState(null);

  const fetchAllProducts = async (authToken) => {
    try {
      let all = [];
      let currentPage = 1;
      let keepFetching = true;

      while (keepFetching) {
        const res = await axios.get(
          `${API}/products/seller?page=${currentPage}&limit=10`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const newProducts = res.data;

        if (newProducts.length > 0) {
          all = [...all, ...newProducts];
          currentPage++;
        }

        if (newProducts.length < 10) {
          keepFetching = false;
        }
      }

      setAllProducts(all);
      setFilteredProducts(all);
    } catch (err) {
      console.error('Error fetching products:', err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadTokenAndFetch = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        fetchAllProducts(storedToken);
      } else {
        setLoading(false);
        console.error('Token not found in AsyncStorage');
      }
    };

    if (isFocused) {
      setLoading(true); 
      loadTokenAndFetch();
    }
  }, [isFocused]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(1);
  };

  const goToDetails = (productId) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const paginatedData = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateProduct')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={22} color={theme.colors.textSecondary} />
        <TextInput
          placeholder="Search products..."
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : paginatedData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedData}
            keyExtractor={(item, index) => item.id + '_' + index}
            numColumns={2}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={goToDetails} />
            )}
          />

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
              style={page === 1 ? styles.disabled : {}}
            >
              <Ionicons name="chevron-back-circle" size={32} color={theme.colors.primary} />
            </TouchableOpacity>

            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
              style={page === totalPages ? styles.disabled : {}}
            >
              <Ionicons name="chevron-forward-circle" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 8, 
    paddingHorizontal: 15,
    backgroundColor: theme.colors.background 
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    ...theme.shadow,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    backgroundColor: 'transparent',
    marginLeft: 8,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 2,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  disabled: {
    opacity: 0.4,
  },
  pageText: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    marginHorizontal: 18,
    color: theme.colors.text,
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
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
