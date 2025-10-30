import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import { openDatabase } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Messenger({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUserAndMessages = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (!savedUser) {
          navigation.reset({ index: 0, routes: [{ name: 'UserForm' }] });
          return;
        }

        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        loadMessages();
      } catch (err) {
        console.error('Error loading user or messages:', err);
      }
    };
    loadUserAndMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const db = await openDatabase();
      const rows = await db.getAllAsync(
        'SELECT * FROM messages ORDER BY id DESC'
      );
      setMessages(rows);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;

    try {
      const db = await openDatabase();
      const timestamp = new Date().toISOString();

      // Insert message using correct columns
      await db.runAsync(
        'INSERT INTO messages (senderId, receiverId, message, timestamp) VALUES (?, ?, ?, ?)',
        [currentUser.id, 0, input, timestamp] // receiverId = 0 (placeholder)
      );

      setInput('');
      loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Error', 'Could not send message.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.reset({ index: 0, routes: [{ name: 'UserForm' }] });
  };

  return (
    <ImageBackground
      source={require('./assets/back.jpg')}
      style={styles.background}>
      <View style={styles.container}>
        <Button title="Logout" color="red" onPress={handleLogout} />

        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === currentUser?.id
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}>
              <View style={styles.row}>
                <Image
                  source={
                    item.senderId === currentUser?.id
                      ? require('./assets/p1.jpg')
                      : require('./assets/p2.jpg')
                  }
                  style={styles.profilePic}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.sender}>
                    {item.senderId === currentUser?.id ? 'You' : 'Other'}
                  </Text>
                  <Text style={styles.text}>{item.message}</Text>
                  <Text style={styles.time}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#aaa"
          />
          <Button title="Send" color="#1877F2" onPress={sendMessage} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  textContainer: { flexShrink: 1, maxWidth: '85%' },
  messageBubble: { marginVertical: 5, padding: 10, borderRadius: 10 },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#E4E6EB', alignSelf: 'flex-start' },
  sender: { fontWeight: 'bold', color: '#333' },
  text: { fontSize: 16 },
  time: { fontSize: 10, color: '#666', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
  },
});