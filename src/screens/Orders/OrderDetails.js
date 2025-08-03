import CustomerInfo from "../../components/Order/CustomerInfo";
import {
  View,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import theme from "../../utils/theme";
import { styles as orderDetailsStyles } from "../../components/Order/OrderDetailsStyle";
import OrderSummary from "../../components/Order/OrderSummary";
import OrderStatus from "../../components/Order/OrderStatus";
import { useRoute, useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;
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

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
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
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={theme.header.placeholder} />
        </View>

        {/* Content Section */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <CustomerInfo customer={order.customer} />
          <OrderSummary orders={order.items} />
          <OrderStatus status={order.order_status} order_id={order.id} />
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
  headerContainer: {
    ...theme.header.container,
    paddingTop: 20,
    marginTop: 15,
  },
  headerTitle: {
    ...theme.header.title,
    fontSize: theme.fonts.size.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});
