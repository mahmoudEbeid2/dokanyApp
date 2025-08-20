import { useState, useRef, useEffect } from "react";
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

function UpdateCoupon({ coupon, onUpdateCoupon, onLoading }) {
  const [code, setCode] = useState(coupon.code);
  const [discount, setDiscount] = useState(coupon.discount_value.toString());
  const [daysToExpire, setDaysToExpire] = useState(() => {
    if (!coupon.expiration_date) return "0";

    const today = new Date();
    const expireDate = new Date(coupon.expiration_date);

    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const expireMidnight = new Date(
      expireDate.getFullYear(),
      expireDate.getMonth(),
      expireDate.getDate()
    );

    const diffInMs = expireMidnight - todayMidnight;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays > 0 ? diffInDays.toString() : "0";
  });

  const [product, setProduct] = useState(coupon.product_id);

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  async function handleUpdateCoupon() {
    try {
      const token = await AsyncStorage.getItem("token");

      const today = new Date();
      const days = parseInt(daysToExpire);
      const expireDate = new Date();
      expireDate.setDate(today.getDate() + (isNaN(days) ? 0 : days));

      const response = await fetch(`${API}/coupon/${coupon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          discount_value: isNaN(parseFloat(discount))
            ? 0
            : parseFloat(discount),
          expiration_date: expireDate.toISOString(),
          product_id: product,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", " ✅ Coupon updated successfully!");
        onUpdateCoupon(data);
      } else {
        console.error("❌ Server error:", data);
        Alert.alert(
          "Error",
          data?.message || "Something went wrong while updating the coupon."
        );
      }
    } catch (err) {
      console.error("❌ Error:", err);
      Alert.alert("Error", "Something went wrong while updating the coupon.");
    }
  }

  useEffect(() => {
    setCode(coupon.code);
    setDiscount(coupon.discount_value.toString());
    setDaysToExpire(() => {
      if (!coupon.expiration_date) return "0";

      const today = new Date();
      const expireDate = new Date(coupon.expiration_date);

      const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const expireMidnight = new Date(
        expireDate.getFullYear(),
        expireDate.getMonth(),
        expireDate.getDate()
      );

      const diffInMs = expireMidnight - todayMidnight;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      return diffInDays > 0 ? diffInDays.toString() : "0";
    });

    setProduct(coupon.product_id);
  }, [coupon]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Coupon</Text>

      <TextInput
        ref={codeInputRef}
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

      <TouchableOpacity style={styles.button} onPress={handleUpdateCoupon}>
        <Text style={styles.buttonText}>Update Coupon</Text>
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

export default UpdateCoupon;
