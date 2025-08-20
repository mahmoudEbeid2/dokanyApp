import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';

function CampaignItem({ campaign, onPress }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return theme.colors.success;
      case 'PENDING':
        return theme.colors.warning;
      case 'COMPLETED':
        return theme.colors.primary;
      case 'FAILED':
        return theme.colors.error;
      case 'CANCELLED':
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      case 'FAILED':
        return 'Failed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCampaignType = (cost) => {
    if (!cost || cost === 0) {
      return { text: 'Free', color: theme.colors.success, icon: 'gift' };
    } else {
      return { text: 'Paid', color: theme.colors.warning, icon: 'card' };
    }
  };

  const campaignType = getCampaignType(campaign.campaign_cost);

  return (
    <TouchableOpacity style={styles.campaignItem} onPress={() => onPress(campaign)}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleContainer}>
          <Text style={styles.campaignTitle} numberOfLines={1}>
            {campaign.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${campaignType.color}15` }]}>
            <Text style={[styles.statusText, { color: campaignType.color }]}>
              {campaignType.text}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>

      <Text style={styles.campaignContent} numberOfLines={2}>
        {campaign.content}
      </Text>

      {/* Target Type Badge */}
      {campaign.targetType && (
        <View style={styles.targetTypeContainer}>
          <Ionicons name="target" size={14} color={theme.colors.accent} />
          <Text style={styles.targetTypeText}>
            {campaign.targetType.replace('_', ' ')}
          </Text>
        </View>
      )}

      <View style={styles.campaignFooter}>
        <View style={styles.campaignInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>
              {campaign.receiver_count || 0} recipients
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>
              {formatDate(campaign.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CampaignsList({ campaigns, onCampaignPress, onLoadMore }) {
  const renderItem = ({ item }) => (
    <CampaignItem campaign={item} onPress={onCampaignPress} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="megaphone-outline" size={64} color={theme.colors.border} />
      <Text style={styles.emptyTitle}>No Campaigns</Text>
      <Text style={styles.emptySubtitle}>
        Start by creating your first campaign to reach your customers
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="list" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Recent Campaigns</Text>
      </View>

      <FlatList
        data={campaigns}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        style={styles.list}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  list: {
    maxHeight: 400, // Limit height to prevent excessive scrolling
  },
  campaignItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  campaignTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  campaignTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.fonts.size.xs,
    fontWeight: '500',
  },
  campaignContent: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginBottom: 14,
    lineHeight: 20,
  },
  targetTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: `${theme.colors.accent}15`,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  targetTypeText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.accent,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  infoText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  campaignDate: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 16,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
