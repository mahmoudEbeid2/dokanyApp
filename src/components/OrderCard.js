import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import theme from "../utils/theme";
import { MaterialIcons } from "@expo/vector-icons";

export default function OrderCard({ name, orderNumber, price, image, status }) {
  const fullName = name || "Unknown Customer";

  const avatarSource = image
    ? typeof image === "string"
      ? { uri: image }
      : image
    : require("../../assets/avtar.jpg");

  let statusIcon = null;
  let statusBg = theme.colors.background;
  let statusColor = theme.colors.textSecondary;
  if (status === "pending") {
    statusIcon = (
      <MaterialIcons
        name="hourglass-empty"
        size={20}
        color={theme.colors.warning}
      />
    );
    statusBg = "#FFF9E5";
    statusColor = theme.colors.warning;
  } else if (status === "processing") {
    statusIcon = (
      <MaterialIcons name="autorenew" size={20} color={theme.colors.primary} />
    );
    statusBg = "#E8EFFF";
    statusColor = theme.colors.primary;
  } else if (status === "shipped") {
    statusIcon = (
      <MaterialIcons
        name="local-shipping"
        size={20}
        color={theme.colors.secondary}
      />
    );
    statusBg = "#F3E8FF";
    statusColor = theme.colors.secondary;
  } else if (status === "delivered") {
    statusIcon = (
      <MaterialIcons
        name="check-circle"
        size={20}
        color={theme.colors.success}
      />
    );
    statusBg = "#E8FCEB";
    statusColor = theme.colors.success;
  } else if (status === "cancelled") {
    statusIcon = (
      <MaterialIcons name="cancel" size={20} color={theme.colors.error} />
    );
    statusBg = "#FFE8E8";
    statusColor = theme.colors.error;
  }

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <Image source={avatarSource} style={styles.avatar} />
      </View>
      <View style={styles.details}>
        <View style={styles.left}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.order}>
            #{orderNumber.split("").splice(0, 11).join("")}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>${price}</Text>
          {statusIcon && (
            <View
              style={[styles.statusIconWrapper, { backgroundColor: statusBg }]}
            >
              {statusIcon}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: 12,
    marginVertical: 6,
    alignItems: "center",
    ...theme.shadow,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  details: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "column",
  },
  name: {
    fontWeight: "bold",
    fontSize: theme.fonts.size.md,
    marginBottom: 4,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  order: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  price: {
    fontSize: theme.fonts.size.md,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 18,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusIconWrapper: {
    marginTop: 4,
    borderRadius: 12,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28,
    minHeight: 28,
  },
});
