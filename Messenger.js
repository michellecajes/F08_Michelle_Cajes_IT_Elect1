import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [suwat, setSuwat] = useState('');
  const [mensahe, setMensahe] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  // Add new message
  const handleSendMessage = () => {
    if (suwat.trim()) {
      setMensahe([...mensahe, suwat]);
      setSuwat('');
    }
  };

  // Add new comment
  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  // Reusable message renderer
  const renderItem = ({ item }) => (
    <View style={styles.bubble}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Messenger Section */}
      <View style={styles.panelContainer}>
        <Text style={styles.header}>💬 Messenger</Text>
        <View style={styles.panel}>
          <FlatList
            data={mensahe}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.messages}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              value={suwat}
              onChangeText={setSuwat}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comment Section */}
      <View style={styles.panelContainer}>
        <Text style={styles.header}>📝 Comments</Text>
        <View style={styles.panel}>
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.messages}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddComment}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f6ff',
    alignItems: 'center',
  },
  panelContainer: {
    marginBottom: 30,
    width: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    minHeight: 220,
  },
  messages: {
    flex: 1,
    marginBottom: 10,
  },
  bubble: {
    backgroundColor: '#74b9ff',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#dfe6e9',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#2d3436',
  },
  button: {
    backgroundColor: '#0984e3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
