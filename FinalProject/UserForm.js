import React, { useState } from 'react';
import {
View,
Text,
TextInput,
StyleSheet,
KeyboardAvoidingView,
Platform,
Alert,
TouchableOpacity,
ScrollView,
SafeAreaView,
} from 'react-native';
import { openDatabase } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserForm({ navigation }) {
const [isLogin, setIsLogin] = useState(true);
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [phone, setPhone] = useState('');

const handleSignup = async () => {
if (!name || !email || !password) {
Alert.alert('Error', 'Please fill all required fields.');
return;
}
try {
const db = await openDatabase();
await db.runAsync(
'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
[name, email, password, phone]
);
Alert.alert('Success', 'Account created successfully!');
// clear fields and switch to login
setName('');
setEmail('');
setPassword('');
setPhone('');
setIsLogin(true);
} catch (error) {
console.warn('Signup error:', error);
Alert.alert('Error', 'Email may already exist or DB error.');
}
};

const handleLogin = async () => {
try {
const db = await openDatabase();
const result = await db.getAllAsync(
'SELECT * FROM users WHERE email = ? AND password = ?',
[email, password]
);

if (result.length > 0) {  
    const user = result[0];  
    await AsyncStorage.setItem('loggedUser', JSON.stringify(user));  
    Alert.alert('Welcome', `Hello ${user.name}!`);  
    navigation.replace('ContactList');  
  } else {  
    Alert.alert('Error', 'Invalid email or password.');  
  }  
} catch (err) {  
  console.warn('Login error:', err);  
  Alert.alert('Error', 'An unexpected error occurred.');  
}

};

return (
<SafeAreaView style={{ flex: 1 }}>
<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
<View style={styles.background}>
<KeyboardAvoidingView
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
style={styles.container}
>
<View style={styles.header}>
<Text style={styles.headerText}>Welcome back!</Text>
</View>

<View style={styles.card}>  
          <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>  

          {!isLogin && (  
            <TextInput  
              style={styles.input}  
              placeholder="Name"  
              value={name}  
              onChangeText={setName}  
              autoCapitalize="words"  
            />  
          )}  

          <TextInput  
            style={styles.input}  
            placeholder="Email"  
            keyboardType="email-address"  
            autoCapitalize="none"  
            value={email}  
            onChangeText={setEmail}  
          />  

          <TextInput  
            style={styles.input}  
            placeholder="Password"  
            secureTextEntry  
            value={password}  
            onChangeText={setPassword}  
          />  

          {!isLogin && (  
            <TextInput  
              style={styles.input}  
              placeholder="Phone (optional)"  
              keyboardType="phone-pad"  
              value={phone}  
              onChangeText={setPhone}  
            />  
          )}  

          <TouchableOpacity  
            style={styles.button}  
            onPress={isLogin ? handleLogin : handleSignup}  
          >  
            <Text style={styles.buttonText}>  
              {isLogin ? 'Login' : 'Sign Up'}  
            </Text>  
          </TouchableOpacity>  

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>  
            <Text style={styles.switchText}>  
              {isLogin  
                ? "Don't have an account? Sign up"  
                : 'Already have an account? Login'}  
            </Text>  
          </TouchableOpacity>  
        </View>  
      </KeyboardAvoidingView>  
    </View>  
  </ScrollView>  
</SafeAreaView>

);
}

const styles = StyleSheet.create({
background: {
flex: 1,
backgroundColor: '#cce6ff',
},
container: {
flex: 1,
padding: 20,
},
header: {
paddingVertical: 40,
alignItems: 'center',
},
headerText: {
fontSize: 32,
fontWeight: 'bold',
color: '#0059b3',
},
card: {
backgroundColor: 'white',
borderRadius: 20,
padding: 25,
elevation: 5,
},
title: {
fontSize: 26,
fontWeight: 'bold',
marginBottom: 20,
textAlign: 'center',
color: '#003d66',
},
input: {
borderWidth: 1,
borderColor: '#99c2ff',
borderRadius: 12,
padding: 12,
backgroundColor: '#f7fbff',
marginBottom: 12,
},
button: {
backgroundColor: '#4da6ff',
padding: 14,
borderRadius: 12,
alignItems: 'center',
marginTop: 10,
},
buttonText: {
color: 'white',
fontWeight: 'bold',
fontSize: 18,
},
switchText: {
textAlign: 'center',
color: '#003d66',
marginVertical: 12,
fontSize: 14,
},
});
