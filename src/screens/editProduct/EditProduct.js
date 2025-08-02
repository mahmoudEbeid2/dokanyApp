import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Image, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator,
  FlatList,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../utils/theme';
// import { useRoute } from "@react-navigation/native";   

const EditProduct = ({ navigation , route}) => {
//   const route = useRoute();
//   const { productId } = route.params; 

  const productId = route.params.productId;

// const token =  AsyncStorage.getItem("token");
//   const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZGRmNTVxNzAwMDBzNnlweG5oaThtOGgiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzUzMTIxMjg1LCJleHAiOjE3NTM3MjYwODV9.EjqeiVhVpkBWo3kyJDO5ngPOHzWUAx3_kbis8kxoBxY";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState("");
  const [images, setImages] = useState([]);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
        const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch(`${API}/products/${productId}`, {
          headers: { Authorization: token }
        });
        const data = await res.json();
        setProductName(data.title);
        setPrice(data.price.toString());
        setDescription(data.description);
        setDiscount(data.discount?.toString() || "");
        setCategory(data.category_id);
        setStock(data.stock.toString());
        setStatus(data.status.toLowerCase());
        
        // setImages(data.images?.map((url, i) => ({ uri: url, name: `old_${i}` })) || []);
      } catch (error) {
        Alert.alert("Error", "Failed to load product",data.error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
        const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API}/categories/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
    //   console.log("Categories:", data);
      setCategories(data);
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const handleUpdate = async () => {
    if (!productName ) {
      Alert.alert("Error", "Please enter product name");
      return;
    }else if (!price) {
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
    }

    try {
      const token = await AsyncStorage.getItem("token");
      setSaving(true);
      const formData = new FormData();
      formData.append("title", productName);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("discount", discount || "0");
      formData.append("category_id", category);
      formData.append("stock", stock);
      formData.append("status", status);

      if(images.length >0){
        images.forEach((image, index) => {
          if(image?.uri && !image?.uri.startsWith("http")){
            formData.append("images", {
              uri: image.uri,
              type: "image/jpeg",
              name: `image_${index}.jpg`,
            });
              
          }
        });
      }

  
      const res = await fetch(`${API}/products/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Product updated successfully");
        navigation.goBack();
      } else {
        // console.log(res)

        Alert.alert("Error", data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#7B5CFA" />;

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
        <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

        <Text style={styles.title}>Edit Product</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={pickImages}>
           <Text style={styles.title2}>Update a product image</Text>
                  <Text style={styles.imageUploadText}>Upload a photo of your product</Text>
                  <Text style={styles.imageUploadBtn}>Upload image</Text>
        </TouchableOpacity>

        <FlatList
  horizontal
  data={images}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item, index }) => (
    <View style={{ marginRight: 10, position: 'relative' }}>
      <Image
        source={{ uri: item.uri }}
        style={{ width: 80, height: 80, borderRadius: 10,overflow: 'hidden' }}
      />
      <TouchableOpacity
        onPress={() => removeImage(index)}
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'red',
          borderRadius: 10,
          padding: 5,
          overflow: 'hidden',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
      </TouchableOpacity>
    </View>
  )}
/>



        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={productName} onChangeText={setProductName} />

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />

        <Text style={styles.label}>Discount</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={discount} onChangeText={setDiscount} />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Select Category" value="" enabled={false} />
            {categories?.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Stock</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={stock} onChangeText={setStock} />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Inactive" value="inactive" />
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 120 }]}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {saving ? (
            <View style={styles.saveBtn}>
          <ActivityIndicator size="large" color={theme.colors.card} />
        </View>
        ):(
            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? "Updating..." : "Update Product"}</Text>
        </TouchableOpacity>)}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  title: {
    ...theme.header.title,
    marginBottom: 20,
    marginTop: 10,
  },
  title2: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    marginBottom: 16,
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

export default EditProduct;
