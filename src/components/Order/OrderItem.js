import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import theme from "../../utils/theme";
import { API } from "@env";
function OrderItem({ order }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("OrderDetails", { order });
  };

  const getCustomerName = (order) => {
    if (order.customer) {
      if (order.customer.f_name && order.customer.l_name) {
        return `${order.customer.f_name} ${order.customer.l_name}`;
      } else if (order.customer.name) {
        return order.customer.name;
      } else if (order.customer.first_name && order.customer.last_name) {
        return `${order.customer.first_name} ${order.customer.last_name}`;
      } else if (order.customer.f_name) {
        return order.customer.f_name;
      } else if (order.customer.l_name) {
        return order.customer.l_name;
      }
    }
    return "Customer Account";
  };

  const getCustomerImage = (order) => {
    if (order.customer) {
      let imageUrl = null;

      if (order.customer.profile_imge) {
        imageUrl = order.customer.profile_imge;
      } else if (order.customer.profile_image) {
        imageUrl = order.customer.profile_image;
      } else if (order.customer.image) {
        imageUrl = order.customer.image;
      } else if (order.customer.avatar) {
        imageUrl = order.customer.avatar;
      }

      if (imageUrl) {
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          return imageUrl;
        } else if (imageUrl.startsWith("/")) {
          return `${API}${imageUrl}`;
        }
      }
    }
    return "https://ui-avatars.com/api/?name=User&background=6c63ff&color=fff&size=200&rounded=true&bold=true";
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.continuer}>
        <View style={styles.contentContinuer}>
          <View>
            <Image
              source={{
                uri: getCustomerImage(order),
              }}
              style={styles.image}
              defaultSource={require("../../../assets/avtar.jpg")}
            />
          </View>
          <View>
            <Text style={styles.name}>{getCustomerName(order)}</Text>
            <Text style={styles.price}>{"$" + order.total_price} </Text>
          </View>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={20} color="gray" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  continuer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  contentContinuer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  name: {
    fontWeight: "bold",
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  price: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.regular,
  },
});

export default OrderItem;
