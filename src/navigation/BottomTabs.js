// src/navigation/BottomTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StatusBar } from "react-native";
import theme from "../utils/theme";

import ProductsAndCategories from "../screens/ProductsAndCategoriesScreen";
import OrdersScreen from "../screens/Orders/OrderScreen";
import CustomersScreen from "../screens/Customers/CustomersListScreen";
import CouponsScreen from "../screens/Coupon/CouponScreen";
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Orders":
              iconName = "list";
              break;
            case "Products":
              iconName = "cube";
              break;
            case "Customers":
              iconName = "people";
              break;
            case "Coupons":
              iconName = "pricetags-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4F479E",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: 'flex',
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarHideOnKeyboard: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarVisible: true,
          tabBarStyle: { display: 'flex' },
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarVisible: true,
          tabBarStyle: { display: 'flex' },
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsAndCategories}
        options={{
          tabBarVisible: true,
          tabBarStyle: { display: 'flex' },
        }}
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomersScreen}
        options={{
          tabBarVisible: true,
          tabBarStyle: { display: 'flex' },
        }}
      />
      <Tab.Screen 
        name="Coupons" 
        component={CouponsScreen}
        options={{
          tabBarVisible: true,
          tabBarStyle: { display: 'flex' },
        }}
      />
    </Tab.Navigator>
    </SafeAreaView>
  );
}
