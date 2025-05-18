import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Text,
} from 'react-native-paper';

import { TransfersView } from '../components/TransfersView';
import { PaymentsView } from '../components/PaymentsView';

const mockAccounts = [
  { id: '1', name: 'Main Account' },
  { id: '2', name: 'Savings' },
  { id: '3', name: 'Crypto Wallet' },
];

const transferTypes = [
  { key: 'internal', label: 'My Accounts', icon: 'swap-horizontal' },
  { key: 'external', label: 'Bank Account', icon: 'bank' },
  { key: 'iban', label: 'IBAN', icon: 'bank-outline' },
  { key: 'card', label: 'Card Number', icon: 'credit-card-outline' },
  { key: 'qr', label: 'Transfers by QR code', icon: 'qrcode-scan' },
];

const ACCENT_COLOR = '#6200ee';

export function TransfersScreen() {
  const [isTransferMode, setIsTransferMode] = useState(true);

  const [type, setType] = useState<'internal' | 'external' | 'iban' | 'card' | 'qr'>('internal');
  const [fromAccount, setFromAccount] = useState('1');
  const [toAccount, setToAccount] = useState('2');
  const [recipient, setRecipient] = useState('');
  const [sourceAccount, setSourceAccount] = useState('1');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [paymentsHistory, setPaymentsHistory] = useState<any[]>([]);

  const [paymentTemplates, setPaymentTemplates] = useState<any[]>([]);
  const [autoPayments, setAutoPayments] = useState<any[]>([]);
  const [scheduledBills, setScheduledBills] = useState<any[]>([]);
  const fetchServices = async () => {
    setLoadingServices(true);

    setTimeout(() => {
      setServices([
        { id: 'gas', category: 'utility', title: 'Gas Payment', amountDue: 50.2 },
        { id: 'water', category: 'utility', title: 'Water Bill', amountDue: 22.75 },
        { id: 'electricity', category: 'utility', title: 'Electricity', amountDue: 73.0 },

        { id: 'vodafone', category: 'mobile', title: 'Vodafone Plan', amountDue: 15.0 },
        { id: 'lifecell', category: 'mobile', title: 'Lifecell Monthly', amountDue: 10.0 },
        { id: 'kyivstar', category: 'mobile', title: 'Kyivstar Prepaid', amountDue: 7.5 },

        { id: 'home_net', category: 'internet', title: 'Home Net ISP', amountDue: 20.0 },
        { id: 'triolan', category: 'internet', title: 'Triolan Bill', amountDue: 12.5 },
      ]);

      setPaymentTemplates([
        { id: 'pt1', title: 'Monthly Gas Template', amount: 50, account: 'Main Account' },
        { id: 'pt2', title: 'Vodafone Plan Template', amount: 15, account: 'Savings' },
      ]);

      setAutoPayments([
        { id: 'ap1', title: 'Water Auto Payment', interval: 'Monthly', nextDate: 'May 15', amount: 22.75 },
        { id: 'ap2', title: 'Kyivstar Auto Payment', interval: 'Monthly', nextDate: 'May 20', amount: 7.5 },
      ]);

      setScheduledBills([
        { id: 'sb1', title: 'Electricity (Scheduled)', dueDate: 'May 25', amount: 73.0 },
        { id: 'sb2', title: 'Home Net ISP (Scheduled)', dueDate: 'May 30', amount: 20.0 },
      ]);

      setLoadingServices(false);
    }, 1200);
  };

  useEffect(() => {
    if (!isTransferMode) {
      fetchServices();
    }
  }, [isTransferMode]);

  const handlePayBiller = (service: any) => {
    const paymentRecord = {
      id: Date.now(),
      serviceId: service.id,
      title: service.title,
      amount: service.amountDue,
      date: new Date().toDateString().slice(4),
    };
    setPaymentsHistory([paymentRecord, ...paymentsHistory]);
    setServices(prev => prev.filter(s => s.id !== service.id));
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setIsTransferMode(true)}
            style={[styles.tabButton, isTransferMode && styles.activeTab]}
          >
            <Text style={[styles.tabButtonText, isTransferMode && styles.activeTabText]}>
              Transfers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsTransferMode(false)}
            style={[styles.tabButton, !isTransferMode && styles.activeTab]}
          >
            <Text style={[styles.tabButtonText, !isTransferMode && styles.activeTabText]}>
              Payments
            </Text>
          </TouchableOpacity>
        </View>
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {isTransferMode ? (
            <TransfersView
              transferTypes={transferTypes}
              mockAccounts={mockAccounts}

              type={type}
              setType={setType}
              fromAccount={fromAccount}
              setFromAccount={setFromAccount}
              toAccount={toAccount}
              setToAccount={setToAccount}
              recipient={recipient}
              setRecipient={setRecipient}
              sourceAccount={sourceAccount}
              setSourceAccount={setSourceAccount}
              amount={amount}
              setAmount={setAmount}
              comment={comment}
              setComment={setComment}
              history={history}
              setHistory={setHistory}
              templates={templates}
              setTemplates={setTemplates}

              styles={styles}
              ACCENT_COLOR={ACCENT_COLOR}
            />
          ) : (
            <PaymentsView
              loadingServices={loadingServices}
              services={services}
              paymentsHistory={paymentsHistory}
              handlePayBiller={handlePayBiller}
              paymentTemplates={paymentTemplates}
              autoPayments={autoPayments}
              scheduledBills={scheduledBills}

              styles={styles}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTab: {
    backgroundColor: ACCENT_COLOR,
  },
  activeTabText: {
    color: '#fff',
  },
  scroll: {
    padding: 16,
  },
  switchTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  transferGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  transferOption: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  activeOption: {
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
  },
  optionIcon: {
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  accountIcon: {},
  accountInfo: {
    marginLeft: 10,
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  accountsList: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  accountChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  accountChipActive: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  accountChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  accountChipTextActive: {
    color: '#fff',
  },
  transferArrow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  recipientInput: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  amountBlock: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  amountField: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  amountHelper: {
    textAlign: 'center',
    marginTop: 4,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  confirmButton: {
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  templateButton: {
    marginTop: 2,
  },
  divider: {
    marginVertical: 20,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  templateCard: {
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
});
