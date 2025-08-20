import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import theme from '../../utils/theme';
import { campaignAPI } from '../../utils/api/campaignAPI';

const TARGET_TYPES = [
  { value: 'ALL_CUSTOMERS', label: 'All Customers', icon: 'people' },
  { value: 'PRODUCT_CUSTOMERS', label: 'Product Customers', icon: 'cube' },
  { value: 'CATEGORY_CUSTOMERS', label: 'Category Customers', icon: 'albums' },
  { value: 'LOCATION_CUSTOMERS', label: 'Location Customers', icon: 'location' },
  { value: 'HIGH_VALUE_CUSTOMERS', label: 'High Value Customers', icon: 'diamond' },
  { value: 'RECENT_CUSTOMERS', label: 'Recent Customers', icon: 'time' },
];

export default function CreateCampaignScreen({ navigation, route }) {
  const { quotaData } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [targetingData, setTargetingData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetType: 'ALL_CUSTOMERS',
    targetData: {},
  });

  // Load targeting data (products, categories, customers)
  useEffect(() => {
    loadTargetingData();
  }, []);

  const loadTargetingData = async () => {
    try {
      console.log('📱 Loading targeting data...');
      const data = await campaignAPI.getTargetingData();
      console.log('📱 Loaded targeting data:', data);
      console.log('📱 Products count:', data?.products?.count);
      console.log('📱 Categories count:', data?.categories?.count);  
      console.log('📱 Locations count:', data?.locations?.count);
      setTargetingData(data);
    } catch (error) {
      console.error('📱 Error loading targeting data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTargetDataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      targetData: {
        ...prev.targetData,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a campaign title');
      return false;
    }

    if (formData.title.trim().length < 3) {
      Alert.alert('Error', 'Campaign title must be at least 3 characters');
      return false;
    }

    if (!formData.content.trim()) {
      Alert.alert('Error', 'Please enter campaign content');
      return false;
    }

    if (formData.content.trim().length < 10) {
      Alert.alert('Error', 'Campaign content must be at least 10 characters');
      return false;
    }

    // Validate target-specific data
    switch (formData.targetType) {
      case 'PRODUCT_CUSTOMERS':
        if (!formData.targetData.productIds || formData.targetData.productIds.length === 0) {
          Alert.alert('Error', 'Please select at least one product');
          return false;
        }
        break;
      case 'CATEGORY_CUSTOMERS':
        if (!formData.targetData.categoryIds || formData.targetData.categoryIds.length === 0) {
          Alert.alert('Error', 'Please select at least one category');
          return false;
        }
        break;
      case 'HIGH_VALUE_CUSTOMERS':
        if (!formData.targetData.minOrderValue || formData.targetData.minOrderValue < 1) {
          Alert.alert('Error', 'Please specify minimum order value');
          return false;
        }
        break;
      case 'RECENT_CUSTOMERS':
        if (!formData.targetData.daysAgo || formData.targetData.daysAgo < 1) {
          Alert.alert('Error', 'Please specify number of days');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check if seller has sufficient balance
    const campaignCost = quotaData?.nextCampaignCost || 0;
    const availableBalance = quotaData?.availableBalance || 0;
    
    if (campaignCost > 0) {
      if (campaignCost > availableBalance) {
        Alert.alert(
          'Insufficient Balance',
          `Campaign cost: $${campaignCost}\nAvailable balance: $${availableBalance}\n\nPlease add funds to your account to create this campaign.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      Alert.alert(
        'Confirm Creation',
        `This campaign costs $${campaignCost}.\nAvailable balance: $${availableBalance}\n\nDo you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: createCampaign },
        ]
      );
    } else {
      createCampaign();
    }
  };

  const createCampaign = async () => {
    try {
      setLoading(true);
      
      const campaignData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        targetType: formData.targetType,
        targetData: formData.targetData || {},
      };

      console.log('📱 Campaign data structure:', {
        title: campaignData.title,
        content: campaignData.content,
        targetType: campaignData.targetType,
        targetData: campaignData.targetData,
        hasProductIds: !!campaignData.targetData.productIds?.length,
        hasCategoryIds: !!campaignData.targetData.categoryIds?.length,
        hasLocations: !!campaignData.targetData.locations?.length
      });

      console.log('📱 Sending campaign data:', campaignData);
      console.log('📱 Campaign cost info:', {
        nextCampaignCost: quotaData?.nextCampaignCost,
        availableBalance: quotaData?.availableBalance,
        isFree: quotaData?.nextCampaignCost === 0
      });

      const response = await campaignAPI.createCampaign(campaignData);

      console.log('📱 Campaign created successfully:', response);

      Alert.alert(
        'Campaign Created',
        `Campaign created successfully and sent to ${response.campaign?.receiver_count || 0} recipients.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]
      );
    } catch (error) {
      console.error('❌ Error creating campaign:', error);
      
      let errorMessage = 'An error occurred while creating the campaign';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Show validation errors
          errorMessage = errorData.errors.map(err => err.message).join('\n');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderTargetingOptions = () => {
    switch (formData.targetType) {
      case 'PRODUCT_CUSTOMERS':
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingLabel}>Select Products:</Text>
            <Text style={styles.targetingHint}>
              Campaign will be sent to customers who purchased these products
            </Text>
            {(() => {
              console.log('📱 PRODUCT_CUSTOMERS - targetingData:', targetingData);
              console.log('📱 PRODUCT_CUSTOMERS - products:', targetingData?.products);
              console.log('📱 PRODUCT_CUSTOMERS - items:', targetingData?.products?.items);
              console.log('📱 PRODUCT_CUSTOMERS - length:', targetingData?.products?.items?.length);
              return targetingData?.products?.items && targetingData.products.items.length > 0;
            })() ? (
              <View style={styles.selectionContainer}>
                {targetingData.products.items.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={[
                      styles.selectionItem,
                      formData.targetData.productIds?.includes(product.id) && styles.selectedItem
                    ]}
                    onPress={() => {
                      const currentIds = formData.targetData.productIds || [];
                      const newIds = currentIds.includes(product.id)
                        ? currentIds.filter(id => id !== product.id)
                        : [...currentIds, product.id];
                      handleTargetDataChange('productIds', newIds);
                    }}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={2}>{product.title}</Text>
                      <Text style={styles.itemSubtitle}>
                        ${product.price} • {product.total_purchases} purchases
            </Text>
                    </View>
                    {formData.targetData.productIds?.includes(product.id) && (
                      <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No products with purchases found</Text>
            )}
          </View>
        );
      
      case 'CATEGORY_CUSTOMERS':
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingLabel}>Select Categories:</Text>
            <Text style={styles.targetingHint}>
              Campaign will be sent to customers who purchased from these categories
            </Text>
            {(() => {
              console.log('📱 CATEGORY_CUSTOMERS - targetingData:', targetingData);
              console.log('📱 CATEGORY_CUSTOMERS - categories:', targetingData?.categories);
              console.log('📱 CATEGORY_CUSTOMERS - items:', targetingData?.categories?.items);
              console.log('📱 CATEGORY_CUSTOMERS - length:', targetingData?.categories?.items?.length);
              return targetingData?.categories?.items && targetingData.categories.items.length > 0;
            })() ? (
              <View style={styles.selectionContainer}>
                {targetingData.categories.items.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.selectionItem,
                      formData.targetData.categoryIds?.includes(category.id) && styles.selectedItem
                    ]}
                    onPress={() => {
                      const currentIds = formData.targetData.categoryIds || [];
                      const newIds = currentIds.includes(category.id)
                        ? currentIds.filter(id => id !== category.id)
                        : [...currentIds, category.id];
                      handleTargetDataChange('categoryIds', newIds);
                    }}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle}>{category.name}</Text>
                      <Text style={styles.itemSubtitle}>
                        {category.total_products} products • ${category.total_revenue} revenue
                      </Text>
                    </View>
                    {formData.targetData.categoryIds?.includes(category.id) && (
                      <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No categories with purchases found</Text>
            )}
          </View>
        );

      case 'LOCATION_CUSTOMERS':
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingLabel}>Select Locations:</Text>
            <Text style={styles.targetingHint}>
              Campaign will be sent to customers from these locations
            </Text>
            {(() => {
              console.log('📱 LOCATION_CUSTOMERS - targetingData:', targetingData);
              console.log('📱 LOCATION_CUSTOMERS - locations:', targetingData?.locations);
              console.log('📱 LOCATION_CUSTOMERS - items:', targetingData?.locations?.items);
              console.log('📱 LOCATION_CUSTOMERS - length:', targetingData?.locations?.items?.length);
              return targetingData?.locations?.items && targetingData.locations.items.length > 0;
            })() ? (
              <View style={styles.locationContainer}>
                {targetingData.locations.items.map((country, countryIndex) => (
                  <View key={countryIndex} style={styles.countrySection}>
                    <Text style={styles.countryTitle}>{country.country}</Text>
                    {country.governorates.map((governorate, govIndex) => (
                      <View key={govIndex} style={styles.governorateSection}>
                        <Text style={styles.governorateTitle}>{governorate.name}</Text>
                        <View style={styles.citiesContainer}>
                          {governorate.cities.map((city, cityIndex) => (
                            <TouchableOpacity
                              key={cityIndex}
                              style={[
                                styles.cityItem,
                                formData.targetData.locations?.some(loc => 
                                  loc.country === country.country && 
                                  loc.governorate === governorate.name && 
                                  loc.city === city
                                ) && styles.selectedItem
                              ]}
                              onPress={() => {
                                const currentLocations = formData.targetData.locations || [];
                                const locationKey = `${country.country}-${governorate.name}-${city}`;
                                const exists = currentLocations.some(loc => 
                                  loc.country === country.country && 
                                  loc.governorate === governorate.name && 
                                  loc.city === city
                                );
                                
                                const newLocations = exists
                                  ? currentLocations.filter(loc => 
                                      !(loc.country === country.country && 
                                        loc.governorate === governorate.name && 
                                        loc.city === city)
                                    )
                                  : [...currentLocations, {
                                      country: country.country,
                                      governorate: governorate.name,
                                      city: city
                                    }];
                                
                                handleTargetDataChange('locations', newLocations);
                              }}
                            >
                              <Text style={styles.cityText}>{city}</Text>
                              {formData.targetData.locations?.some(loc => 
                                loc.country === country.country && 
                                loc.governorate === governorate.name && 
                                loc.city === city
                              ) && (
                                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No locations available</Text>
            )}
          </View>
        );

      case 'HIGH_VALUE_CUSTOMERS':
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingLabel}>Minimum Order Value ($):</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Example: 100"
              keyboardType="numeric"
              value={formData.targetData.minOrderValue?.toString() || ''}
              onChangeText={(value) => handleTargetDataChange('minOrderValue', parseFloat(value) || 0)}
            />
            <Text style={styles.targetingHint}>
              Campaign will be sent to customers who ordered above this amount
            </Text>
          </View>
        );

      case 'RECENT_CUSTOMERS':
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingLabel}>Customers who ordered within (days):</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="Example: 30"
              keyboardType="numeric"
              value={formData.targetData.daysAgo?.toString() || ''}
              onChangeText={(value) => handleTargetDataChange('daysAgo', parseInt(value) || 0)}
            />
            <Text style={styles.targetingHint}>
              Campaign will be sent to customers who ordered within this period
            </Text>
          </View>
        );

      default:
        return (
          <View style={styles.targetingContainer}>
            <Text style={styles.targetingHint}>
              Campaign will be sent to all your customers
            </Text>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={theme.header.container}>
        <TouchableOpacity
          style={theme.header.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={theme.header.title}>Create New Campaign</Text>
        <View style={theme.header.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Campaign Cost Info */}
        {quotaData && (
          <View style={styles.costInfo}>
            <Text style={styles.costText}>
              Cost of this campaign: {quotaData.nextCampaignCost === 0 ? 'Free' : `$${quotaData.nextCampaignCost}`}
            </Text>
            <Text style={styles.costText}>
              Available Balance: ${quotaData.availableBalance?.toFixed(2) || '0.00'}
            </Text>
          </View>
        )}

        {/* Targeting Summary */}
        {targetingData && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Campaign Targeting Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{targetingData.summary?.total_customers || 0}</Text>
                <Text style={styles.summaryLabel}>Total Customers</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{targetingData.products?.count || 0}</Text>
                <Text style={styles.summaryLabel}>Products</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{targetingData.categories?.count || 0}</Text>
                <Text style={styles.summaryLabel}>Categories</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{targetingData.locations?.count || 0}</Text>
                <Text style={styles.summaryLabel}>Countries</Text>
              </View>
            </View>
          </View>
        )}

        {/* Campaign Title */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Campaign Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Example: Special offer for our valued customers"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            maxLength={100}
          />
          <Text style={styles.charCount}>{formData.title.length}/100</Text>
        </View>

        {/* Campaign Content */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Campaign Content *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Write your campaign content here..."
            value={formData.content}
            onChangeText={(value) => handleInputChange('content', value)}
            multiline
            numberOfLines={6}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{formData.content.length}/1000</Text>
        </View>

        {/* Target Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.targetType}
              onValueChange={(value) => handleInputChange('targetType', value)}
              style={styles.picker}
            >
              {TARGET_TYPES.map((type) => (
                <Picker.Item
                  key={type.value}
                  label={type.label}
                  value={type.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Targeting Options */}
        {renderTargetingOptions()}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { opacity: loading ? 0.6 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text style={styles.submitButtonText}>Create and Send Campaign</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  costInfo: {
    backgroundColor: theme.colors.accent + '20',
    padding: 12,
    borderRadius: theme.radius.sm,
    marginBottom: 20,
  },
  costText: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: 16,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 120,
  },
  numberInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: 16,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  charCount: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  picker: {
    height: 50,
  },
  targetingContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: 16,
    marginBottom: 20,
  },
  targetingLabel: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  targetingHint: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  comingSoon: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.warning,
    fontStyle: 'italic',
    marginTop: 8,
  },
  selectionContainer: {
    marginTop: 10,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: theme.radius.sm,
    marginBottom: 8,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
  },
  noDataText: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  locationContainer: {
    marginTop: 10,
  },
  countrySection: {
    marginBottom: 15,
  },
  countryTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  governorateSection: {
    marginBottom: 10,
  },
  governorateTitle: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  citiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cityText: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: theme.radius.sm,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: theme.fonts.size.md,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  summaryContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  summaryNumber: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
});

