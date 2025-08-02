import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import ProductDropdown from "./ProductDropdown";
import { API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from '../../utils/theme';

function AddCoupon({ onAddCoupon, onLoading }) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [daysToExpire, setDaysToExpire] = useState("");
  const [product, setProduct] = useState("");

  async function handleAddCoupon() {
    try {
      const token = await AsyncStorage.getItem("token");

      const today = new Date();
      const expireDate = new Date();
      expireDate.setDate(today.getDate() + parseInt(daysToExpire));

      const response = await fetch(`${API}/api/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          discount_value: parseFloat(discount),
          expiration_date: expireDate.toISOString(),
          product_id: product,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "✅ Coupon added successfully!");
        onAddCoupon(data);
        setCode("");
        setDiscount("");
        setDaysToExpire("");
        setProduct(null);
      } else {
        console.error("❌ Server error:", data);
        Alert.alert(
          "Error",
          data?.message || "Something went wrong while adding the coupon."
        );
      }
    } catch (err) {
      console.error("❌ Error:", err);
      Alert.alert("Error", "Something went wrong while adding the coupon.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a coupon</Text>

      <TextInput
        style={styles.input}
        placeholder="Coupon Code"
        value={code}
        onChangeText={(text) => setCode(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Discount Percentage"
        value={discount}
        keyboardType="numeric"
        onChangeText={(text) => setDiscount(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Valid for (days)"
        value={daysToExpire}
        keyboardType="numeric"
        onChangeText={(text) => setDaysToExpire(text)}
      />

      <ProductDropdown
        value={product}
        onChange={setProduct}
        onLoading={onLoading}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddCoupon}>
        <Text style={styles.buttonText}>Add Coupon</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  title: {
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.regular,
    ...theme.shadow,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginTop: 16,
    ...theme.shadow,
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});

export default AddCoupon;
