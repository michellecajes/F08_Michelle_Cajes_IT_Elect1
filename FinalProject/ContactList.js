import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from './database';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function ContactList({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const profilePics = [
    require('./assets/p1.jpg'),
    require('./assets/sofia.jpg'),
    require('./assets/marco.jpg'),
    require('./assets/ashly.jpg'),
    require('./assets/clifford.jpg'),
    require('./assets/p2.jpg'),
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const db = await openDatabase();
      const stored = await AsyncStorage.getItem('loggedUser');
      const user = stored ? JSON.parse(stored) : null;

      if (user) {
        // protect against id undefined
        const id = typeof user.id === 'number' ? user.id : 0;
        user.avatar = profilePics[id % profilePics.length];
        setCurrentUser(user);

        const users = await db.getAllAsync(
          'SELECT * FROM users WHERE id != ?',
          [id]
        );

        const contactsWithAvatars = users.map((u) => ({
          ...u,
          avatar:
            typeof u.id === 'number'
              ? profilePics[u.id % profilePics.length]
              : profilePics[0],
        }));

        setContacts(contactsWithAvatars);
      } else {
        setContacts([]);
        setCurrentUser(null);
      }
    } catch (err) {
      console.warn('Error loading contacts:', err);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('loggedUser');
    navigation.replace('UserForm');
  };

  const goToChat = (receiver) => {
    navigation.navigate('Messenger', { receiver });
  };

  const deleteContact = async (id, name) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await openDatabase();
              await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
              setContacts((prev) => prev.filter((item) => item.id !== id));
            } catch (err) {
              console.warn('Delete failed:', err);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {currentUser && (
          <View style={styles.header}>
            <Image source={currentUser.avatar} style={styles.profilePic} />
            <View style={{ flex: 1 }}>
              <Text style={styles.currentUser}>{currentUser.name}</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logout}>Log out</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.contactTitle}>Contacts</Text>

        <FlatList
          data={contacts}
          keyExtractor={(item) => (item.id != null ? item.id.toString() : Math.random().toString())}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <Image source={item.avatar} style={styles.avatar} />

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.emailSmall}>{item.email}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteContact(item.id, item.name)}
              >
                <MaterialIcons name="delete" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => goToChat(item)}
              >
                <Text style={styles.chatText}>Chat</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 15,
    elevation: 5,
  },
  profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  currentUser: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#555' },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logout: { color: 'white', fontWeight: 'bold' },
  contactTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  emailSmall: { fontSize: 13, color: '#555' },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#ff4d4d',
    padding: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    marginLeft: 10,
    backgroundColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chatText: { color: 'white', fontWeight: 'bold' },
});

App.js

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

UserList.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { openDatabase } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadUsers = async () => {
    const db = await openDatabase();
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setCurrentUser(parsedUser);

    if (parsedUser) {
      const allUsers = await db.getAllAsync('SELECT * FROM users WHERE id != ?', [parsedUser.id]);
      setUsers(allUsers);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM users WHERE id = ?', [id]);
    Alert.alert('Deleted', 'User removed from the list.');
    loadUsers();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableCol}>#</Text>
        <Text style={styles.tableCol}>Name</Text>
        <Text style={styles.tableCol}>Role</Text>
        <Text style={styles.tableCol}>Action</Text>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{index + 1}</Text>
            <View style={styles.userCell}>
              <Image
                source={item.role === 'instructor' ? require('./assets/p1.jpg') : require('./assets/p2.jpg')}
                style={styles.avatar}
              />
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.tableCol}>{item.role}</Text>
            <TouchableOpacity onPress={() => deleteUser(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: 'white' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 2, borderColor: '#ccc', paddingBottom: 5 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  tableCol: { width: 70, textAlign: 'center' },
  userCell: { flexDirection: 'row', alignItems: 'center', width: 100 },
  avatar: { width: 35, height: 35, borderRadius: 50, marginRight: 5 },
  name: { fontSize: 14 },
  delete: { color: 'red', fontWeight: 'bold' },
});



