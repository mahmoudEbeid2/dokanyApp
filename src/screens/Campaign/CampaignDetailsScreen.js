import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../utils/theme';
import { campaignAPI } from '../../utils/api/campaignAPI';

export default function CampaignDetailsScreen({ navigation, route }) {
  const { campaignId } = route.params;
  const [campaign, setCampaign] = useState(null);
  const [emailStats, setEmailStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaignDetails();
  }, []);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      
      // Load campaign details only
      const campaignResponse = await campaignAPI.getCampaignById(campaignId);
      
      // Debug: Check campaign data structure
      console.log('📊 Campaign Response:', campaignResponse);
      console.log('📊 Campaign Object:', campaignResponse.campaign);
      console.log('🎯 All Campaign Fields:', Object.keys(campaignResponse.campaign || {}));
      
      setCampaign(campaignResponse.campaign);
      
      // Mock email stats for now
      const mockEmailStats = {
        total_recipients: campaignResponse.campaign?.receiver_count || 0,
        emails_sent: campaignResponse.campaign?.receiver_count || 0,
        emails_failed: 0,
        delivery_rate: '100%',
        emails_bounced: 0,
        emails_spam: 0
      };
      setEmailStats(mockEmailStats);
      
      console.log('📧 Email stats set:', mockEmailStats);
      
    } catch (error) {
      console.error('Error loading campaign details:', error);
      Alert.alert(
        'Error',
        'An error occurred while loading campaign details',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCampaign = () => {
    Alert.alert(
      'Cancel Campaign',
      'Are you sure you want to cancel this campaign? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: cancelCampaign },
      ]
    );
  };

  const cancelCampaign = async () => {
    try {
      await campaignAPI.cancelCampaign(campaignId);
      Alert.alert(
        'Cancelled',
        'Campaign cancelled successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error cancelling campaign:', error);
      Alert.alert('Error', 'An error occurred while cancelling the campaign');
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEmailStatistics = () => {
    if (!emailStats) return null;

    return (
      <View style={styles.emailStatsSection}>
        <View style={styles.emailStatsHeader}>
          <Ionicons name="mail-open" size={24} color={theme.colors.primary} />
          <Text style={styles.emailStatsTitle}>Email Statistics</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Recipients</Text>
            <Text style={styles.statValue}>{emailStats.total_recipients || 0}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.success}15` }]}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.statLabel}>Emails Sent</Text>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {emailStats.emails_sent || 0}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.error}15` }]}>
              <Ionicons name="close-circle" size={20} color={theme.colors.error} />
            </View>
            <Text style={styles.statLabel}>Emails Failed</Text>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {emailStats.emails_failed || 0}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${theme.colors.warning}15` }]}>
              <Ionicons name="trending-up" size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.statLabel}>Delivery Rate</Text>
            <Text style={styles.statValue}>{emailStats.delivery_rate || '0%'}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Campaign not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={theme.header.container}>
        <TouchableOpacity
          style={theme.header.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={theme.header.title}>Campaign Details</Text>
        <View style={theme.header.placeholder} />
      </View>

                           <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Campaign Status - First Section */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(campaign.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
                {getStatusText(campaign.status)}
              </Text>
            </View>
            <Text style={styles.dateText}>
              Created: {formatDate(campaign.createdAt)}
            </Text>
          </View>

          {/* Email Statistics */}
          {renderEmailStatistics()}

          {/* Campaign Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Campaign Title</Text>
            <Text style={styles.campaignTitle}>{campaign.title}</Text>
          </View>

         {/* Campaign Content */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Campaign Content</Text>
           <Text style={styles.campaignContent}>{campaign.content}</Text>
         </View>

         {/* Action Buttons */}
         {campaign.status === 'ACTIVE' && (
           <View style={styles.actionsContainer}>
             <TouchableOpacity
               style={styles.cancelButton}
               onPress={handleCancelCampaign}
             >
               <Ionicons name="stop-circle" size={20} color="white" />
               <Text style={styles.cancelButtonText}>Cancel Campaign</Text>
             </TouchableOpacity>
           </View>
         )}
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    marginTop: 16,
    fontSize: theme.fonts.size.lg,
    color: theme.colors.error,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
  },
  dateText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 16,
    ...theme.shadow,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  campaignTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 24,
  },
  campaignContent: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  actionsContainer: {
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: theme.radius.sm,
  },
  cancelButtonText: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emailStatsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 16,
    ...theme.shadow,
  },
  emailStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emailStatsTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
});




