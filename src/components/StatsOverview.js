import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StatCard from './StatCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "@env";
import { useIsFocused } from '@react-navigation/native';
import theme from '../utils/theme';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';

export default function StatsOverview() {
  const isFocused = useIsFocused();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const fetchStats = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const finalToken = `Bearer ${storedToken}`;

      const res = await fetch(`${API}/api/seller/dashboard-stats`, {
        headers: { Authorization: finalToken },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchStats();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatCard
        title="Total Sales"
        value={`$${stats.totalEarnings}`}
        icon={<MaterialIcons name="attach-money" size={32} color={theme.colors.primary} />}
      />
      <StatCard
        title="Orders"
        value={stats.totalOrders}
        icon={<Ionicons name="cart-outline" size={32} color={theme.colors.secondary} />}
      />
      <StatCard
        title="Customers"
        value={stats.totalCustomers}
        icon={<FontAwesome5 name="users" size={28} color={theme.colors.accent} />}
      />
      <StatCard
        title="Products"
        value={stats.totalProducts}
        icon={<Feather name="package" size={30} color={theme.colors.textSecondary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
    rowGap: 10,
    margin: 10,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
  },
});
