import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import ConfirmPasswordScreen from "./src/screens/ConfirmPasswordScreen";
import SplashScreen from "./src/screens/SplashScreen";
import CreateProduct from "./src/screens/createProduct/CreateProduct";
import EditProduct from "./src/screens/editProduct/EditProduct";
import AddCategory from "./src/screens/AddCategory/AddCategory";
import EditCategory from "./src/screens/EditCategory/EditCategory";
import ProductDetails from "./src/screens/ProductDetails/ProductDetails";
import EditSellerProfile from "./src/screens/EditSellerProfile";
import PayoutsScreen from "./src/screens/PayoutsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CustomersListScreen from "./src/screens/Customers/CustomersListScreen";
import AddCustomerScreen from "./src/screens/Customers/AddCustomerScreen";
import CustomerDetailsScreen from "./src/screens/Customers/CustomerDetailsScreen";
import EditCustomerScreen from "./src/screens/Customers/EditCustomerScreen";
import HomeScreen from "./src/screens/HomeScreen";
import OrderDetails from "./src/screens/Orders/OrderDetails";
import CreateCampaignScreen from "./src/screens/Campaign/CreateCampaignScreen";
import CampaignDetailsScreen from "./src/screens/Campaign/CampaignDetailsScreen";

import BottomTabs from "./src/navigation/BottomTabs";
import ContactUsScreen from "./src/screens/ContactUsScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Splash"
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen
            name="ConfirmPassword"
            component={ConfirmPasswordScreen}
          />
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="CreateProduct" component={CreateProduct} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="CreateCategory" component={AddCategory} />
          <Stack.Screen name="EditCategory" component={EditCategory} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="EditSellerProfile"
            component={EditSellerProfile}
          />
          <Stack.Screen name="Payouts" component={PayoutsScreen} />
          <Stack.Screen name="CustomersList" component={CustomersListScreen} />
          <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
          <Stack.Screen
            name="CustomerDetails"
            component={CustomerDetailsScreen}
          />
          <Stack.Screen name="EditCustomer" component={EditCustomerScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
          <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
          <Stack.Screen
            name="ContactUs"
            component={ContactUsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
