import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import theme from '../../utils/theme';

function CouponItem({ coupon, onDeleteCoupon, onSelectCoupon }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.code}>{coupon.code}</Text>
        <Text style={styles.date}>
          Expires on{" "}
          {new Date(coupon.expiration_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => onSelectCoupon({ ...coupon })}>
          <MaterialIcons name="edit" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteCoupon(coupon.id)}>
          <MaterialIcons name="delete-forever" size={28} color="tomato" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    padding: 15,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    ...theme.shadow,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  code: {
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 1,
    fontFamily: theme.fonts.bold,
  },
  date: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
  },
});

export default CouponItem;
