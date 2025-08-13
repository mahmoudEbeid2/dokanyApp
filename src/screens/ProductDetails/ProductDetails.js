import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  PanGestureHandler,
  State,
  Modal,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import theme from '../../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useShare } from '../../hooks/useShare';

const ProductDetails = ({ navigation, route }) => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const modalFlatListRef = useRef(null);

  const { shareContent } = useShare();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  //   const { product } = route.params;
  const productId = route.params?.productId;

  // Validate productId
  if (!productId) {
    Alert.alert("Error", "Product ID not found. Please try again.");
    navigation.goBack();
    return null;
  }

  useFocusEffect(useCallback(() => {
    const fetchProduct = async () => {

      try {
        const response = await fetch(
          `${API}/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    const fetchReviews = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(
          `${API}/reviews/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [])
  );
  const handleEdit = () => {
    navigation.navigate("EditProduct", { productId });


    // alert("Edit functionality is under construction.");
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert("Error", "Authentication token not found. Please login again.");
                return;
              }

              // Use the correct API endpoint
              const res = await fetch(`${API}/products/${productId}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });


              if (res.ok) {
                Alert.alert("Success", "Product deleted successfully!", [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack()
                  }
                ]);
              } else {
                let errorData;
                try {
                  errorData = await res.json();
                } catch (parseError) {
                  console.error("Error parsing response:", parseError);
                  errorData = { message: "Failed to parse server response" };
                }

                console.error("Delete error response:", errorData);
                console.error("Response status:", res.status);
                console.error("Response status text:", res.statusText);

                let errorMessage = "Unknown error";
                if (errorData.error) {
                  errorMessage = errorData.error;
                } else if (errorData.message) {
                  errorMessage = errorData.message;
                } else if (res.status === 401) {
                  errorMessage = "Unauthorized. Please login again.";
                } else if (res.status === 403) {
                  errorMessage = "You don't have permission to delete this product.";
                } else if (res.status === 404) {
                  errorMessage = "Product not found.";
                } else if (res.status === 500) {
                  errorMessage = "Server error. Please try again later.";
                }

                Alert.alert(
                  "Error",
                  `Failed to delete product (Status: ${res.status}): ${errorMessage}`
                );
              }
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Error", "Network error. Please check your connection and try again.");
            }
          },
        },
      ]
    );
  };



  const handleShare = async () => {
    const productLink = `https://${product.seller.subdomain}.dokaney.store/products/${product.id}`;
    const shareMessage = `Check out ${product.title} on Dokaney Store!\n\n${productLink}`;

    try {
      await shareContent(shareMessage, product.title);
    } catch (error) {
      console.error("Error sharing product:", error);
      Alert.alert("Error", "Failed to share product. Please try again.");
    }
  };

  //   handleDeleteReview
  const handleDeleteReview = async (reviewId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }

      const res = await fetch(
        `${API}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        Alert.alert("Success", "Review deleted successfully!");
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } else {
        const errorData = await res.json();
        console.error("Delete review error response:", errorData);
        Alert.alert(
          "Error",
          `Failed to delete review: ${errorData.message || "Unauthorized or Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      Alert.alert("Error", "Network error. Please check your connection and try again.");
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.colors.primary} />;

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleModalImageScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(contentOffset / Dimensions.get('window').width);
    setSelectedImageIndex(imageIndex);
  };

  const renderModalImageItem = ({ item, index }) => (
    <View style={styles.modalImageSlide}>
      <Image
        source={{ uri: item.image }}
        style={styles.modalImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageSlide}
      onPress={() => handleImagePress(index)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const handleImageScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const imageIndex = Math.round(contentOffset / Dimensions.get('window').width);
    setCurrentImageIndex(imageIndex);
  };

  const renderImageIndicator = () => {
    if (!product?.images || product.images.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={[theme.colors.background, '#e8eaf6']} style={styles.gradientBg}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={theme.header.backButton}
              >
                <AntDesign name="arrowleft" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>Product Details</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.imageSliderContainer}>
              {product?.images && product.images.length > 0 ? (
                <>
                  <FlatList
                    ref={flatListRef}
                    data={product.images}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleImageScroll}
                    style={styles.imageSlider}
                  />
                  {renderImageIndicator()}
                </>
              ) : (
                <View style={styles.noImageContainer}>
                  <MaterialIcons name="image" size={64} color={theme.colors.textSecondary} />
                  <Text style={styles.noImageText}>No images available</Text>
                </View>
              )}
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.name}>{product?.title}</Text>

              <View style={styles.priceCard}>
                {product?.discount ? (
                  <View style={styles.priceRow}>
                    <View style={styles.priceInfo}>
                      <MaterialIcons name="attach-money" size={24} color={theme.colors.primary} />
                      <Text style={styles.price}>${product?.price}</Text>
                    </View>
                    <View style={styles.discountInfo}>
                      <MaterialIcons name="local-offer" size={20} color={theme.colors.error} />
                      <Text style={styles.discountText}>Discount: {product?.discount}%</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.priceInfo}>
                    <MaterialIcons name="attach-money" size={24} color={theme.colors.primary} />
                    <Text style={styles.price}>${product?.price}</Text>
                  </View>
                )}
              </View>

              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{product?.description}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                  <MaterialIcons name="category" size={20} color={theme.colors.primary} />
                  <Text style={styles.infoLabel}>Category</Text>
                  <Text style={styles.infoValue}>{product?.category?.name || "N/A"}</Text>
                </View>
                <View style={styles.infoCard}>
                  <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>{product?.status}</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.7}
                  onPress={() => handleEdit()}
                >
                  <MaterialIcons name="edit" size={20} color={theme.colors.card} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                  onPress={() => handleDelete()}
                >
                  <MaterialIcons name="delete-forever" size={20} color={'#FFF'} />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewsSection}>
                <Text style={styles.reviewsTitle}>Reviews</Text>
                {reviews?.length > 0 ? (
                  <View style={styles.reviews}>
                    {reviews.map((review) => (
                      <View key={review.id} style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                          <View style={styles.reviewUser}>
                            <Image
                              source={{
                                uri: review?.customer?.profile_imge || "https://i.pravatar.cc/150?img=12",
                              }}
                              style={styles.reviewImage}
                            />
                            <Text style={styles.reviewName}>
                              {review?.customer?.f_name + " " + review?.customer?.l_name}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteReviewButton}
                            onPress={() => {
                              Alert.alert(
                                "Delete Review",
                                "Are you sure you want to delete this review?",
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Delete",
                                    onPress: () => handleDeleteReview(review.id),
                                    style: "destructive",
                                  },
                                ]
                              );
                            }}
                          >
                            <AntDesign name="delete" size={16} color={theme.colors.error} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.rating}>
                          {[...Array(5)].map((_, i) => (
                            <AntDesign
                              key={i}
                              name="star"
                              size={18}
                              color={i < review?.rating ? theme.colors.warning : "#ccc"}
                              style={styles.iconStar}
                            />
                          ))}
                        </View>
                        <Text style={styles.reviewText}>{review?.comment}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.noReviewsCard}>
                    <MaterialIcons name="rate-review" size={48} color={theme.colors.textSecondary} />
                    <Text style={styles.noReviews}>No reviews yet</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.7}
            onPress={() => handleShare()}
          >
            <MaterialIcons name="share" size={20} color={theme.colors.card} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Image Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color={theme.colors.card} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedImageIndex + 1} / {product?.images?.length || 0}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.modalContent}>
              {product?.images && (
                <FlatList
                  ref={modalFlatListRef}
                  data={product.images}
                  renderItem={renderModalImageItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleModalImageScroll}
                  initialScrollIndex={selectedImageIndex}
                  getItemLayout={(data, index) => ({
                    length: Dimensions.get('window').width,
                    offset: Dimensions.get('window').width * index,
                    index,
                  })}
                  style={styles.modalImageSlider}
                />
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingBottom: 16,
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get('window').height - 100,
  },
  image: {
    width: 420,
    height: 350,
    borderRadius: theme.radius.md,
    marginBottom: 16,
    marginHorizontal: 'auto',
  },
  container2: {
    paddingHorizontal: 25,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  price: {
    fontSize: theme.fonts.size.md,
    marginVertical: 8,
    color: theme.colors.primary,
  },
  category: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  seller: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
  },
  status: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.success,
  },
  description: {
    marginVertical: 10,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: theme.radius.md,
    marginTop: 10,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  //Share
  fab: {
    ...theme.fab,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    padding: 10,
    borderRadius: theme.radius.md,
    marginTop: 10,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonTextd: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  reviews: {
    marginTop: 20,
  },
  reviewItem: {
    paddingBottom: 20,
    marginBottom: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  reviewName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.bold,
  },
  reviewText: {
    color: theme.colors.textSecondary,
  },
  reviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewTextx: {
    color: "#121217",
    justifyContent: "flex-start",
    //    flex:1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F2F0F5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconStar: {
    marginHorizontal: 2,
  },
  noReviews: {
    marginTop: 20,
    marginBottom: 100,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 3,
    padding: 8,
    // backgroundColor: "#E8E5F5",
    // borderRadius: 50,
    // alignItems: "center",
    // justifyContent: "center",  
  },
  gradientBg: { flex: 1 },
  imageContainer: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  image: { width: '90%', height: 300, borderRadius: theme.radius.lg, ...theme.shadow },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 32 },
  name: { fontSize: theme.fonts.size.lg, fontWeight: 'bold', color: theme.colors.text, fontFamily: theme.fonts.bold, marginBottom: 16, textAlign: 'center' },
  priceCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 16, marginBottom: 16, ...theme.shadow },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceInfo: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: theme.fonts.size.xl, color: theme.colors.primary, fontFamily: theme.fonts.bold, marginLeft: 4 },
  discountInfo: { flexDirection: 'row', alignItems: 'center' },
  discountText: { fontSize: theme.fonts.size.md, color: theme.colors.error, fontFamily: theme.fonts.bold, marginLeft: 4 },
  descriptionCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 16, marginBottom: 16, ...theme.shadow },
  descriptionTitle: { fontSize: theme.fonts.size.lg, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8, fontFamily: theme.fonts.bold },
  description: { fontSize: theme.fonts.size.md, color: theme.colors.textSecondary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  infoCard: { flex: 1, backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 12, marginHorizontal: 4, alignItems: 'center', ...theme.shadow },
  infoLabel: { fontSize: theme.fonts.size.sm, color: theme.colors.textSecondary, marginTop: 4, fontFamily: theme.fonts.bold },
  infoValue: { fontSize: theme.fonts.size.md, color: theme.colors.text, fontWeight: 'bold', marginTop: 2, fontFamily: theme.fonts.bold },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  editButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 30, paddingVertical: 14, marginHorizontal: 4, ...theme.shadow },
  editButtonText: { color: theme.colors.card, fontSize: theme.fonts.size.md, fontWeight: 'bold', fontFamily: theme.fonts.bold, marginLeft: 6 },
  deleteButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.error, borderRadius: 30, paddingVertical: 14, marginHorizontal: 4, ...theme.shadow },
  deleteButtonText: { color: '#FFF', fontSize: theme.fonts.size.md, fontWeight: 'bold', fontFamily: theme.fonts.bold, marginLeft: 6 },
  reviewsSection: { marginTop: 8 },
  reviewsTitle: { fontSize: theme.fonts.size.xl, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16, fontFamily: theme.fonts.bold },
  reviewCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 16, marginBottom: 12, ...theme.shadow },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewUser: { flexDirection: 'row', alignItems: 'center' },
  reviewImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10, borderWidth: 2, borderColor: theme.colors.primary },
  reviewName: { fontWeight: 'bold', color: theme.colors.text, fontSize: theme.fonts.size.md, fontFamily: theme.fonts.bold },
  deleteReviewButton: { padding: 8, backgroundColor: theme.colors.background, borderRadius: 20, ...theme.shadow },
  rating: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconStar: { marginHorizontal: 1 },
  reviewText: { color: theme.colors.textSecondary, fontSize: theme.fonts.size.sm, lineHeight: 18 },
  noReviewsCard: { backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 32, alignItems: 'center', ...theme.shadow },
  noReviews: { marginTop: 12, fontSize: theme.fonts.size.md, color: theme.colors.textSecondary, textAlign: 'center', fontFamily: theme.fonts.bold },
  backButtonModern: {
    position: "absolute",
    top: 28,
    left: 18,
    zIndex: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.header.title,
  },
  imageSliderContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    ...theme.shadow,
  },
  imageSlider: {
    width: '100%',
    height: '100%',
  },
  imageSlide: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noImageText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  modalCloseButton: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageSlider: {
    width: '100%',
    height: '100%',
  },
  modalImageSlide: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
  },
});
