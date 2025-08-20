import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../../utils/theme';
import { campaignAPI } from '../../utils/api/campaignAPI';
import CampaignQuotaCard from '../../components/Campaign/CampaignQuotaCard';
import CampaignStatsCard from '../../components/Campaign/CampaignStatsCard';
import CampaignsList from '../../components/Campaign/CampaignsList';

export default function CampaignScreen({ navigation }) {
  const [quotaData, setQuotaData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load quota, campaigns, and stats in parallel
      // Note: getQuota() now uses API domain from .env file
      const [quotaResponse, campaignsResponse, statsResponse] = await Promise.all([
        campaignAPI.getQuota(),
        campaignAPI.getCampaigns(1, 10),
        campaignAPI.getStats(),
      ]);

      console.log('Quota Response:', quotaResponse);
      console.log('Campaigns Response:', campaignsResponse);
      // console.log('🎯 First Campaign Target Type:', campaignsResponse.campaigns?.[0]?.targetType);
      console.log('🎯 All Campaign Fields:', campaignsResponse.campaigns?.[0] ? Object.keys(campaignsResponse.campaigns[0]) : 'No campaigns');
      console.log('Stats Response:', statsResponse);

      // Process quota data with fallbacks - handle nested API structure
      const quota = quotaResponse.quota || {};
      
      // Check if it's nested structure (production API) or flat structure (local API)
      const isNestedStructure = quota.daily && quota.balance;
      
      let processedQuota;
      
      if (isNestedStructure) {
        // Production API format (nested structure)
        const dailyCampaignsUsed = 3 - (quota.daily?.freeCampaignsRemaining || 0); // Calculate used: 3 - remaining
        
        processedQuota = {
          dailyCampaignsUsed: dailyCampaignsUsed,
          dailyCampaignsRemaining: quota.daily?.freeCampaignsRemaining || 3,
          dailyCampaignsLimit: quota.daily?.freeCampaigns || 3,
          nextCampaignCost: quota.daily?.nextCampaignCost || 1,
          availableBalance: quota.balance?.availableBalance || 0,
          canCreateFreeCampaign: (quota.daily?.freeCampaignsRemaining || 0) > 0,
          canCreatePaidCampaign: true,
        };
        
        console.log('🔍 Production API (Nested):', {
          freeCampaignsRemaining: quota.daily?.freeCampaignsRemaining,
          calculatedUsed: dailyCampaignsUsed,
          nextCampaignCost: quota.daily?.nextCampaignCost
        });
      } else {
        // Local API format (flat structure)
        processedQuota = {
          dailyCampaignsUsed: quota.dailyFreeCampaignsUsed || 0,
          dailyCampaignsRemaining: quota.dailyFreeCampaignsRemaining || 3,
          dailyCampaignsLimit: quota.dailyFreeCampaignsLimit || 3,
          nextCampaignCost: quota.nextCampaignCost || 0,
          availableBalance: quota.availableBalance || 0,
          canCreateFreeCampaign: quota.canCreateFreeCampaign !== false,
          canCreatePaidCampaign: quota.canCreatePaidCampaign !== false,
        };
        
        console.log('🔍 Local API (Flat):', processedQuota);
      }

      // Override API values to enforce 3 campaigns limit
      if (quota.dailyCampaignsLimit !== 3) {
        console.log('⚠️ API returned incorrect limit, overriding to 3:', quota.dailyCampaignsLimit);
      }
      
      // Log balance information
      console.log('💰 Balance Info:', {
        apiBalance: quota.availableBalance,
        finalBalance: processedQuota.availableBalance,
        usingFallback: !quota.availableBalance
      });

      // Use API quota data directly - no need to recalculate
      console.log('🔍 Using API quota data:', {
        dailyFreeCampaignsUsed: quota.dailyFreeCampaignsUsed,
        dailyFreeCampaignsRemaining: quota.dailyFreeCampaignsRemaining,
        dailyFreeCampaignsLimit: quota.dailyFreeCampaignsLimit,
        nextCampaignCost: quota.nextCampaignCost,
        canCreateFree: quota.canCreateFreeCampaign,
        canCreatePaid: quota.canCreatePaidCampaign
      });

      console.log('🔍 Processed Quota Data:', processedQuota);
      
      setQuotaData(processedQuota);
      setCampaigns(campaignsResponse.campaigns || []);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Error loading campaign data:', error);
      
      // Show detailed error information
      let errorMessage = 'An error occurred while loading campaign data.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          url: error.config?.url
        });
        
        errorMessage = `API Error: ${error.response.status} - ${error.response.statusText}`;
        
        if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Please check the server configuration.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. You do not have permission to view this data.';
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error Request:', error.request);
        errorMessage = 'No response received from server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error Message:', error.message);
        errorMessage = `Request setup error: ${error.message}`;
      }
      
      // Set fallback data for testing
      setQuotaData({
        dailyCampaignsUsed: 0,
        dailyCampaignsRemaining: 3, // Only 3 free campaigns per day
        dailyCampaignsLimit: 3,     // Limit is 3, not 5
        nextCampaignCost: 0,        // First 3 are free
        availableBalance: 0,        // Don't assume balance, let user check
        canCreateFreeCampaign: true,
        canCreatePaidCampaign: true, // Can create paid campaigns after 3
      });
      
      setCampaigns([]);
      setStats({
        total_campaigns: 0,
        active_campaigns: 0,
        pending_campaigns: 0,
        completed_campaigns: 0,
        total_recipients: 0,
        total_cost: 0
      });
      
      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  // Load data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Navigate to create campaign
  const handleCreateCampaign = () => {
    if (!quotaData) return;

    if (!quotaData.canCreateFreeCampaign && !quotaData.canCreatePaidCampaign) {
      Alert.alert(
        'Not Available',
        'You cannot create a new campaign. Check your balance or wait until tomorrow.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('CreateCampaign', { quotaData });
  };

  // Render header items for FlatList
  const renderHeaderItem = () => (
    <View style={styles.headerContainer}>
      {/* Campaign Quota Card */}
      {quotaData && (
        <CampaignQuotaCard 
          quotaData={quotaData} 
          onCreateCampaign={handleCreateCampaign}
        />
      )}

      {/* Campaign Stats Card */}
      <CampaignStatsCard stats={stats || {}} />
    </View>
  );

  // Helper function to get campaign type
  const getCampaignType = (cost) => {
    if (!cost || cost === 0) {
      return { text: 'Free', color: theme.colors.success, icon: 'gift' };
    } else {
      return { text: 'Paid', color: theme.colors.warning, icon: 'card' };
    }
  };

  // Render campaign item
  const renderCampaignItem = ({ item }) => {
    const campaignType = getCampaignType(item.campaign_cost);
    
    return (
      <TouchableOpacity
        style={styles.campaignItem}
        onPress={() => navigation.navigate('CampaignDetails', { campaignId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.campaignHeader}>
          <View style={styles.campaignTitleContainer}>
            <Text style={styles.campaignTitle}>{item.title}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: getStatusColor(item.status) + '20',
              borderColor: getStatusColor(item.status)
            }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.campaignContent}>{item.content}</Text>
        
        <View style={styles.campaignFooter}>
          <View style={styles.campaignInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>{item.receiver_count || 0} recipients</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name={campaignType.icon} size={14} color={campaignType.color} />
              <Text style={[styles.infoText, { color: campaignType.color }]}>
                {campaignType.text}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function to get status color
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

  // Helper function to get status text
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={theme.header.container}>
        <View style={theme.header.placeholder} />
        <Text style={theme.header.title}>Marketing Campaigns</Text>
        <View style={theme.header.placeholder} />
      </View>

      {/* Campaigns List with Header */}
      <FlatList
        data={campaigns}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeaderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start creating your first marketing campaign to see it here
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={theme.fab}
        onPress={handleCreateCampaign}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding at the bottom for the FAB
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  campaignItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 8,
    marginBottom: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  campaignTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
  },
  statusText: {
    fontSize: theme.fonts.size.sm,
    fontWeight: 'bold',
  },
  campaignContent: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
  },
  campaignDate: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 80, // Add padding at the bottom for the FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  emptySubtitle: {
    marginTop: 10,
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
