import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

export default function BottomNav({ navigation }) {
  return (
    <View style={styles.container}>
      <NavItem icon="home" label="Home" onPress={() => navigation.navigate('Home')} />
      <NavItem icon="list" label="Orders" onPress={() => navigation.navigate('Orders')} />
      <NavItem icon="cube" label="Products" onPress={() => navigation.navigate('Products')} />
      <NavItem icon="people" label="Customers" onPress={() => navigation.navigate('Customers')} />
      <NavItem icon="pricetags-outline" label="Coupons" onPress={() => navigation.navigate('Coupons')} />
    </View>
  );
}

function NavItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    ...theme.shadow,
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  label: {
    fontSize: theme.fonts.size.xs,
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
  },
});
