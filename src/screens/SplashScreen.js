import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, Animated, Easing, ActivityIndicator, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import theme from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      setTimeout(() => {
        navigation.replace(token ? "MainTabs" : "Login");
      }, 2000);
    };
    checkAuth();
  }, []);

  return (
    <LinearGradient colors={[theme.colors.accent, theme.colors.primary, theme.colors.secondary]} start={{x:0.2, y:0.1}} end={{x:0.8, y:1}} style={styles.gradientBg}>
      <View style={styles.container}>
        <Animated.View style={[styles.iconCircleStrong, { transform: [{ scale: scaleAnim }] }]}>
          <FontAwesome5 name="store" size={84} color={theme.colors.primary} />
        </Animated.View>
        <Text style={styles.titleStrong}>Dokany</Text>
        <Text style={styles.taglineStrong}>Your Modern Storefront</Text>
        <ActivityIndicator size={48} color={theme.colors.accent} style={{ marginTop: 40 }} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg: { flex: 1 },
  iconCircle: { backgroundColor: theme.colors.card, borderRadius: 60, width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 8 },
  title: { fontSize: theme.fonts.size.xxl, color: theme.colors.primary, letterSpacing: 2, fontWeight: 'bold', marginBottom: 8 },
  tagline: { fontSize: theme.fonts.size.md, color: theme.colors.textSecondary, marginTop: 2 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircleStrong: { backgroundColor: theme.colors.card, borderRadius: 80, width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 36, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 16, borderWidth: 3, borderColor: theme.colors.primary },
  titleStrong: { fontSize: 44, color: '#fff', letterSpacing: 6, fontWeight: 'bold', marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: {width: 0, height: 4}, textShadowRadius: 12, textAlign: 'center' },
  taglineStrong: { fontSize: theme.fonts.size.md, color: 'rgba(255,255,255,0.7)', marginTop: 24, letterSpacing: 1, fontStyle: 'italic', fontWeight: '300', textAlign: 'center' },
});
