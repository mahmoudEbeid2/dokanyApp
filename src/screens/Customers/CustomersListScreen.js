import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { sellerAPI } from "../../utils/api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from '../../utils/theme';

const CustomersListScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchCustomers = async () => {
        try {
          setLoading(true);
          const response = await sellerAPI.get("/api/seller/customers");
          const fetchedCustomers = response.data || [];
          setCustomers(fetchedCustomers);
          // Set filtered customers here as well to reflect the latest fetch
          setFilteredCustomers(fetchedCustomers);
        } catch (error) {
          console.error("Failed to fetch customers:", error);
          Alert.alert("Error", "Failed to fetch customers from the server.");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomers();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        `${customer.f_name} ${customer.l_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const renderCustomerItem = ({ item }) => {
    const imageSource = item.profile_imge
      ? { uri: item.profile_imge }
      : require("../../../assets/CustomerImage.png");

    return (
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() =>
          navigation.navigate("CustomerDetails", { customer: item })
        }
      >
        <Image source={imageSource} style={styles.avatar} />
        <View style={styles.customerInfo}>
          <Text
            style={styles.customerName}
          >{`${item.f_name} ${item.l_name}`}</Text>
          <Text style={styles.customerRegistered}>@{item.user_name}</Text>
        </View>
        <Feather name="chevron-right" size={24} color="#C0C0C0" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={{ paddingTop: 8, paddingBottom: 8, minHeight: 120 }}>
        <Text style={styles.mainTitle}>Customers</Text>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={22} color={theme.colors.textSecondary} />
          <TextInput
            placeholder="Search customers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>
      
      {filteredCustomers.length === 0 && !loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ 
            textAlign: 'center', 
            color: theme.colors.textSecondary, 
            fontSize: theme.fonts.size.lg,
            fontWeight: 'bold'
          }}>
            No customers found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 0, paddingHorizontal: 15 }}
          style={{ flex: 1 }}
        />
      )}
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddCustomer")}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 0,
  },
  title: {
    ...theme.header.title,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
  },
  backButton: { 
    padding: 4, 
    marginRight: 8, 
    position: 'absolute', 
    left: 8, 
    zIndex: 2, 
    backgroundColor: theme.colors.card, 
    borderRadius: 20, 
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'stretch',
    marginTop: 0,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.size.md,
    backgroundColor: 'transparent',
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  customerRegistered: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  fab: {
    ...theme.fab,
  },
  mainTitle: {
    fontSize: theme.fonts.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default CustomersListScreen;
