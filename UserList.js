import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from './database';

export default function UserList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const db = await openDatabase();
        const savedUser = await AsyncStorage.getItem('user');
        if (!savedUser) {
          navigation.replace('UserForm');
          return;
        }
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        const allUsers = await db.getAllAsync(
          'SELECT * FROM users WHERE email != ?',
          [user.email]
        );
        setUsers(allUsers);
      } catch (err) {
        Alert.alert('Error', 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'UserForm' }] });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, delete',
          style: 'destructive',
          onPress: async () => {
            const db = await openDatabase();
            await db.runAsync('DELETE FROM users WHERE id = ?', [
              currentUser.id,
            ]);
            await AsyncStorage.removeItem('user');
            navigation.reset({ index: 0, routes: [{ name: 'UserForm' }] });
          },
        },
      ]
    );
  };

  const handleSelectUser = (receiver) => {
    navigation.navigate('Messenger', {
      user: currentUser,
      receiver,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1877F2" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {currentUser?.name}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Delete own account */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.deleteText}>Delete My Account</Text>
      </TouchableOpacity>

      {/* User list */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleSelectUser(item)}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No other users found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  logout: { color: '#1877F2', fontSize: 16 },
  deleteButton: {
    backgroundColor: '#ff4d4d', padding: 10, borderRadius: 10, alignItems: 'center',
    marginVertical: 15,
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  userItem: {
    padding: 15, backgroundColor: '#f0f2f5', borderRadius: 10, marginBottom: 10,
  },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { color: '#555' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});


