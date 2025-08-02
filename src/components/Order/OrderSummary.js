import { View, Text } from "react-native";
import SummaryItem from "./SummaryItem";
import theme from '../../utils/theme';

function OrderSummary({ orders }) {
  return (
    <View>
      <Text
        style={{
          fontSize: theme.fonts.size.lg,
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 28,
          color: theme.colors.text,
          fontFamily: theme.fonts.bold,
        }}
      >
        Order Summary
      </Text>

      {orders.map((order) => (
        <SummaryItem key={order.id} order={order} />
      ))}
    </View>
  );
}

export default OrderSummary;
