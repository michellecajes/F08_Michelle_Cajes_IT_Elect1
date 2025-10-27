import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginForm from './LoginForm';
import UserForm from './UserForm';
import Messenger from './Messenger';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) setInitialRoute('Messenger'); // auto-login
        else setInitialRoute('LoginForm');
      } catch {
        setInitialRoute('LoginForm');
      }
    };
    checkUser();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginForm" component={LoginForm} />
        <Stack.Screen name="UserForm" component={UserForm} />
        <Stack.Screen name="Messenger" component={Messenger} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});