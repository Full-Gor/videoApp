import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  HomeScreen,
  TrimVideoScreen,
  MergeVideosScreen,
  ResizeVideoScreen,
  AddTextScreen,
  AddMusicScreen,
  CompressVideoScreen,
  SpeedVideoScreen,
  RotateVideoScreen,
  CropVideoScreen,
  FilterVideoScreen,
  ExportScreen,
  ProjectsScreen,
  SettingsScreen,
} from '../screens';
import { COLORS } from '../constants/theme';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundLight,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          tabBarLabel: 'Projets',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-video" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Paramètres',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="TrimVideo" component={TrimVideoScreen} />
        <Stack.Screen name="MergeVideos" component={MergeVideosScreen} />
        <Stack.Screen name="ResizeVideo" component={ResizeVideoScreen} />
        <Stack.Screen name="AddText" component={AddTextScreen} />
        <Stack.Screen name="AddMusic" component={AddMusicScreen} />
        <Stack.Screen name="CompressVideo" component={CompressVideoScreen} />
        <Stack.Screen name="SpeedVideo" component={SpeedVideoScreen} />
        <Stack.Screen name="RotateVideo" component={RotateVideoScreen} />
        <Stack.Screen name="CropVideo" component={CropVideoScreen} />
        <Stack.Screen name="FilterVideo" component={FilterVideoScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
