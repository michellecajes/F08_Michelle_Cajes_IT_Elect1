import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserForm from './UserForm';
import UserList from './UserList';
import Messenger from './Messenger';

const Stack = createStackNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setUserLoggedIn(!!user);
    };
    checkUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userLoggedIn ? 'UserList' : 'UserForm'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="UserForm" component={UserForm} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="Messenger" component={Messenger} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
