import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import {TransfersScreen} from '../screens/TransfersScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '@screens/SettingsScreen';
import SupportScreen from '@screens/SupportScreen';
import CurrencyRatesScreen from '../screens/CurrencyRatesScreen';



const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
        tabBarStyle: { paddingBottom: 4, height: 60 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
  name="Rates"
  component={CurrencyRatesScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="currency-usd" color={color} size={size} />
    ),
  }}
/>
      <Tab.Screen
        name="Transfers"
        component={TransfersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="swap-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lifebuoy" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
