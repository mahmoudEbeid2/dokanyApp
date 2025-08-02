import { View, Text, Image } from "react-native";
import { summaryItemStyle } from "./OrderDetailsStyle";
function SummaryItem({ order }) {
  const product = order.product;
  const imageUrl =
    product.images?.[0]?.image || "https://via.placeholder.com/150";

  return (
    <View style={summaryItemStyle.continuer}>
      <Image source={{ uri: imageUrl }} style={summaryItemStyle.image} />
      <View>
        <Text style={summaryItemStyle.name}>
          {product.title.split(" ").slice(0, 4).join(" ")}
        </Text>
        <Text style={summaryItemStyle.data}>Price: ${order.price}</Text>
        <Text style={summaryItemStyle.data}>Quantity: {order.quantity}</Text>
      </View>
    </View>
  );
}

export default SummaryItem;
