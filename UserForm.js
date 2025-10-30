import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from './database';

export default function UserForm({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  // ✅ Load all users (for "View All Users")
  const loadUsers = async () => {
    try {
      const db = await openDatabase();
      const list = await db.getAllAsync('SELECT * FROM users');
      setUsers(list);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    try {
      const db = await openDatabase();
      await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
      Alert.alert('Deleted', 'User deleted successfully.');
      loadUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ✅ Sign up or login
  const handleSubmit = async () => {
    if (isLogin) {
      // --- LOGIN ---
      if (!email || !password) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }
      try {
        const db = await openDatabase();
        const user = await db.getFirstAsync(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password]
        );

        if (user) {
          await AsyncStorage.setItem('user', JSON.stringify(user));
          navigation.reset({
            index: 0,
            routes: [{ name: 'Messenger', params: { user } }],
          });
        } else {
          Alert.alert('Login failed', 'Invalid email or password.');
        }
      } catch (err) {
        console.error('Login error:', err);
      }
    } else {
      // --- SIGN UP ---
      if (!firstName || !lastName || !email || !phone || !password) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }

      try {
        const db = await openDatabase();
        // Check if email exists first
        const exists = await db.getFirstAsync(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        if (exists) {
          Alert.alert('Error', 'Email already exists. Try logging in.');
          return;
        }

        // ✅ Create user
        await db.runAsync(
          'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
          [`${firstName} ${lastName}`, email, password, phone]
        );

        const newUser = await db.getFirstAsync(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Messenger', params: { user: newUser } }],
        });
      } catch (err) {
        console.error('Signup error:', err);
        Alert.alert('Error', 'Something went wrong while signing up.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? 'Login' : 'Create Account'}
      </Text>

      {!isLogin && (
        <>
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            placeholder="Phone"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </>
      )}

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggle}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      {/* ✅ View All Users */}
      <TouchableOpacity
        style={styles.viewBtn}
        onPress={() => {
          loadUsers();
          setShowUsers(!showUsers);
        }}
      >
        <Text style={styles.viewText}>
          {showUsers ? 'Hide Users' : 'View All Users'}
        </Text>
      </TouchableOpacity>

      {showUsers && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userRow}>
              <Text style={styles.userText}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteUser(item.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  btn: {
    backgroundColor: '#1877F2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  toggle: { textAlign: 'center', marginTop: 15, color: '#1877F2' },
  viewBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  viewText: { color: '#fff', fontWeight: 'bold' },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userText: { fontSize: 16, fontWeight: '600' },
  deleteBtn: { backgroundColor: 'red', padding: 5, borderRadius: 6 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
