import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../utils/api/api";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import theme from '../utils/theme';
import { API } from "@env";
import axios from "axios";




export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [loading, setLoading] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      subscription?.remove();
    };
  }, []);

  const handleLogin = async () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await authAPI.post("seller/login", { email, password });

      await AsyncStorage.setItem("token", res.data.token);

      alert("Login successful");
      setErrors({});
      navigation.navigate("MainTabs");
    } catch (err) {
      if (err.response?.data?.error === "Email not verified") {
        setVerificationModal(true);
        return;
      }
      setErrors({
        general: err?.response?.data?.error || "Login failed",
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const apiUrl = `${API}/api/email-verification/resend-user`;

      await axios.post(apiUrl, {
        email: email,
        role: "seller"
      });
      Alert.alert("Success", "Verification email sent successfully! Please check your Email inbox.");
      setVerificationModal(false);
    } catch (error) {
      const errorData = error.response?.data;
      const errorMsg = errorData?.error || "Failed to resend verification email.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={[
                styles.container,
                keyboardVisible && styles.containerKeyboardVisible
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.contentWrapper}>
                <View style={styles.logoCircleModern}>
                  <AntDesign name="user" size={48} color={theme.colors.primary} />
                </View>
                <View style={styles.loginCardModern}>
                  <Text style={styles.title}>Login</Text>
                  {verificationModal && (
                    <View style={styles.alertContainer}>
                      <Text style={styles.alertTitle}>Email Verification Required</Text>
                      <Text style={styles.alertText}>
                        Please check your email and click the verification link to activate your account.
                      </Text>
                      <TouchableOpacity
                        style={[styles.resendButton, loading && styles.resendButtonDisabled]}
                        onPress={handleResendVerification}
                        disabled={loading}
                      >
                        <Text style={styles.resendButtonText}>
                          {loading ? "Sending..." : "Resend Verification Email"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.icon}>
                        <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
                      </View>
                      <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setErrors((prev) => ({ ...prev, email: null }));
                        }}
                        style={[styles.input, errors.email && styles.inputError]}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor={theme.colors.textSecondary}
                        returnKeyType="next"
                      />
                    </View>
                    {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.icon}>
                        <Ionicons name="lock-closed" size={20} color={theme.colors.textSecondary} />
                      </View>
                      <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setErrors((prev) => ({ ...prev, password: null }));
                        }}
                        style={[styles.input, errors.password && styles.inputError]}
                        secureTextEntry
                        placeholderTextColor={theme.colors.textSecondary}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                      />
                    </View>
                    {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                  </View>

                  {errors.general && <Text style={styles.error}>{errors.general}</Text>}

                  <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")} style={styles.linkButton} activeOpacity={0.7}>
                    <Text style={styles.link}>Forgot password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.linkButton} activeOpacity={0.7}>
                    <Text style={styles.link}>
                      Don't have an account?{' '}
                      <Text style={styles.linkBold}>Register</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 50,
    backgroundColor: theme.colors.background,
    minHeight: Dimensions.get('window').height - 100,
  },
  containerKeyboardVisible: {
    paddingBottom: 100,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navigationTitle: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.text,
    marginTop: 10,
    flex: 1,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.text,
  },
  alertContainer: {
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffeaa7",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  alertTitle: {
    color: "#856404",
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertText: {
    color: "#856404",
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: "#007bff",
    color: "white",
    borderWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  resendButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    ...theme.shadow,
    minHeight: 50,
  },
  inputLabel: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: { flex: 1, color: theme.colors.textSecondary, fontSize: theme.fonts.size.sm, backgroundColor: 'transparent' },
  icon: {
    marginRight: 5,
    width: 20,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 8,
    fontSize: theme.fonts.size.xs,
    width: '100%',
    textAlign: 'start',
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  linkButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%',
  },
  link: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
    textAlign: 'center',
  },
  linkBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  loginCardModern: {
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    padding: 32,
    marginBottom: 32,
    width: '100%',
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxWidth: 400,
  },
});
