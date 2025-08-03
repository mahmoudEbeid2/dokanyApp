import { View, Text, Image, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { customerInfoStyle } from "../../components/Order/OrderDetailsStyle";
import theme from '../../utils/theme';

export default function CustomerInfo({ customer }) {
  return (
    <View style={customerInfoStyle.container}>
      <Text style={customerInfoStyle.title}>Customer Info</Text>
      <View style={customerInfoStyle.info}>
        <Image
          source={{
            uri:
              customer.profile_image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={customerInfoStyle.image}
        />

        <View>
          <Text style={customerInfoStyle.name}>
            {customer.f_name + " " + customer.l_name}
          </Text>
          <Text style={customerInfoStyle.data}>{customer.phone}</Text>
        </View>
      </View>
      <View style={customerInfoStyle.info}>
        <View style={customerInfoStyle.icon}>
          <Entypo name="location-pin" size={30} color={theme.colors.primary} />
        </View>
        <View>
          <Text style={customerInfoStyle.name}>Address</Text>
          <Text style={customerInfoStyle.data}>
            {customer.city +
              " - " +
              customer.governorate +
              " - " +
              customer.countrys}
          </Text>
        </View>
      </View>
    </View>
  );
}
