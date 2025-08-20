import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';

export default function CampaignStatsCard({ stats = {} }) {
  // Ensure stats object exists and has default values
  const safeStats = {
    total_campaigns: 0,
    active_campaigns: 0,
    pending_campaigns: 0,
    completed_campaigns: 0,
    total_recipients: 0,
    total_cost: 0,
    ...stats
  };

  const mainStatsData = [
    {
      icon: 'mail',
      label: 'Total Campaigns',
      value: safeStats.total_campaigns,
      color: theme.colors.primary,
    },
    {
      icon: 'checkmark-circle',
      label: 'Active Campaigns',
      value: safeStats.active_campaigns,
      color: theme.colors.success,
    },
    {
      icon: 'time',
      label: 'Pending Campaigns',
      value: safeStats.pending_campaigns,
      color: theme.colors.warning,
    },
    {
      icon: 'checkmark-circle-outline',
      label: 'Completed Campaigns',
      value: safeStats.completed_campaigns,
      color: theme.colors.secondary,
    },
    {
      icon: 'people',
      label: 'Total Recipients',
      value: safeStats.total_recipients,
      color: theme.colors.accent,
    },
    {
      icon: 'cash',
      label: 'Total Cost',
      value: `$${safeStats.total_cost.toFixed(2)}`,
      color: theme.colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Main Statistics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Campaign Overview</Text>
        </View>
        
        <View style={styles.statsGrid}>
          {mainStatsData.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* No Data Message */}
      {safeStats.total_campaigns === 0 && (
        <View style={styles.noDataSection}>
          <Ionicons name="information-circle" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.noDataTitle}>No Campaign Data</Text>
          <Text style={styles.noDataSubtitle}>
            Start creating campaigns to see your statistics here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginVertical: 10,
    ...theme.shadow,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: theme.fonts.size.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  noDataSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  noDataTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 10,
    marginBottom: 8,
  },
  noDataSubtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 18,
  },
});
