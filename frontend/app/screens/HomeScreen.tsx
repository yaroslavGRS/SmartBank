import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Appbar,
  Text,
  Avatar,
  Card,
  Title,
  List,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const accounts = [
  { id: 1, name: 'Main Account', balance: 5320.75, change: 2.3 },
  { id: 2, name: 'Savings', balance: 10320.99, change: -1.1 },
  { id: 3, name: 'Crypto Wallet', balance: 2150.4, change: 4.5 },
];

const transactions = [
  { id: 1, title: 'Coffee Shop', amount: -4.5, date: 'Apr 5', icon: 'coffee' },
  { id: 2, title: 'Salary', amount: 1200, date: 'Apr 3', icon: 'cash' },
  { id: 3, title: 'Groceries', amount: -67.25, date: 'Apr 2', icon: 'cart' },
  { id: 4, title: 'Netflix', amount: -15.99, date: 'Apr 1', icon: 'filmstrip' },
  { id: 5, title: 'Apple Store', amount: -230, date: 'Mar 29', icon: 'apple' },
  { id: 6, title: 'Amazon', amount: -59.99, date: 'Mar 28', icon: 'cart-outline' },
];

export default function HomeScreen({ navigation }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Dashboard" titleStyle={styles.headerTitle} />
        {user ? (
          <Avatar.Icon size={40} icon="account-circle" style={styles.avatar} />
        ) : (
          <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate('Login')} />
        )}
      </Appbar.Header>
      <View style={styles.staticContent}>
        <Text style={styles.welcomeBlock}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          {user?.email && (
            <Text style={styles.userName}>{"\n"}{user.email} 👋</Text>
          )}
        </Text>

        <Text style={styles.sectionTitle}>Your Bank Cards</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.cardSwiper}
          contentContainerStyle={styles.cardContainer}
        >
          {accounts.map(account => (
            <Card key={account.id} style={styles.bankCard}>
              <Card.Content>
                <Text style={styles.bankCardLabel}>Bank Card</Text>
                <Title style={styles.bankCardBalance}>${account.balance.toFixed(2)}</Title>
                <Text style={styles.bankCardName}>{account.name}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      <ScrollView style={styles.transactionList} contentContainerStyle={{ paddingBottom: 24 }}>
        {transactions.map(tx => (
          <List.Item
            key={tx.id}
            title={tx.title}
            description={tx.date}
            left={props => <List.Icon {...props} icon={tx.icon} />}
            right={props => (
              <Text style={{ alignSelf: 'center', color: tx.amount < 0 ? '#d32f2f' : '#388e3c' }}>
                {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
              </Text>
            )}
            style={styles.transactionItem}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { backgroundColor: '#6200ee', elevation: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  avatar: { backgroundColor: '#fff', marginRight: 10 },
  staticContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  welcomeBlock: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 30,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#666',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6200ee',
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    color: '#333',
  },
  cardSwiper: {
    marginBottom: 28,
  },
  cardContainer: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  bankCard: {
    width: width * 0.82,
    backgroundColor: '#4a148c',
    borderRadius: 20,
    marginRight: 16,
    padding: 18,
    elevation: 4,
  },
  bankCardLabel: {
    color: '#cfcfcf',
    fontSize: 13,
    marginBottom: 10,
  },
  bankCardBalance: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bankCardName: {
    color: '#fff',
    fontSize: 15,
    marginTop: 10,
    opacity: 0.9,
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    paddingHorizontal: 4,
  },
});
