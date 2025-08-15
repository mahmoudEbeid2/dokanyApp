import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import theme from "../utils/theme";
import { sellerAPI } from "../utils/api/api";

export default function ContactUsScreen({ route, navigation }) {
  const { sellerName, sellerEmail } = route.params;

  const [name, setName] = useState(sellerName || "");
  const [email, setEmail] = useState(sellerEmail || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!name || !email || !message) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await sellerAPI.post("/api/contact/general", {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        if (Platform.OS === "android") {
          ToastAndroid.show("Message sent successfully!", ToastAndroid.SHORT);
        } else {
          Alert.alert("Success", "Your message has been sent successfully.");
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while sending the message.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.headerTitle}>Contact Us</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.description}>
            Have a question or need support? Fill out the form below and our
            team will get back to you as soon as possible.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="How can we help you?"
              multiline
              numberOfLines={6}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
  },
  headerTitle: {
    ...theme.header.title,
    flex: 1,
    textAlign: "center",
  },
  description: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: theme.fonts.size.md,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: theme.colors.shadow || "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.primaryMuted,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: theme.fonts.size.lg,
    fontWeight: "bold",
  },
});
