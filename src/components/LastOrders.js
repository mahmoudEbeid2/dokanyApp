import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import OrderCard from './OrderCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API } from "@env";
import theme from '../utils/theme';

export default function LastOrders() {
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          const res = await fetch(`${API}/api/orders`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          const data = await res.json();
          setOrders(data.slice(0, 5));
        } catch (err) {
          console.log('Fetch Orders Error:', err);
        }
      };

      fetchOrders();
    }, [])
  );

  const getCustomerName = (order) => {
    if (order.customer) {
      if (order.customer.f_name && order.customer.l_name) {
        return `${order.customer.f_name} ${order.customer.l_name}`;
      } else if (order.customer.name) {
        return order.customer.name;
      } else if (order.customer.first_name && order.customer.last_name) {
        return `${order.customer.first_name} ${order.customer.last_name}`;
      } else if (order.customer.f_name) {
        return order.customer.f_name;
      } else if (order.customer.l_name) {
        return order.customer.l_name;
      }
    }
    return "Customer Account";
  };

  const getCustomerImage = (order) => {
    if (order.customer && order.customer.profile_imge) {
      return order.customer.profile_imge;
    }
    return require('../../assets/avtar.jpg');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Last Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 14 }}>
            <OrderCard
              name={getCustomerName(item)}
              orderNumber={item.id}
              price={item.total_price}
              image={getCustomerImage(item)}
              status={item.status}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 30 }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fonts.size.md, fontFamily: theme.fonts.regular }}>
              🛒 No recent orders
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  heading: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
});
