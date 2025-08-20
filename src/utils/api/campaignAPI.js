import { sellerAPI } from './api';

// Campaign API functions
export const campaignAPI = {
  // Get campaign quota information
  getQuota: async () => {
    try {
      const response = await sellerAPI.get('seller-campaigns/quota');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all campaigns
  getCampaigns: async (page = 1, limit = 10) => {
    try {
      const response = await sellerAPI.get(`seller-campaigns?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get campaign by ID
  getCampaignById: async (campaignId) => {
    try {
      const response = await sellerAPI.get(`seller-campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new campaign
  createCampaign: async (campaignData) => {
    try {
      console.log('🎯 API: Creating campaign with data:', campaignData);
      
      // Ensure targetData is always an object
      const requestData = {
        ...campaignData,
        targetData: campaignData.targetData || {}
      };
      
      console.log('🎯 API: Sending request data:', requestData);
      
      const response = await sellerAPI.post('seller-campaigns', requestData);
      
      console.log('🎯 API: Campaign created successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ API: Error creating campaign:', error);
      console.error('❌ API: Error response:', error.response?.data);
      throw error;
    }
  },

  // Cancel campaign
  cancelCampaign: async (campaignId) => {
    try {
      const response = await sellerAPI.patch(`seller-campaigns/${campaignId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get campaign statistics
  getStats: async () => {
    try {
      const response = await sellerAPI.get('seller-campaigns/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send test email
  sendTestEmail: async (email) => {
    try {
      const response = await sellerAPI.post('seller-campaigns/test-email', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get targeting data (customers, products, categories for targeting)
  getTargetingData: async () => {
    try {
      const response = await sellerAPI.get('seller-campaigns/targeting-data');
      console.log('🎯 Raw targeting data response:', response.data);
      
      // Extract the actual data from the response
      const targetingData = response.data.data || response.data;
      console.log('🎯 Processed targeting data:', targetingData);
      
      return targetingData;
    } catch (error) {
      console.error('❌ API: Error getting targeting data:', error);
      throw error;
    }
  },

  // Note: Additional API functions can be added here when backend endpoints are available
};
