import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import ProductCard from "./ProductCard";
import theme from "../utils/theme";

export default function ProductScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageSize] = useState(10);
  const [token, setToken] = useState(null);

  // Fetch products with pagination
  const fetchProducts = async (authToken, pageNumber = 1, append = false) => {
    try {
      setLoadingMore(true);
      const res = await axios.get(`${API}/products/seller?page=${pageNumber}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const newProducts = res.data.data || res.data || [];
      
      if (append) {
        setAllProducts(prev => [...prev, ...newProducts]);
        setFilteredProducts(prev => [...prev, ...newProducts]);
      } else {
        setAllProducts(newProducts);
        setFilteredProducts(newProducts);
      }

      // Check if there's more data
      setHasMoreData(newProducts.length === pageSize);
      
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setHasMoreData(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more products when scrolling
  const loadMoreProducts = useCallback(async () => {
    if (!loadingMore && hasMoreData && token) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchProducts(token, nextPage, true);
    }
  }, [loadingMore, hasMoreData, token, page]);

  // Initial load
  useEffect(() => {
    const loadTokenAndFetch = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setPage(1);
        await fetchProducts(storedToken, 1, false);
      } else {
        setLoading(false);
        console.error("Token not found in AsyncStorage");
      }
    };

    if (isFocused) {
      setLoading(true);
      loadTokenAndFetch();
    }
  }, [isFocused]);

  // Search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) =>
        p.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const goToDetails = (productId) => {
    navigation.navigate("ProductDetails", { productId });
  };

  // Safe key extractor
  const keyExtractor = useCallback((item, index) => {
    return item?.id?.toString() || `product_${index}`;
  }, []);

  // Render footer for loading more indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingMoreText}>Loading more products...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name="cube-outline" 
          size={64} 
          color={theme.colors.textSecondary} 
        />
        <Text style={styles.emptyText}>
          {searchText ? "No products found" : "No products yet"}
        </Text>
        {!searchText && (
          <Text style={styles.emptySubText}>
            Tap the + button to add your first product
          </Text>
        )}
      </View>
    );
  };

  // Render item with error handling
  const renderItem = useCallback(({ item, index }) => {
    if (!item || !item.id) {
      return null;
    }
    
    return (
      <ProductCard 
        product={item} 
        onPress={goToDetails} 
      />
    );
  }, [goToDetails]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateProduct")}
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
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          bounces={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.background,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "transparent",
    marginLeft: 8,
    marginRight: 8,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 2,
    flexGrow: 1,
  },
  fab: {
    ...theme.fab,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
  },
  loadingMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingMoreText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.8,
  },
});
