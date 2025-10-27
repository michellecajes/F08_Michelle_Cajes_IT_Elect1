import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Image,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Messenger({ route, navigation }) {
  const user = route?.params?.user || { name: 'Guest', phone: '' };

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { name: 'Bot', text: 'Hello, Kumusta?' } // default message
  ]);

  const flatListRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Keyboard listener
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Send user message + auto-reply
  const handleAddComment = () => {
    if (!comment.trim()) return;

    const userMessage = { name: user.name, text: comment };
    setComments(prev => [...prev, userMessage]);
    setComment('');

    // Auto-reply logic
    const botReply = generateBotReply(comment);
    setTimeout(() => {
      setComments(prev => [...prev, userMessage, { name: 'Bot', text: botReply }]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500); // 0.5s delay for reply
  };

  // Simple bot logic
  const generateBotReply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) return 'Hi there! Kumusta ka?';
    if (lower.includes('kumusta')) return 'Maayo ra! Ikaw kumusta?';
    if (lower.includes('good') || lower.includes('maayo')) return 'Wow, that’s great to hear!';
    if (lower.includes('bad') || lower.includes('dili maayo')) return 'Ayaw kabalaka, everything will be fine.';
    return 'Interesting! Tell me more.';
  };

  // Logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginForm' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const CommentCard = ({ name, comment, isMe }) => (
    <View
      style={[
        styles.commentBox,
        isMe ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Image
        source={isMe ? require('./assets/p2.jpg') : require('./assets/p1.jpg')}
        style={styles.avatar}
      />
      <View style={styles.textBubble}>
        <Text style={styles.commentText}>
          {isMe ? 'You: ' : `${name}: `}
          {comment}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('./assets/back.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{user.name}</Text>
            {user.phone ? <Text style={styles.phoneText}>{user.phone}</Text> : null}
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={comments}
            renderItem={({ item }) => (
              <CommentCard
                name={item.name}
                comment={item.text}
                isMe={item.name === user.name}
              />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: keyboardHeight + 5 },
            ]}
          />

          {/* Input */}
          <View style={[styles.inputContainer, { marginBottom: keyboardHeight }]}>
            <TextInput
              style={styles.input}
              placeholder="Write your message..."
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddComment}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  background: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1 },
  listContent: { padding: 20 },

  header: {
    backgroundColor: '#1877F2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  phoneText: { color: '#fff', fontSize: 14 },
  logout: { color: '#fff', fontSize: 16 },

  commentBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: { alignSelf: 'flex-start' },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 8,
  },
  textBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 15,
  },
  commentText: { fontSize: 16, color: '#000' },

  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    padding: 10,
    marginRight: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1877F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});