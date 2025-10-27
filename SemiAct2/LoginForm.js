import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginForm({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (!savedUser) {
        Alert.alert('Login Failed', 'No user found');
        return;
      }

      const user = JSON.parse(savedUser);
      const inputEmail = email.replace(/@gmail\.com$/i, '') + '@gmail.com';

      if ((user.email === inputEmail || user.phone === phone) && user.password === password) {
        navigation.replace('Messenger', { user });
      } else {
        Alert.alert('Login Failed', 'Invalid email, phone, or password');
      }
    } catch {
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Email (username)" value={email} onChangeText={(t) => {
        const username = t.replace(/@gmail\.com$/i, '');
        setEmail(username + '@gmail.com');
      }} />

      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('UserForm')}>
        <Text style={styles.link}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  link: { color: '#0066cc', textAlign: 'center', marginTop: 10 },
});