import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserForm({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await AsyncStorage.setItem('user', JSON.stringify(form));
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Messenger', { user: form });
    } catch {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(t) => setForm({ ...form, phone: t })}
      />

      <TextInput
        placeholder="Email (username)"
        style={styles.input}
        value={form.email}
        onChangeText={(t) => {
          const username = t.replace(/@gmail\.com$/i, '');
          setForm({ ...form, email: username + '@gmail.com' });
        }}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
          value={form.password}
          onChangeText={(t) => setForm({ ...form, password: t })}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, isPressed && styles.buttonPressed]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('LoginForm')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginBottom: 12 },
  button: { backgroundColor: '#3b5998', padding: 12, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  buttonPressed: { backgroundColor: '#324b85' },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#3b5998', marginTop: 16 },
});