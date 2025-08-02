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
        <ScrollView
          contentContainerStyle={orderDetailsStyles.container}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
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
            <Text
              style={[
                orderDetailsStyles.title,
                { flex: 1, textAlign: "center", marginRight: 24 },
              ]}
            >
              Order Details
            </Text>
          </View>

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
});
