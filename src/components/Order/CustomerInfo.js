import { View, Text, Image, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { customerInfoStyle } from "../../components/Order/OrderDetailsStyle";
import theme from '../../utils/theme';

export default function CustomerInfo({ customer }) {
  const getCustomerName = (customer) => {
    if (customer) {
      if (customer.f_name && customer.l_name) {
        return `${customer.f_name} ${customer.l_name}`;
      } else if (customer.name) {
        return customer.name;
      } else if (customer.first_name && customer.last_name) {
        return `${customer.first_name} ${customer.last_name}`;
      } else if (customer.f_name) {
        return customer.f_name;
      } else if (customer.l_name) {
        return customer.l_name;
      }
    }
    return "Customer Account";
  };

  const getCustomerImage = (customer) => {
    if (customer) {
      // Check multiple possible field names
      if (customer.profile_imge) {
        return customer.profile_imge;
      } else if (customer.profile_image) {
        return customer.profile_image;
      } else if (customer.image) {
        return customer.image;
      } else if (customer.avatar) {
        return customer.avatar;
      }
    }
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  const getCustomerAddress = (customer) => {
    if (customer) {
      const parts = [];
      if (customer.city) parts.push(customer.city);
      if (customer.governorate) parts.push(customer.governorate);
      if (customer.country) parts.push(customer.country);
      if (customer.countrys) parts.push(customer.countrys);
      
      return parts.length > 0 ? parts.join(" - ") : "Address not available";
    }
    return "Address not available";
  };

  return (
    <View style={customerInfoStyle.container}>
      <Text style={customerInfoStyle.title}>Customer Info</Text>
      <View style={customerInfoStyle.info}>
        <Image
          source={{
            uri: getCustomerImage(customer),
          }}
          style={customerInfoStyle.image}
          defaultSource={require('../../../assets/avtar.jpg')}
        />

        <View>
          <Text style={customerInfoStyle.name}>
            {getCustomerName(customer)}
          </Text>
          <Text style={customerInfoStyle.data}>{customer?.phone || "Phone not available"}</Text>
        </View>
      </View>
      <View style={customerInfoStyle.info}>
        <View style={customerInfoStyle.icon}>
          <Entypo name="location-pin" size={30} color={theme.colors.primary} />
        </View>
        <View>
          <Text style={customerInfoStyle.name}>Address</Text>
          <Text style={customerInfoStyle.data}>
            {getCustomerAddress(customer)}
          </Text>
        </View>
      </View>
    </View>
  );
}
