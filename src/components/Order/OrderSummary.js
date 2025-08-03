import { View, Text } from "react-native";
import SummaryItem from "./SummaryItem";
import { summaryItemStyle } from "./OrderDetailsStyle";
import theme from '../../utils/theme';

function OrderSummary({ orders }) {
  return (
    <View style={summaryItemStyle.container}>
      <Text style={summaryItemStyle.title}>
        Order Summary
      </Text>

      {orders.map((order) => (
        <SummaryItem key={order.id} order={order} />
      ))}
    </View>
  );
}

export default OrderSummary;
