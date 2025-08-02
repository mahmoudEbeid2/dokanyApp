import { View, Text, ScrollView } from "react-native";
import CouponItem from "./CouponItem";
import theme from '../../utils/theme';

function DisplayCoupons({ coupon, onDeleteCoupon, onSelectCoupon }) {
  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Text style={{ fontSize: theme.fonts.size.lg, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text, fontFamily: theme.fonts.bold }}>
        Coupons
      </Text>

      {coupon.length === 0 ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: theme.fonts.size.md, color: theme.colors.textSecondary, fontFamily: theme.fonts.regular }}>
            No coupons available at the moment.
          </Text>
        </View>
      ) : (
        <View>
          {coupon.map((item) => (
            <CouponItem
              key={item.id}
              coupon={item}
              onDeleteCoupon={onDeleteCoupon}
              onSelectCoupon={onSelectCoupon}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default DisplayCoupons;
