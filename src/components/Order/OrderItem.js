import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import theme from '../../utils/theme';
function OrderItem({ order }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("OrderDetails", { order });
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.continuer}>
        <View style={styles.contentContinuer}>
          <View>
            <Image
              source={{
                uri: `${
                  order.customer.profile_image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }`,
              }}
              style={styles.image}
            />
          </View>
          <View>
            <Text style={styles.name}>
              {order.customer.f_name + " " + order.customer.l_name}
            </Text>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  contentContinuer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  name: {
    fontWeight: 'bold',
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
