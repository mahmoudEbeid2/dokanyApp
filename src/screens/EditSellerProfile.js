import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "@env";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import theme from "../utils/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function EditSellerProfile() {
  const [token, setToken] = useState(null);
  const [themes, setThemes] = useState([]);
  const navigation = useNavigation();
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const [form, setForm] = useState({
    id: "",
    user_name: "",
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    city: "",
    governorate: "",
    country: "",
    subdomain: "",
    payout_method: "",
    password: "",
    role: "",
    theme_id: "",
    profile_imge: "",
    logo: "",
    image_public_id: "",
    logo_public_id: "",
    faceBook: "",
    instagram: "",
    x: "",
    pinterest: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const authHeader = `Bearer ${storedToken}`;
        setToken(authHeader);

        const sellerRes = await fetch(`${API}/api/seller/id`, {
          headers: { Authorization: authHeader },
        });

        const sellerData = await sellerRes.json();
        setForm({ ...sellerData, password: "" });
        setProfilePreview(sellerData.profile_imge);
        setLogoPreview(sellerData.logo);

        const themeRes = await fetch(`${API}/themes`);
        const themeData = await themeRes.json();
        setThemes(themeData);
      } catch (err) {
        console.log("Error loading data:", err.message);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (type === "profile") {
        setProfilePreview(uri);
      } else if (type === "logo") {
        setLogoPreview(uri);
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "user_name",
      "f_name",
      "email",
      "phone",
      "city",
      "country",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        Alert.alert(
          "Missing Field",
          `Please enter ${field.replace(/_/g, " ")}`
        );
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    if (form.password && form.password.length < 6) {
      Alert.alert("Weak Password", "Password should be at least 6 characters.");
      return false;
    }

    const socialFields = [
      { key: "faceBook", name: "Facebook", base: "https://www.facebook.com/" },
      {
        key: "instagram",
        name: "Instagram",
        base: "https://www.instagram.com/",
      },
      {
        key: "x",
        name: "X (Twitter)",
        bases: ["https://x.com/", "https://www.twitter.com/"],
      },
      {
        key: "pinterest",
        name: "Pinterest",
        base: "https://www.pinterest.com/",
      },
    ];

    for (const field of socialFields) {
      const url = form[field.key];

      if (url) {
        let isValid = false;
        if (field.bases) {
          isValid = field.bases.some(
            (base) => url.startsWith(base) && url.length > base.length
          );
        } else {
          isValid =
            url.startsWith(field.base) && url.length > field.base.length;
        }

        if (!isValid) {
          const validPrefix = field.bases
            ? field.bases.join(" or ")
            : field.base;
          Alert.alert(
            "Invalid Link",
            `The ${field.name} URL is not valid. It must start with "${validPrefix}" followed by your profile name.`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();

      for (let key of [
        "user_name",
        "f_name",
        "l_name",
        "email",
        "phone",
        "city",
        "governorate",
        "country",
        "subdomain",
        "payout_method",
        "role",
        "theme_id",
        "image_public_id",
        "logo_public_id",
        "faceBook",
        "instagram",
        "x",
        "pinterest",
      ]) {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      }

      if (form.password) formData.append("password", form.password);

      if (profilePreview && !profilePreview.startsWith("http")) {
        formData.append("profile_imge", {
          uri: profilePreview,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      if (logoPreview && !logoPreview.startsWith("http")) {
        formData.append("logo", {
          uri: logoPreview,
          type: "image/jpeg",
          name: "logo.jpg",
        });
      }

      const res = await fetch(
        "https://dokany-api-production.up.railway.app/api/seller/update",
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      const rawText = await res.text();
      const data = JSON.parse(rawText);

      if (res.ok) {
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.log("Submit error:", err.message);
      Alert.alert("Error", "An error occurred during the update");
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, "#e8eaf6"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={theme.header.backButton}
          >
            <AntDesign
              name="arrowleft"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.card}>
          <View style={styles.imagesContainer}>
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={() => pickImage("profile")}>
                <Image
                  source={
                    profilePreview
                      ? { uri: profilePreview }
                      : require("../../assets/avtar.jpg")
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <Text style={styles.imageText}>Profile</Text>
            </View>

            <View style={styles.logoWrapper}>
              <TouchableOpacity onPress={() => pickImage("logo")}>
                <Image
                  source={
                    logoPreview
                      ? { uri: logoPreview }
                      : require("../../assets/icon.png")
                  }
                  style={styles.logoImage}
                />
              </TouchableOpacity>
              <Text style={styles.imageText}>Logo</Text>
            </View>
          </View>

          <View style={styles.formFields}>
            {[
              "user_name",
              "f_name",
              "l_name",
              "email",
              "phone",
              "city",
              "governorate",
              "country",
              "subdomain",
              "payout_method",
            ].map((key) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={key.replace(/_/g, " ").toUpperCase()}
                value={form[key]}
                onChangeText={(text) => handleChange(key, text)}
                placeholderTextColor={theme.colors.textSecondary}
              />
            ))}
          </View>

          <Text style={styles.label}>Social Media Links</Text>
          <View style={styles.socialInputContainer}>
            <AntDesign
              name="facebook-square"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialInput}
              placeholder="https://www.facebook.com/username"
              value={form.faceBook}
              onChangeText={(text) => handleChange("faceBook", text)}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          <View style={styles.socialInputContainer}>
            <AntDesign
              name="instagram"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialInput}
              placeholder="https://www.instagram.com/username"
              value={form.instagram}
              onChangeText={(text) => handleChange("instagram", text)}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          <View style={styles.socialInputContainer}>
            <AntDesign
              name="twitter"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialInput}
              placeholder="https://x.com/username"
              value={form.x}
              onChangeText={(text) => handleChange("x", text)}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
          <View style={styles.socialInputContainer}>
            <AntDesign
              name="pinterest"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialInput}
              placeholder="https://www.pinterest.com/username"
              value={form.pinterest}
              onChangeText={(text) => handleChange("pinterest", text)}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <Text style={styles.label}>Select Theme</Text>
          <View style={styles.themeList}>
            {themes.map((themeItem) => (
              <TouchableOpacity
                key={themeItem.id}
                style={[
                  styles.themeCard,
                  form.theme_id === themeItem.id && styles.selectedThemeCard,
                ]}
                onPress={() => handleChange("theme_id", themeItem.id)}
              >
                <Image
                  source={{ uri: themeItem.preview_image }}
                  style={styles.themeImage}
                />
                <Text style={styles.themeName}>{themeItem.name}</Text>
                {form.theme_id === themeItem.id && (
                  <Text style={styles.selectedText}>Selected</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  keyboardAvoidingView: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get("window").height - 100,
  },
  header: { ...theme.header.title, marginBottom: 20, marginTop: 40 },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 10,
  },
  imageContainer: { alignItems: "center", flex: 1 },
  imageText: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
    paddingLeft: 0,
    color: theme.colors.text,
  },
  payoutMethods: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  payoutOption: {
    padding: 10,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  payoutSelected: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.primary,
  },
  payoutText: {
    fontSize: theme.fonts.size.sm,
    textTransform: "capitalize",
    color: theme.colors.text,
  },
  themeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  themeCard: {
    width: 130,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 8,
    alignItems: "center",
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow || "#000",
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
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  selectedText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6a0dad",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 3,
    backgroundColor: "#E8E5F5",
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
    minHeight: Dimensions.get("window").height,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 30,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
    width: "100%",
  },
  avatarWrapper: { alignItems: "center", flex: 1 },
  logoWrapper: { alignItems: "center", flex: 1 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.card,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 8,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 8,
  },
  formFields: { width: "100%", marginBottom: 10 },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 14,
    fontSize: theme.fonts.size.md,
    marginBottom: 14,
    color: theme.colors.text,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.lg,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  imageText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.sm,
    marginTop: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    marginBottom: 12,
    fontWeight: "bold",
    marginTop: 8,
    alignSelf: "flex-start",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 0,
  },
  headerTitle: {
    ...theme.header.title,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: "center",
    flex: 1,
    textAlign: "center",
  },
  socialInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  socialIcon: { marginRight: 10 },
  socialInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
  },
});
