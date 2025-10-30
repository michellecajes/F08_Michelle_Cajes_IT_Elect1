import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sender = "You"; // temporary sender

  // Load messages from SQLite
  const loadMessages = async () => {
    try {
      const rows = await db.getAllAsync(
        "SELECT * FROM messages ORDER BY id DESC"
      );
      setMessages(rows);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    try {
      await db.runAsync(
        "INSERT INTO messages (sender, receiver, message, time) VALUES (?, ?, ?, ?)",
        [sender, "Friend", input, timestamp]
      );
      setInput("");
      loadMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.replace("UserForm"); // Navigate back to signup
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <ImageBackground
      source={require("./assets/back.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === sender
                  ? styles.myMessage
                  : styles.otherMessage,
              ]}
            >
              <View style={styles.row}>
                <Image
                  source={
                    item.sender === sender
                      ? require("./assets/p1.jpg")
                      : require("./assets/p2.jpg")
                  }
                  style={styles.profilePic}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.sender}>{item.sender}</Text>
                  <Text style={styles.text}>{item.message}</Text>
                  <Text style={styles.time}>{item.time}</Text>
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
        <View style={{ marginTop: 10 }}>
          <Button title="Logout" color="#FF3B30" onPress={handleLogout} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: "space-between", padding: 10 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  textContainer: { flexShrink: 1, maxWidth: "85%" },
  messageBubble: { marginVertical: 5, padding: 10, borderRadius: 10 },
  myMessage: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#E4E6EB", alignSelf: "flex-start" },
  sender: { fontWeight: "bold", color: "#333" },
  text: { fontSize: 16 },
  time: { fontSize: 10, color: "#666", marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: { flex: 1, borderColor: "#ccc", borderWidth: 1, borderRadius: 6, padding: 8, marginRight: 10 },
});

export default ChatScreen;