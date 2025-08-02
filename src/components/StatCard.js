import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../utils/theme';

export default function StatCard({ title, value, icon }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 16,
    ...theme.shadow,
    width: '46%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  title: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
  value: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
  },
});
