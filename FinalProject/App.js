import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserForm from './UserForm';
import ContactList from './ContactList';
import Messenger from './Messenger';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="UserForm" component={UserForm} options={{ title: 'Account' }} />
        <Stack.Screen name="ContactList" component={ContactList} options={{ title: 'Contacts' }} />
        <Stack.Screen name="Messenger" component={Messenger} options={{ title: 'Messenger' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}