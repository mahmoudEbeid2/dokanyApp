import React, { useState, useEffect } from "react";
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { styles as orderStyles, pickerSelectStyles } from "../../components/Order/style";
import AllOrder from "../../components/Order/AllOrder";
import OrderByStatus from "../../components/Order/OrderByStatus";
import theme from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function OrdersScreen() {
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState("all");
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
        </View>
        <View style={orderStyles.container}>
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <Text style={styles.title}>Orders</Text>
            <View style={styles.placeholder} />
          </View>
          <View style={orderStyles.pikerContinuer}>
            <RNPickerSelect
              value={selectedValue}
              onValueChange={(value) => setSelectedValue(value)}
              placeholder={{ label: "Select order status", value: "" }}
              items={[
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
              ]}
              style={pickerSelectStyles}
            />
          </View>

          {selectedValue === "all" ? (
            <AllOrder />
          ) : (
            <OrderByStatus status={selectedValue} />
          )}
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
  header: {
    ...theme.header.container,
  },
  title: {
    ...theme.header.title,
  },
  placeholder: {
    ...theme.header.placeholder,
  },
});
