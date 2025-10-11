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
  SafeAreaView,
} from 'react-native';

const CommentCard = ({ name, comment, isMe, image }) => (
  <View
    style={[
      styles.commentBox,
      isMe ? styles.myMessage : styles.otherMessage,
    ]}
  >
    {/* 🖼️ Avatar */}
    <Image
      source={
        isMe
          ? require('./assets/p2.jpg') // Ashti avatar
          : require('./assets/p1.jpg') // Mich avatar
      }
      style={styles.avatar}
    />

    {/* 💬 Chat bubble */}
    <View style={styles.textBubble}>
      <Text style={styles.commentText}>
        {isMe ? ' You: ' : ` ${name}: `}
        {comment}
      </Text>
    </View>

    {/* ⭐ ADDED: Show image if message has a picture */}
    {image && (
      <Image source={image} style={styles.sentImage} />
    )}
  </View>
);

const App = () => {
  const [comment, setComment] = useState('');

  // ⭐ CHANGED:  Ashti sends “Mich? kumusta?" and then a picture
  const [comments, setComments] = useState([
    { name: 'Ashti', text: 'Mich? kumusta?' },
    { name: 'Ashti', image: require('./assets/p2.jpg') }, // Ashti sends picture
  ]);

  const flatListRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height * 0.0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAddComment = () => {
    if (!comment.trim()) return;
    // You (Mich) send your message here
    setComments(prev => [...prev, { name: 'You', text: comment }]);
    setComment('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🌄 Background image wrapper */}
      <ImageBackground
        source={require('./assets/back.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
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
                image={item.image} // ⭐ ADDED: Pass image prop
                isMe={item.name === 'You'}
              />
            )}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: keyboardHeight + 5 },
            ]}
          />

          {/* ✏️ Input area */}
          <View
            style={[styles.inputContainer, { marginBottom: keyboardHeight }]}
          >
            <TextInput
              style={styles.input}
              placeholder="Write your comment..."
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
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: { flex: 1 },

  listContent: { padding: 20 },

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
  otherMessage: {
    alignSelf: 'flex-start',
  },
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

  // ⭐ ADDED: Style for picture message
  sentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },

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
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizont