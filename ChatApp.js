
import React, { useState, useRef, useEffect } from 'react';
import {
SafeAreaView,
View,
Text,
FlatList,
TextInput,
TouchableOpacity,
Image,
KeyboardAvoidingView,
Platform,
StyleSheet,
Keyboard,
ImageBackground,
TouchableWithoutFeedback,
} from 'react-native';

export default function App() {
const [messages, setMessages] = useState([
{
id: '1',
text: "Hey! I'm Mich — how can I help you today?",
from: 'bot',
time: new Date().toLocaleTimeString(),
},
]);
const [text, setText] = useState('');
const [inputHeight, setInputHeight] = useState(40);
const flatRef = useRef(null);

// Local images
const userAvatar = require('./assets/p1.jpg');
const botAvatar = require('./assets/p2.jpg');
const chatBackground = require('./assets/back.jpg');

useEffect(() => {
if (flatRef.current && messages.length > 0) {
setTimeout(() => flatRef.current.scrollToEnd({ animated: true }), 100);
}
}, [messages]);

const botReplies = [
'Cool — tell me more!',
'Got it. Anything else? 🤖',
'Nice! I saved that in my imaginary notebook.',
"Hello",
'Kumusta?. 😂',
];

function sendMessage() {
if (!text.trim()) return;

const userMsg = {  
  id: String(Date.now()),  
  text: text.trim(),  
  from: 'user',  
  time: new Date().toLocaleTimeString(),  
};  

setMessages(prev => [...prev, userMsg]);  
setText('');  
setInputHeight(40);  

setTimeout(() => {  
  const reply = botReplies[Math.floor(Math.random() * botReplies.length)];  
  const botMsg = {  
    id: String(Date.now() + 1),  
    text: reply,  
    from: 'bot',  
    time: new Date().toLocaleTimeString(),  
  };  
  setMessages(prev => [...prev, botMsg]);  
}, 800 + Math.random() * 1200);

}

function renderItem({ item }) {
const isUser = item.from === 'user';
return (
<View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
{!isUser && <Image source={botAvatar} style={styles.avatar} />}
<View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
<Text style={isUser ? styles.textUser : styles.textBot}>{item.text}</Text>
<Text style={styles.time}>{item.time}</Text>
</View>
{isUser && <Image source={userAvatar} style={styles.avatar} />}
</View>
);
}

return (
<SafeAreaView style={styles.container}>
<View style={styles.header}>
<Text style={styles.headerTitle}>Anonymous Friend</Text>
<Text style={styles.headerSubtitle}>From Philippines</Text>
</View>

<KeyboardAvoidingView  
    style={{ flex: 1 }}  
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 25}  
  >  
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>  
      <ImageBackground source={chatBackground} style={styles.bg}>  
        <FlatList  
          ref={flatRef}  
          data={messages}  
          keyExtractor={item => item.id}  
          renderItem={renderItem}  
          contentContainerStyle={styles.list}  
          onContentSizeChange={() =>  
            flatRef.current && flatRef.current.scrollToEnd({ animated: true })  
          }  
        />  
      </ImageBackground>  
    </TouchableWithoutFeedback>  

    <View style={styles.composerWrapper}>  
      <View style={styles.composerContainer}>  
        <TextInput  
          value={text}  
          onChangeText={setText}  
          placeholder="Type a message..."  
          multiline  
          onContentSizeChange={e => {  
            const h = Math.min(120, Math.max(40, e.nativeEvent.contentSize.height));  
            setInputHeight(h);  
          }}  
          style={[styles.input, { height: inputHeight }]}  
        />  

        <TouchableOpacity  
          style={styles.sendBtn}  
          onPress={() => {  
            sendMessage();  
            Keyboard.dismiss();  
          }}  
        >  
          <Text style={styles.sendText}>Send</Text>  
        </TouchableOpacity>  
      </View>  
    </View>  
  </KeyboardAvoidingView>  
</SafeAreaView>

);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#E9EAED' },
bg: { flex: 1, resizeMode: 'cover' },
header: { padding: 12, backgroundColor: '#3b5998', alignItems: 'center' },
headerTitle: { color: '#fff', fontWeight: '700', fontSize: 18 },
headerSubtitle: { color: '#dfe6ff', fontSize: 12 },
list: { padding: 12, paddingBottom: 8 },
row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
rowLeft: { justifyContent: 'flex-start' },
rowRight: { justifyContent: 'flex-end' },
avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 8 },
bubble: {
maxWidth: '72%',
padding: 10,
borderRadius: 14,
shadowColor: '#000',
shadowOpacity: 0.05,
shadowRadius: 2,
elevation: 1,
},
bubbleBot: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
bubbleUser: { backgroundColor: '#dcf8c6', borderTopRightRadius: 4 },
textBot: { color: '#222' },
textUser: { color: '#111' },
time: { fontSize: 10, color: '#666', marginTop: 6, alignSelf: 'flex-end' },
composerWrapper: {
backgroundColor: '#f5f5f5',
paddingBottom: Platform.OS === 'ios' ? 10 : 5,
},
composerContainer: {
flexDirection: 'row',
alignItems: 'flex-end',
padding: 8,
backgroundColor: '#f5f5f5',
},
input: {
flex: 1,
paddingHorizontal: 12,
paddingVertical: 8,
borderRadius: 20,
backgroundColor: '#fff',
fontSize: 16,
maxHeight: 120,
},
sendBtn: { paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'center' },
sendText: { color: '#3b5998', fontWeight: '700' },
});

