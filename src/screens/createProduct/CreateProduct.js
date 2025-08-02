import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from '../../utils/theme';

const CreateProduct = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  //   send data to api
  const handleSave = async () => {
    if (!productName) {
      Alert.alert("Error", "Please enter product name");
      return;
    } else if (!price) {
      Alert.alert("Error", "Please enter price");
      return;
    } else if (!description) {
      Alert.alert("Error", "Please enter description");
      return;
    } else if (!category) {
      Alert.alert("Error", "Please enter category");
      return;
    } else if (!stock) {
      Alert.alert("Error", "Please enter stock");
      return;
    } else if (images.length === 0) {
      Alert.alert("Error", "Please select at least one image");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      setLoading(true);
      const formData = new FormData();
      formData.append("title", productName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("discount", discount ? discount : 0);
      formData.append("category_id", category);
      formData.append("stock", stock);
      formData.append("status", status);
      // formData.append('images', images);
      images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });
      const response = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Product added successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to add product");
        console.log(response);
      }
      //   console.log(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add product");
    } finally {
      setLoading(false);
    }
  };
  //   get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await fetch(`${API}/categories/seller`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // console.log("Categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={theme.header.backButton}
            >
              <AntDesign name="arrowleft" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Product</Text>
            <View style={{ width: 40 }} />
          </View>

          {categories?.length > 0 ? null : (
            <View style={styles.loadingContainer}>
              <Text style={styles.title2}>
                not categories yet plesse add category
              </Text>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => navigation.navigate("CreateCategory")}
              >
                <Text style={styles.saveBtnText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.imageUploadBox} onPress={pickImages}>
            <Text style={styles.title2}>Add a product image</Text>
            <Text style={styles.imageUploadText}>
              Upload a photo of your product
            </Text>
            <Text style={styles.imageUploadBtn}>Upload image</Text>
          </TouchableOpacity>

          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ marginRight: 10, position: "relative" }}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 100, height: 100, borderRadius: 10 }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "red",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.label}>Product Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor={"grey"}
            value={productName}
            onChangeText={setProductName}
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor={"grey"}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter discount (optional)"
            placeholderTextColor={"grey"}
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Select Category"
                value=""
                color="grey"
                enabled={false}
              />
              {categories?.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Stock</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stock"
            keyboardType="numeric"
            placeholderTextColor={"grey"}
            value={stock}
            onChangeText={setStock}
          />
          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Select status"
                value=""
                color="grey"
                enabled={false}
              />
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Inactive" value="inactive" />
            </Picker>
          </View>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 120 }]}
            placeholder="description"
            placeholderTextColor={"grey"}
            multiline
            textAlignVertical="top"
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
          />

          {loading ? (
            <View style={styles.saveBtn}>
              <ActivityIndicator size="large" color={theme.colors.card} />
            </View>
          ) : (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateProduct;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get('window').height - 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 0,
  },
  title: {
    ...theme.header.title,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
  },
  title2: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: theme.colors.text,
    textAlign: 'center',
  },
  imageUploadBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  imageUploadText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
  },
  imageUploadBtn: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 15,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    color: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  image: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    width: '100%',
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.md,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    marginBottom: 15,
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  loadingContainer: {
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 3,
    padding: 8,
    // backgroundColor: "#E8E5F5",
    // borderRadius: 50,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
