import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Appbar,
  Text,
  List,
  Avatar,
  Switch,
  Button,
  Divider,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ua'>('en');

  const handleLogout = () => dispatch(logout());

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <View style={styles.profile}>
          <Avatar.Icon size={64} icon="account" />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.email}>{user?.email}</Text>
            <Button mode="text" onPress={() => console.log('Edit Profile')}>
              Edit Profile
            </Button>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Security */}
        <Text style={styles.sectionTitle}>Security</Text>
        <List.Item
          title="Change Password"
          left={props => <List.Icon {...props} icon="lock-reset" />}
          onPress={() => console.log('Change password')}
        />
        <List.Item
          title="Two-Factor Authentication"
          left={props => <List.Icon {...props} icon="shield-lock-outline" />}
          onPress={() => console.log('Enable 2FA')}
        />

        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>Interface</Text>
        <List.Item
          title="Dark Theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch value={darkTheme} onValueChange={setDarkTheme} />
          )}
        />
        <List.Item
          title="Notifications"
          left={props => <List.Icon {...props} icon="bell-outline" />}
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
        <List.Item
          title="Language"
          description={language === 'en' ? 'English' : 'Українська'}
          left={props => <List.Icon {...props} icon="translate" />}
          onPress={() => setLanguage(prev => (prev === 'en' ? 'ua' : 'en'))}
        />
        <Button
          icon="logout"
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#d32f2f"
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    marginVertical: 16,
  },
  logoutButton: {
    marginTop: 24,
    borderRadius: 12,
    borderColor: '#d32f2f',
  },
});
