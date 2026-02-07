import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { VPNProvider } from './src/contexts/VPNContext';
import HomeScreen from './src/screens/HomeScreen';
import ServersScreen from './src/screens/ServersScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddServerScreen from './src/screens/AddServerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ServersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0a0a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ServersList"
        component={ServersScreen}
        options={{ title: 'Мои Серверы' }}
      />
      <Stack.Screen
        name="AddServer"
        component={AddServerScreen}
        options={{ title: 'Добавить Сервер' }}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a1a',
          borderTopColor: '#1a1a3a',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Подключение',
          tabBarLabel: 'Подключение',
        }}
      />
      <Tab.Screen
        name="ServersStack"
        component={ServersStack}
        options={{
          title: 'Серверы',
          tabBarLabel: 'Серверы',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Настройки',
          tabBarLabel: 'Настройки',
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <VPNProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={HomeTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </VPNProvider>
    </SafeAreaProvider>
  );
}

export default App;
