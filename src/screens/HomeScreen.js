import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatsOverview from "../components/StatsOverview";
import LastOrders from "../components/LastOrders";
import theme from '../utils/theme';
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const dummyData = [];
  const [loading, setLoading] = useState(true);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      clearTimeout(timer);
      subscription?.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      <FlatList
        data={dummyData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <>
            <Text style={styles.overview}>Overview</Text>
            <StatsOverview />
            <LastOrders />
          </>
        }
      />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  header: {
    ...theme.header.container,
  },
  title: {
    ...theme.header.title,
  },
  overview: {
    fontSize: theme.fonts.size.lg,
    fontWeight: '700',
    color: theme.colors.primary,
    paddingHorizontal: 10,
  },
  setting: {
    paddingHorizontal: 10,
  },
  backButton: { 
    padding: 4, 
    marginRight: 8, 
    position: 'absolute', 
    left: 8, 
    zIndex: 2, 
    backgroundColor: theme.colors.card, 
    borderRadius: 20, 
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  headerBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    paddingVertical: 12, 
    marginBottom: 18, 
    marginTop: 8, 
    justifyContent: 'center' 
  },
  headerTitle: { 
    ...theme.header.title,
  },
  settingsButton: { 
    padding: 4, 
    marginLeft: 8, 
    position: 'absolute', 
    right: 8, 
    zIndex: 2, 
    backgroundColor: theme.colors.card, 
    borderRadius: 20, 
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
});
