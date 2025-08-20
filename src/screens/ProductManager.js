import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductsScreen from '../components/ProductScreen';
import CategoriesScreen from '../components/CategoriesScreen';
import CouponsScreen from '../screens/Coupon/CouponScreen';
import TabNavigation from '../components/TabNavigation';
import theme from '../utils/theme';

export default function ProductManager() {
  const [activeTab, setActiveTab] = useState('products');
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const navigation = useNavigation();

  const tabs = [
    { key: 'products', label: 'Products' },
    { key: 'categories', label: 'Categories' },
    { key: 'coupons', label: 'Coupons' },
  ];

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []); 

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Product Manager</Text>
      </View>

      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      <View style={styles.content}>
        {activeTab === 'products' ? <ProductsScreen /> : 
         activeTab === 'categories' ? <CategoriesScreen /> : 
         <CouponsScreen />}
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
  headerBar: {
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { 
    ...theme.header.title,
  },
  content: {
    flex: 1,
  },
});
