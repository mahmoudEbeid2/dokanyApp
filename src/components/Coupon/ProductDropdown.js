import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from '../../utils/theme';

const ProductDropdown = ({ id, value, onChange }) => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let page = 1;
      let allProducts = [];
      let hasMore = true;

      while (hasMore) {
        const res = await fetch(`${API}/products/seller?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const pageProducts = Array.isArray(data) ? data : data.products;

        if (!pageProducts || pageProducts.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...pageProducts];
          page += 1;
        }
      }

      const dropdownItems = allProducts
        .filter((product) => product?.id && product?.title)
        .map((product) => ({
          label: product.title,
          value: product.id,
          key: product.id,
        }));

      setProducts(dropdownItems);

      if (id) {
        const found = dropdownItems.find((item) => item.value === id);
        if (found) {
          onChange(id);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <View style={[styles.wrapper, open && { zIndex: 3000 }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#6c63ff" />
      ) : (
        <DropDownPicker
          open={open}
          value={value}
          items={products}
          setOpen={setOpen}
          setValue={(callback) => onChange(callback(value))}
          setItems={setProducts}
          placeholder="Select Product"
          searchable
          listMode="MODAL"
          searchPlaceholder="Search Here"
          style={styles.dropdownModern}
          dropDownContainerStyle={styles.dropdownContainerModern}
          textStyle={styles.dropdownTextModern}
          placeholderStyle={styles.placeholderModern}
          ArrowDownIconComponent={({ style }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: theme.colors.primary, marginLeft: 6 }} />
            </View>
          )}
          searchContainerStyle={styles.searchContainerModern}
          searchTextInputStyle={styles.searchInputModern}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    zIndex: 1000,
    elevation: 10,
  },
  dropdown: {
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
  },
  dropdownContainer: {
    borderColor: theme.colors.primary,
  },
  dropdownModern: { backgroundColor: theme.colors.card, borderColor: 'transparent', borderRadius: 22, minHeight: 52, elevation: 8, ...theme.strongShadow, marginBottom: 16, paddingHorizontal: 16 },
  dropdownContainerModern: { borderColor: 'transparent', borderRadius: 22, backgroundColor: theme.colors.card, ...theme.strongShadow },
  dropdownTextModern: { color: theme.colors.text, fontSize: theme.fonts.size.md, fontWeight: 'bold', letterSpacing: 0.2 },
  placeholderModern: { color: theme.colors.textSecondary, fontSize: theme.fonts.size.md, fontWeight: '600' },
  searchContainerModern: { borderBottomColor: theme.colors.primary, borderBottomWidth: 1, backgroundColor: theme.colors.card, borderRadius: theme.radius.md, marginBottom: 6 },
  searchInputModern: { color: theme.colors.text, fontSize: theme.fonts.size.md, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: theme.radius.md, padding: 8, backgroundColor: theme.colors.card },
});

export default ProductDropdown;
