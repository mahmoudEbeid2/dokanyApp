import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import theme from '../utils/theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // If the token is found, navigate to the settings screen
          navigation.reset({
            index: 0,
            routes: [{ name: "Settings" }],
          });
        } else {
          // If the token is not found, navigate to the login screen
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      } catch (error) {
        console.log("Error reading token", error);
        navigation.navigate("Login");
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
