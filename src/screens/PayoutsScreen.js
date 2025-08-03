import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sellerAPI } from '../utils/api/api';
import { AntDesign } from '@expo/vector-icons';
import theme from '../utils/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PayoutsScreen({ route, navigation }) {
    const { sellerId, payoutMethod } = route.params;
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [payouts, setPayouts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [summary, setSummary] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
    
    const totalNotPaidPayouts = payouts.filter(item=>item.status.toLowerCase()==="pending").reduce((acc, item) => acc + parseFloat(item.amount), 0);
    

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenHeight(window.height);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const res = await sellerAPI.get('api/payouts/seller/');
            setPayouts(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to fetch payouts');
        }
        setLoading(false);
    };

    const fetchEarningsSummary = async () => {
        try {
            const res = await sellerAPI.get('api/seller/earnings-summary');
            setSummary(res.data);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load earnings summary');
        }
    };

    const handleSubmit = async () => {
        if (!amount) {
            Alert.alert('Validation', 'Please fill in the amount field');
            return;
        }

        if (amount > (summary.remaining_balance - totalNotPaidPayouts)) {
            Alert.alert('Request Failed', 'You do not have enough balance for this payout');
            return;
        }

        setSubmitting(true);
        try {
            await sellerAPI.post('api/payouts', {
                amount: parseFloat(amount),
                payout_method: payoutMethod,
                seller_id: sellerId,
            });

            Alert.alert('Success', 'Payout request submitted');
            setAmount('');
            setModalVisible(false);
            fetchPayouts();
            fetchEarningsSummary();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err?.response?.data?.message || 'Submission failed');
        }
        setSubmitting(false);
    };

    useEffect(() => {
        fetchEarningsSummary();
        fetchPayouts();
    }, []);

    const renderPayoutItem = ({ item }) => {
                            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                            const status = item.status.toLowerCase();
                            const displayStatus = capitalize(item.status);
                            let statusColor, statusIcon, statusBg;
        
                            if (status === 'pending') {
                                statusColor = theme.colors.warning;
                                statusBg = '#FFF9E5';
                                statusIcon = <View style={[styles.statusCircle, { backgroundColor: statusBg }]}><MaterialIcons name="schedule" size={18} color={statusColor} /></View>;
                            } else if (status === 'paid') {
                                statusColor = theme.colors.success;
                                statusBg = '#E6F9ED';
                                statusIcon = <View style={[styles.statusCircle, { backgroundColor: statusBg }]}><MaterialIcons name="check-circle" size={18} color={statusColor} /></View>;
                            } else {
                                statusColor = theme.colors.error;
                                statusBg = '#FFE6E6';
                                statusIcon = <View style={[styles.statusCircle, { backgroundColor: statusBg }]}><MaterialIcons name="error" size={18} color={statusColor} /></View>;
                            }
        
                            return (
                                <View style={styles.payoutCard}>
                                    <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
                                    <View style={styles.payoutRow}>
                                        <View style={styles.amountIconGroup}>
                                            {statusIcon}
                                            <Text style={styles.payoutAmount}>$ {item.amount}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
                                            <Text style={[styles.payoutStatus, { color: statusColor }]}>{displayStatus}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
            
            {/* Simple Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={theme.header.backButton}
                    activeOpacity={0.7}
                >
                    <AntDesign name="arrowleft" size={22} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>Payouts</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    data={payouts}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.headerContent}>
                            <Text style={styles.sectionTitle}>Earnings</Text>
                            {summary && (
                                <View style={styles.summaryContainer}>
                                    <View style={styles.balanceInfo}>
                                        <Text style={styles.summaryText}>$ {summary.remaining_balance.toFixed(3)}</Text>
                                        <Text style={styles.balanceLabel}>Available Balance</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.requestPayoutButton}
                                        activeOpacity={0.8}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <MaterialIcons name="account-balance" size={20} color={theme.colors.card} />
                                        <Text style={styles.requestPayoutButtonText}>Request Withdrawal</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text style={styles.historyTitle}>Withdrawal History</Text>
                        </View>
                    }
                    renderItem={renderPayoutItem}
                />
            )}

            {/* Modal */}
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <MaterialIcons name="account-balance" size={24} color={theme.colors.primary} />
                                <Text style={styles.modalTitle}>New Payout Request</Text>
                            </View>
                            <TextInput
                                placeholder="Enter amount"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            style={styles.modalInput}
                            placeholderTextColor={theme.colors.textSecondary}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleSubmit}
                                disabled={submitting}
                                activeOpacity={0.7}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={theme.colors.card} />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 10,
    },
    header: {
        ...theme.header.container,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 10,
        width: '100%',
        paddingHorizontal: 0,
        paddingLeft: 15,
    },
    backButton: {
        ...theme.header.backButton,
    },
    title: {
        ...theme.header.title,
        marginTop: 0,
        marginBottom: 0,
        alignSelf: 'center',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        ...theme.header.placeholder,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContent: {
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 16,
    },
    summaryContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    balanceInfo: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 16,
    },
    summaryText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 8,
    },
    balanceLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    requestPayoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    requestPayoutButtonText: {
        color: theme.colors.card,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 20,
        marginBottom: 16,
    },
    payoutCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    statusBar: {
        height: 4,
        width: '100%',
    },
    payoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    amountIconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    payoutAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    payoutStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        padding: 24,
        width: '85%',
        shadowColor: theme.colors.shadow || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 12,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 20,
        backgroundColor: theme.colors.background,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: theme.colors.border,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    submitButtonText: {
        color: theme.colors.card,
        fontSize: 16,
        fontWeight: '600',
    },
});



