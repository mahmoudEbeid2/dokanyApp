import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
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
      
      const res = await fetch(`${API}/products/seller/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const allProducts = Array.isArray(data) ? data : data.products || [];

      const dropdownItems = allProducts
        .filter((product) => product?.id && product?.title)
        .map((product) => {
          const shortTitle = product.title.length > 25 
            ? product.title.substring(0, 25) + '...' 
            : product.title;
          
          return {
            label: shortTitle,
            value: product.id,
            key: product.id,
            icon: () => (
              <Image 
                source={{ uri: product.images?.[0]?.image || 'https://ui-avatars.com/api/?name=Product&background=6c63ff&color=fff&size=200&rounded=true&bold=true' }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            ),
          };
        });

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
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholderStyle={styles.placeholder}
          searchContainerStyle={styles.searchContainer}
          searchTextInputStyle={styles.searchInput}
          listItemContainerStyle={styles.listItemContainer}
          listItemLabelStyle={styles.listItemLabel}
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
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    minHeight: 52,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dropdownContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
  },
  dropdownText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginBottom: 6,
  },
  searchInput: {
    color: theme.colors.text,
    fontSize: 14,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 8,
    backgroundColor: theme.colors.card,
  },
  listItemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
});

export default ProductDropdown;
