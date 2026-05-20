import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import ChatScreen from './src/screens/ChatScreen';
import { useCartStore } from './src/store/cartStore';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, label, focused, badge }) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 8 }}>
      <View>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
        {badge > 0 && (
          <View style={{ position: 'absolute', top: -4, right: -10, backgroundColor: '#e94560', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ color: focused ? '#e94560' : '#666', fontSize: 10, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

export default function App() {
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#16213e', borderTopColor: '#2a2a4a', height: 70, paddingBottom: 8 },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🍽️" label="Menu" focused={focused} /> }} />
        <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="💬" label="AI Chat" focused={focused} /> }} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🛒" label="Cart" focused={focused} badge={itemCount} /> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
