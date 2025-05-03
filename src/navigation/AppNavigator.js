import React from 'react';
import { Platform, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SplashScreen from '../components/SplashScreen';

import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import RoomOverviewScreen from '../screens/RoomOverviewScreen';
import MapScreen from '../screens/MapScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainApp"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomOverview"
        component={RoomOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RouteSelection"
        component={RouteSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
} 