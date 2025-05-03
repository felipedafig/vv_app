import React from 'react';
import { Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens
import NavigateScreen from '../screens/NavigateScreen';
import StudyRoomScreen from '../screens/StudyRoomScreen';
import FoodScreen from '../screens/FoodScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          elevation: 20,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Black',
          fontSize: 12,
        },
        tabBarIconStyle: {
          width: 32,
          height: 32,
        },
      }}
    >
      <Tab.Screen
        name="Navigate"
        component={NavigateScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/mapIcon.png')}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? '#2563EB' : '#6B7280',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Study Rooms"
        component={StudyRoomScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/bookIcon.png')}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? '#2563EB' : '#6B7280',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Lunch"
        component={FoodScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/icons/foodIcon.png')}
              style={{
                width: 28,
                height: 28,
                tintColor: focused ? '#2563EB' : '#6B7280',
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 