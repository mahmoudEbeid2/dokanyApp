import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';

function CampaignQuotaCard({ quotaData, onCreateCampaign }) {
  const {
    dailyCampaignsUsed,
    dailyCampaignsRemaining,
    dailyCampaignsLimit,
    nextCampaignCost,
    availableBalance,
    canCreateFreeCampaign,
    canCreatePaidCampaign,
  } = quotaData;

  // Debug logging
  console.log('🔍 Quota Data:', {
    dailyCampaignsUsed,
    dailyCampaignsRemaining,
    dailyCampaignsLimit,
    nextCampaignCost,
    availableBalance
  });

  const canCreateCampaign = canCreateFreeCampaign || canCreatePaidCampaign;
  const progressPercentage = (dailyCampaignsUsed / dailyCampaignsLimit) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="megaphone" size={24} color={theme.colors.primary} />
          <Text style={styles.title}>Daily Campaign Quota</Text>
        </View>
        <Text style={styles.subtitle}>
          {dailyCampaignsUsed || 0} of {dailyCampaignsLimit || 0} campaigns used today
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage >= 100 ? theme.colors.warning : theme.colors.success
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {dailyCampaignsRemaining > 0 
            ? `${dailyCampaignsRemaining} free campaigns remaining`
            : 'Free campaigns exhausted'
          }
        </Text>
      </View>

      {/* Campaign Cost Info */}
      <View style={styles.costContainer}>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Next Campaign Cost</Text>
          <Text style={[styles.costValue, { color: nextCampaignCost === 0 ? theme.colors.success : theme.colors.warning }]}>
            {nextCampaignCost === 0 ? 'Free' : `$${nextCampaignCost}`}
          </Text>
        </View>
        
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Available Balance</Text>
          <Text style={[styles.costValue, { color: availableBalance > 0 ? theme.colors.success : theme.colors.error }]}>
            ${availableBalance.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Status Messages */}
      {!canCreateCampaign && (
        <View style={styles.statusContainer}>
          <Ionicons name="information-circle" size={16} color={theme.colors.warning} />
          <Text style={styles.statusText}>
            {availableBalance < nextCampaignCost 
              ? 'Insufficient balance for paid campaign'
              : 'Daily quota exhausted - resets at midnight'
            }
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
    padding: 20,
    marginVertical: 10,
    ...theme.shadow,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  costItem: {
    flex: 1,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  costValue: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  statusText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.warning,
    marginLeft: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default CampaignQuotaCard;
