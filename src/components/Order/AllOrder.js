import { useState, useCallback } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import OrderItem from "./OrderItem";
import { loderStyles } from "./style";
import { API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from '../../utils/theme';

export default function AllOrder() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("token");

          const response = await fetch(`${API}/api/orders`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("❌ Failed to fetch data");
          }

          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error("⚠️ Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={loderStyles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: theme.fonts.size.lg, color: theme.colors.textSecondary, fontFamily: theme.fonts.bold }}>
            📦 No Orders found
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => item._id ?? index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderItem order={item} />}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        />
      )}
    </View>
  );
}
