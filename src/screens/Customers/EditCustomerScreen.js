import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { sellerAPI } from "../../utils/api/api";
import {
  validateName,
  validateUsername,
  validatePassword,
} from "../../utils/validation";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import theme from '../../utils/theme';

const EditCustomerScreen = ({ route, navigation }) => {
  const { customer } = route.params;

  const [f_name, setFName] = useState(customer.f_name);
  const [l_name, setLName] = useState(customer.l_name);
  const [userName, setUserName] = useState(customer.user_name);
  const [email, setEmail] = useState(customer.email);
  const [phone, setPhone] = useState(customer.phone);
  const [city, setCity] = useState(customer.city);
  const [governorate, setGovernorate] = useState(customer.governorate);
  const [country, setCountry] = useState(customer.country);
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleSaveChanges = async () => {
    const nameError = validateName(f_name, "First Name");
    const lastNameError = validateName(l_name, "Last Name");
    const usernameError = validateUsername(userName);
    const passwordError = validatePassword(password, false);

    const newErrors = {
      f_name: nameError,
      l_name: lastNameError,
      userName: usernameError,
      password: passwordError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== null)) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("f_name", f_name);
    formData.append("l_name", l_name);
    formData.append("user_name", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("governorate", governorate);
    formData.append("country", country);

    if (password) {
      formData.append("password", password);
    }

    if (image) {
      let filename = image.uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("profile_imge", { uri: image.uri, name: filename, type });
    }

    try {
      await sellerAPI.put(`seller/customers/${customer.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Update customer data with new information
      const updatedCustomer = {
        ...customer,
        f_name,
        l_name,
        user_name: userName,
        email,
        phone,
        city,
        governorate,
        country,
        profile_imge: image ? image.uri : customer.profile_imge
      };
      
      Alert.alert(
        "Success", 
        "Customer details updated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to customer details screen with updated data
              navigation.navigate("CustomerDetails", { 
                customer: updatedCustomer,
                fromEdit: true 
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update customer."
      );
    } finally {
      setLoading(false);
    }
  };

  const imageSource = image
    ? { uri: image.uri }
    : customer.profile_imge
    ? { uri: customer.profile_imge }
    : require("../../../assets/CustomerImage.png");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[theme.header.backButton, { marginLeft: 15 }]}
        >
          <AntDesign name="arrowleft" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Customer</Text>
        <View style={{ width: 40 }} />
      </View>
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <TouchableOpacity
          style={styles.editAvatarContainer}
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });
            if (!result.canceled) setImage(result.assets[0]);
          }}
        >
          <Image source={imageSource} style={styles.editAvatar} />
          <Text style={styles.editAvatarSubtitle}>
            Tap to change profile photo
          </Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={f_name}
            onChangeText={setFName}
          />
          {errors.f_name && (
            <Text style={styles.errorText}>{errors.f_name}</Text>
          )}

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={l_name}
            onChangeText={setLName}
          />
          {errors.l_name && (
            <Text style={styles.errorText}>{errors.l_name}</Text>
          )}

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
          />
          {errors.userName && (
            <Text style={styles.errorText}>{errors.userName}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

            <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
              value={city}
              onChangeText={setCity}
          />

          <Text style={styles.label}>Governorate</Text>
          <TextInput
            style={styles.input}
            value={governorate}
            onChangeText={setGovernorate}
          />

            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />

            <Text style={styles.label}>New Password (Optional)</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.formFooter}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSaveChanges}
          disabled={loading}
        >
          {loading ? (
              <ActivityIndicator color={theme.colors.card} />
          ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 10,
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
  form: {
    padding: 10,
  },
  label: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    padding: 15,
    fontSize: theme.fonts.size.md,
    marginBottom: 20,
    color: theme.colors.textSecondary,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  formFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
  },
  editAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  editAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: theme.colors.border,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editAvatarSubtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: -15,
    marginBottom: 10,
    fontSize: theme.fonts.size.xs,
  },
});

export default EditCustomerScreen;
