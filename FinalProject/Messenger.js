import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from './database';
import { LinearGradient } from 'expo-linear-gradient';

export default function Messenger({ route }) {
  const { receiver } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('loggedUser');
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user || !receiver) return;

    const interval = setInterval(() => loadMessages(false), 1500);
    loadMessages(true);

    return () => clearInterval(interval);
  }, [user, receiver]);

  const loadMessages = async (scroll = true) => {
    if (!user || !receiver) return;
    try {
      const db = await openDatabase();
      const msgs = await db.getAllAsync(
        `SELECT m.*, u.name as senderName
         FROM messages m
         JOIN users u ON m.senderId = u.id
         WHERE (m.senderId = ? AND m.receiverId = ?)
            OR (m.senderId = ? AND m.receiverId = ?)
         ORDER BY timestamp ASC`,
        [user.id, receiver.id, receiver.id, user.id]
      );
      setMessages(msgs);

      if (scroll && isAtBottom) {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
      }
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !receiver || !text.trim()) return;

    try {
      const db = await openDatabase();
      await db.runAsync(
        `INSERT INTO messages (senderId, receiverId, message) VALUES (?, ?, ?)`,
        [user.id, receiver.id, text.trim()]
      );
      setText('');
      await loadMessages(true);
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    setIsAtBottom(distanceFromBottom < 60);
  };

  const renderItem = ({ item }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageContainer, isMine ? styles.rightAlign : styles.leftAlign]}>
        {!isMine && <Image source={require('./assets/p1.jpg')} style={styles.avatar} />}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
          <Text style={styles.sender}>{item.senderName}</Text>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {isMine && <Image source={require('./assets/p2.jpg')} style={styles.avatar} />}
      </View>
    );
  };

  if (!user || !receiver) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.chatHeader}>Chat with {receiver.name}</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || !user || !receiver) && { backgroundColor: '#aaa' },
            ]}
            onPress={sendMessage}
            disabled={!text.trim() || !user || !receiver}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between' },
  chatHeader: { textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginVertical: 5, color: '#fff' },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-end', margin: 5 },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 },
  bubble: { maxWidth: '70%', padding: 10, borderRadius: 15 },
  myBubble: { backgroundColor: '#007bff', borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: '#e5e5ea', borderTopLeftRadius: 0 },
  sender: { fontWeight: 'bold', fontSize: 12, marginBottom: 3 },
  messageText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', padding: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, marginRight: 10, backgroundColor: 'white' },
  sendButton: { backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

