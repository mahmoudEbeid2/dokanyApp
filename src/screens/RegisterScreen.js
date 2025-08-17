import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { authAPI } from '../utils/api/api';
import ThemeSelector from '../components/ThemeSelector';
import { API } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import theme from '../utils/theme';
import { WebView } from 'react-native-webview';

const fields = [
  { name: 'user_name', label: 'Username', placeholder: 'Enter Username', icon: <FontAwesome name="user" size={20} /> },
  { name: 'f_name', label: 'First Name', placeholder: 'Enter First Name', icon: <Ionicons name="person" size={20} /> },
  { name: 'l_name', label: 'Last Name', placeholder: 'Enter Last Name', icon: <Ionicons name="person-outline" size={20} /> },
  { name: 'email', label: 'Email', placeholder: 'Enter Email', icon: <MaterialIcons name="email" size={20} /> },
  { name: 'password', label: 'Password', placeholder: 'Enter Password', icon: <Ionicons name="lock-closed" size={20} />, isPassword: true },
  { name: 'confirm_password', label: 'Confirm Password', placeholder: 'Confirm Password', icon: <Ionicons name="lock-closed-outline" size={20} />, isPassword: true },
  { name: 'phone', label: 'Phone', placeholder: 'Enter Phone', icon: <FontAwesome name="phone" size={20} /> },
  { name: 'city', label: 'City', placeholder: 'Enter City', icon: <FontAwesome name="building" size={20} /> },
  { name: 'governorate', label: 'Governorate', placeholder: 'Enter Governorate', icon: <FontAwesome name="map-marker" size={20} /> },
  { name: 'country', label: 'Country', placeholder: 'Enter Country', icon: <FontAwesome name="globe" size={20} /> },
  { name: 'subdomain', label: 'Subdomain', placeholder: 'Enter Subdomain', icon: <FontAwesome name="link" size={20} /> },
  { name: 'payout_method', label: 'Payout Account', placeholder: 'Enter Payout Account', icon: <FontAwesome name="credit-card" size={20} /> },
  { name: "facebook_url", label: "Facebook Store Account URL (Optional)", placeholder: "Enter Facebook Store Account URL", icon: <AntDesign name="facebook-square" size={20} /> },
  { name: "instagram_url", label: "Instagram Store Account URL (Optional)", placeholder: "Enter Instagram Store Account URL", icon: <AntDesign name="instagram" size={20} /> },
  { name: "X_url", label: "X (Twitter) Store Account URL (Optional)", placeholder: "Enter X (Twitter) Store Account URL", icon: <FontAwesome6 name="x-twitter" size={20} /> },
  { name: "pinterest_url", label: "pinterest Store Account URL (Optional)", placeholder: "Enter pinterest Store Account URL", icon: <FontAwesome name="pinterest" size={20} /> },
];

const screen1Fields = fields.slice(0, 6);
const screen2Fields = fields.slice(6, 10);
const screen3Fields = fields.slice(10, 12);
const socialMediaFields = fields.slice(12);

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState(Object.fromEntries(fields.map(f => [f.name, ''])));
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [logo, setLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themes, setThemes] = useState([]);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedThemePreview, setSelectedThemePreview] = useState(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themeRes = await fetch(`${API}/themes`);
        const themeData = await themeRes.json();
        setThemes(themeData);
      } catch (err) {
        console.log("Error loading themes:", err.message);
      }
    };
    fetchThemes();
  }, []);

  const handleChange = (field, value) => {
    const trimmedValue = value.trimStart();
    setForm(prev => ({ ...prev, [field]: trimmedValue }));


    if (touchedFields[field]) {
      const newError = validateSingleField(field, trimmedValue);
      setErrors(prev => ({ ...prev, [field]: newError || '' }));
    }
  };


  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const newError = validateSingleField(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: newError || '' }));
  };

  const validateScreen = (screenNumber) => {
    const fieldsToValidate = screenNumber === 1 ? screen1Fields : screenNumber === 2 ? screen2Fields : fields;
    const newErrors = {};
    const newTouchedFields = {};

    fieldsToValidate.forEach(field => {
      const error = validateSingleField(field.name, form[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
      newTouchedFields[field.name] = true;
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    setTouchedFields(prev => ({ ...prev, ...newTouchedFields }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateScreen(currentScreen)) {
      setCurrentScreen(currentScreen + 1);
    } else {

    }
  };

  const handlePrev = () => {
    setCurrentScreen(currentScreen - 1);
  };

  const validateSingleField = (field, value) => {
    switch (field) {
      case 'user_name':
        if (!value) return "Username must be at least 3 characters long";
        if (!/^[a-zA-Z0-9_.-]+$/.test(value)) return "Username can only contain English letters, numbers, underscores, periods, or hyphens";
        if (value.length < 3 || value.length > 30) return "Username must be between 3 and 30 characters";
        break;
      case 'f_name':
      case 'l_name':
        if (!value) return `${field === 'f_name' ? 'First' : 'Last'} name is required and must be at least 2 characters`;
        if (!/^[a-zA-Z\u0600-\u06FF\s.'-]+$/.test(value)) return `${field === 'f_name' ? 'First' : 'Last'} name must contain letters only`;
        if (value.length < 2 || value.length > 50) return `${field === 'f_name' ? 'First' : 'Last'} name must be between 2 and 50 characters`;
        break;
      case 'email':
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format. Please enter a valid email address.";
        const domain = value.split('@')[1];
        const allowed = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'protonmail.com'];
        if (!allowed.includes(domain)) return "Email must be from a recognized provider (e.g., Gmail, Outlook, Yahoo).";
        break;
      case 'phone':
        if (!value) return "Phone number is too short (at least 8 digits)";
        if (!/^[0-9+()\-\s]*$/.test(value)) return "Phone number can only contain digits or international characters (+, -, parenthesis)";
        if (value.length < 8 || value.length > 15) return "Phone number must be between 8 and 15 digits";
        break;
      case 'city':
      case 'governorate':
      case 'country':
        if (!value) return `${field[0].toUpperCase() + field.slice(1)} name is required and must be at least 2 characters`;
        if (!/^[a-zA-Z\u0600-\u06FF\s.'-]+$/.test(value)) return `${field[0].toUpperCase() + field.slice(1)} name must contain letters only`;
        if (value.length < 2 || value.length > 100) return `${field[0].toUpperCase() + field.slice(1)} name must be between 2 and 100 characters`;
        break;
      case 'password':
        if (!value) return "Password must be at least 8 characters long";
        if (value.length < 8 || value.length > 50) return "Password must be between 8 and 50 characters";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one digit";
        if (!/[^a-zA-Z0-9]/.test(value)) return "Password must contain at least one special character (e.g., !@#$%^&*)";
        break;
      case 'confirm_password':
        if (!value || value !== form.password) return "Passwords do not match";
        break;
      case 'subdomain':
        if (value && !/^[a-z0-9-]+$/.test(value)) return "Subdomain can only contain lowercase letters, numbers, and hyphens";
        if (value && (value.length < 3 || value.length > 50)) return "Subdomain must be between 3 and 50 characters long";
        break;
      case 'payout_method':
        if (!value) return "Payout Account is required";
        break;
      case 'facebook_url':
      case 'instagram_url':
      case 'twitter_url':
      case 'pinterest_url':
        if (value && !/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.]*)*\/?$/.test(value)) {
          return "Please enter a valid URL";
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    // Validate the current screen 
    if (!validateScreen(3)) {
      return;
    }

    // Create a mutable copy of the form data for processing
    const formattedForm = { ...form };

    // Format URLs by adding 'https://' if not present because Zod Validation by url in Backend and handele user input without 'https://'
    if (formattedForm.facebook_url && !formattedForm.facebook_url.startsWith('http')) {
      formattedForm.facebook_url = `https://${formattedForm.facebook_url}`;
    }
    if (formattedForm.instagram_url && !formattedForm.instagram_url.startsWith('http')) {
      formattedForm.instagram_url = `https://${formattedForm.instagram_url}`;
    }
    if (formattedForm.X_url && !formattedForm.X_url.startsWith('http')) {
      formattedForm.X_url = `https://${formattedForm.X_url}`;
    }
    if (formattedForm.pinterest_url && !formattedForm.pinterest_url.startsWith('http')) {
      formattedForm.pinterest_url = `https://${formattedForm.pinterest_url}`;
    }

    // Create a FormData object to send the form data and files
    const formData = new FormData();
    Object.keys(formattedForm).forEach(key => {
      formData.append(key, formattedForm[key]);
    });

    // Append image files if they exist
    if (logo) {
      formData.append('logo', {
        uri: logo.uri,
        name: 'logo.jpg',
        type: 'image/jpeg',
      });
    }
    if (profileImage) {
      formData.append('profile_imge', {
        uri: profileImage.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }
    if (selectedTheme) {
      formData.append('theme_id', selectedTheme);
    }

    try {
      // Attempt to register the user
      await authAPI.post('seller/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // On success, show a success alert and navigate to the login screen
      Alert.alert('Success', 'Registration successful! Please check your email to verify your account before logging in .');
      navigation.navigate('Login');
    } catch (err) {
      console.log(err?.response?.data);

      const backendDetails = err?.response?.data?.details;
      const backendError = err?.response?.data?.error;

      const newErrors = {};
      let firstErrorField = null;
      let firstErrorScreen = 3;

      // Handle Zod validation errors (multiple fields)
      if (backendDetails) {
        for (const field in backendDetails) {
          newErrors[field] = Array.isArray(backendDetails[field]) ? backendDetails[field][0] : backendDetails[field];
          if (!firstErrorField) firstErrorField = field;
        }
      }
      // Handle specific unique constraint errors (single field)
      else if (backendError && backendError.includes('already exists')) {
        const fieldName = backendError.split(' ')[0].toLowerCase();
        // Map the field name from the backend to the form's state key
        const finalFieldName = (fieldName === 'user' && backendError.includes('Username')) ? 'user_name' : fieldName;
        newErrors[finalFieldName] = backendError;
        firstErrorField = finalFieldName;
      }
      // Handle other general errors
      else if (backendError) {
        Alert.alert('Error', backendError);
        return;
      }

      // Determine which screen the error belongs to and update the state
      if (firstErrorField) {
        if (['user_name', 'f_name', 'l_name', 'email', 'password'].includes(firstErrorField)) {
          firstErrorScreen = 1;
        } else if (['city', 'governorate', 'country','phone'].includes(firstErrorField)) {
          firstErrorScreen = 2;
        } else {
          // Default to screen 3 for other fields like social media or images
          firstErrorScreen = 3;
        }
      }

      // Set the errors and navigate to the correct screen
      setErrors(newErrors);
      setCurrentScreen(firstErrorScreen);

      Alert.alert(
        'Registration Failed',
        'Please correct the highlighted errors before proceeding.'
      );
    }
  };

  const handlePreviewTheme = (themeId) => {
    setSelectedThemePreview(themeId);
    setPreviewModalVisible(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <>
            <Text style={styles.header}>Personal Info</Text>
            {screen1Fields.map(({ name, label, icon, placeholder, isPassword }) => (
              <View key={name} style={{ marginBottom: 15 }}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}>{icon}</View>
                  <TextInput
                    placeholder={placeholder}
                    value={form[name]}
                    secureTextEntry={!!isPassword}
                    onChangeText={(val) => handleChange(name, val)}
                    onBlur={() => handleBlur(name)}
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
              </View>
            ))}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.header}>Additional Info</Text>
            {screen2Fields.map(({ name, label, icon, placeholder, isPassword }) => (
              <View key={name} style={{ marginBottom: 15 }}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}>{icon}</View>
                  <TextInput
                    placeholder={placeholder}
                    value={form[name]}
                    secureTextEntry={!!isPassword}
                    onChangeText={(val) => handleChange(name, val)}
                    onBlur={() => handleBlur(name)}
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
              </View>
            ))}
            <View style={styles.uploadContainer}>
              <Text style={styles.uploadHeader}>Add a Profile Image</Text>
              <Text style={styles.uploadDescription}>{profileImage ? "Profile Image Selected" : "Upload a photo of your profile"}</Text>
              <TouchableOpacity onPress={() => pickImage(setProfileImage)} style={styles.uploadButton}>
                <Text>Upload Image</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.header}>Store Details</Text>
            {screen3Fields.map(({ name, label, icon, placeholder, isPassword }) => (
              <View key={name} style={{ marginBottom: 15 }}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}>{icon}</View>
                  <TextInput
                    placeholder={placeholder}
                    value={form[name]}
                    secureTextEntry={!!isPassword}
                    onChangeText={(val) => handleChange(name, val)}
                    onBlur={() => handleBlur(name)}
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
              </View>
            ))}
            <View style={styles.uploadContainer}>
              <Text style={styles.uploadHeader}>Add a Store Logo</Text>
              <Text style={styles.uploadDescription}>{logo ? "Store Logo Selected" : "Upload a photo of your store logo"}</Text>
              <TouchableOpacity onPress={() => pickImage(setLogo)} style={styles.uploadButton}>
                <Text>Upload Image</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.themeSection}>
              <Text style={styles.themeLabel}>Select Theme</Text>
              <View style={styles.themeList}>
                {themes.length > 0 ? (
                  themes.map((themeItem) => (
                    <View key={themeItem.id} style={styles.themeCardContainer}>
                      <TouchableOpacity
                        style={[
                          styles.themeCard,
                          selectedTheme === themeItem.id && styles.selectedThemeCard
                        ]}
                        onPress={() => setSelectedTheme(themeItem.id)}
                      >
                        <Image source={{ uri: themeItem.preview_image }} style={styles.themeImage} />
                        <Text style={styles.themeName}>{themeItem.name}</Text>
                        {selectedTheme === themeItem.id && (
                          <Text style={styles.selectedText}>Selected</Text>
                        )}
                      </TouchableOpacity>
                      {themeItem.preview_url && (
                        <TouchableOpacity
                          style={styles.previewButton}
                          onPress={() => handlePreviewTheme(themeItem.id)}
                        >
                          <Text style={styles.previewButtonText}>Preview</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noThemesText}>No themes available</Text>
                )}
              </View>
            </View>
            <Text style={styles.inputLabel}>Social Media Links (Optional)</Text>
            {socialMediaFields.map(({ name, label, icon, placeholder }) => (
              <View key={name} style={{ marginBottom: 15 }}>
                <Text style={styles.inputLabel}>{label}</Text>
                <View style={styles.inputContainer}>
                  <View style={styles.icon}>{icon}</View>
                  <TextInput
                    placeholder={placeholder}
                    value={form[name]}
                    onChangeText={(val) => handleChange(name, val)}
                    onBlur={() => handleBlur(name)}
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
                {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
              </View>
            ))}

          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoCircleModern}>
              <AntDesign name="user" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.mainHeader}>Create an Account</Text>

            <View style={styles.indicatorContainer}>
              <View style={[styles.indicatorDot, currentScreen === 1 && styles.activeDot]} />
              <View style={[styles.indicatorDot, currentScreen === 2 && styles.activeDot]} />
              <View style={[styles.indicatorDot, currentScreen === 3 && styles.activeDot]} />
            </View>

            {renderScreen()}

            <View style={styles.buttonContainer}>
              {currentScreen > 1 && (
                <TouchableOpacity onPress={handlePrev} style={[styles.navigationButton, styles.prevButton]}>
                  <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
                    Previous
                  </Text>
                </TouchableOpacity>
              )}
              {currentScreen < 3 ? (
                <TouchableOpacity onPress={handleNext} style={[styles.navigationButton, styles.nextButton]}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleRegister} style={[styles.navigationButton, styles.registerButton]}>
                  <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 18 }}>
              <Text style={{ color: theme.colors.primary, fontSize: theme.fonts.size.sm, textAlign: 'center' }}>
                Already have an account? <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        visible={previewModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.modalFullScreen}>
          <View style={styles.modalHeaderContainer}>
            <Text style={styles.modalHeader}>
              {themes.find(theme => theme.id === selectedThemePreview)?.name || 'Theme Preview'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButtonSmall}
              onPress={() => setPreviewModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          {themes.find(theme => theme.id === selectedThemePreview)?.preview_url ? (
            <WebView
              source={{ uri: themes.find(theme => theme.id === selectedThemePreview).preview_url }}
              style={styles.webView}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          ) : (
            <View style={styles.noPreviewContainer}>
              <Text style={styles.noThemesText}>No website preview available for this theme.</Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 50,
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get('window').height - 100,
  },
  mainHeader: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: theme.fonts.bold,
  },
  header: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  inputLabel: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 12,
    marginBottom: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    marginRight: 5,
    width: 20,
  },
  input: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    paddingTop: 10,
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    borderStyle: 'dashed',
    paddingVertical: 20,
    backgroundColor: theme.colors.card,
  },
  uploadHeader: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  uploadDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  logoCircleModern: {
    backgroundColor: theme.colors.card,
    borderRadius: 48,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    alignSelf: 'center',
  },
  themeSection: {
    marginBottom: 20,
  },
  themeLabel: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  themeCardContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  themeCard: {
    width: 130,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedThemeCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.background,
  },
  themeImage: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.sm,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  themeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  themeImage: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.sm,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  themeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  selectedText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6a0dad',
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    marginTop: 8,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewButtonText: {
    color: theme.colors.card,
    fontSize: 12,
    fontWeight: 'bold',
  },
  noThemesText: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  navigationButton: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    flex: 1,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  prevButton: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  modalFullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalHeader: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  closeButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: theme.colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  noPreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
});