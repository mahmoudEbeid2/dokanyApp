import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from "@expo/vector-icons/AntDesign";
import theme from '../../utils/theme';


const AddCategory =  ({ navigation }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name ) {
        Alert.alert('please enter name');
      return;
    }else if (!image) {
      Alert.alert('please select image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', {
      uri: image.uri,
      name: 'category.jpg',
      type: 'image/jpeg',
    });

    const token = await AsyncStorage.getItem('token');
    // console.log("token",token);

    try {
      setLoading(true);
      const response = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: {
        //   'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('success','category added successfully',[
            {text:'ok',
            onPress:()=>{
                navigation.goBack();
            }}
        ]);
        // navigation.goBack();
      } else {
        Alert.alert(data.message || 'Failed to add category');
        console.log(response)
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Failed to add category');
    }
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
        <Text style={styles.title}>Add Category</Text>
        <View style={{ width: 40 }} />
      </View>



      <Text style={styles.label}>Category Image</Text>
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 200, borderRadius: 12 }}
          />
        ) : (
          <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
                  <Text style={styles.title2}>Add a Category image</Text>
                  <Text style={styles.imageUploadText}>Upload a photo of your category</Text>
                  <Text style={styles.imageUploadBtn}>Upload image</Text>
                </TouchableOpacity>
        )}
      </TouchableOpacity>
            <Text style={styles.label}>Category Name </Text>
      <TextInput
        placeholder="Category Name"
        placeholderTextColor={theme.colors.textSecondary}
        value={name}
        onChangeText={setName}
        style={styles.input}

      />

        {loading ? (
            <View style={styles.saveBtn}>
          <ActivityIndicator color={theme.colors.card} />
            </View>
        ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={styles.saveBtn}
            >
            
          <Text style={styles.saveBtnText}>save category </Text>
            
      </TouchableOpacity>
        )}
    </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
};

export default AddCategory;


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
    fontWeight: '700',
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
    fontSize: theme.fonts.size.md,
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
    ...theme.shadow,
  },
  saveBtnText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 3,
    padding: 8,
  },
});

