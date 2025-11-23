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