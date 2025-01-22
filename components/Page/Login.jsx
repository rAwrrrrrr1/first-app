import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const handleLogin = async (email, password, setIsLoggedIn, navigation) => {
  try {
    const response = await axios.post('http://172.20.10.5:8000/api/login', {
      email: email,
      password: password,
    });

    if (response.data.success) {
      const { access_token, user } = response.data;
      // Store access token and user details
      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // // Update login state and navigate to Profile
      // setIsLoggedIn(false);
      navigation.replace('Profile');

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
    } else {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: response.data.message || 'Invalid credentials',
      });
    }
  } catch (error) {
    // Handle errors during login
    Toast.show({
      type: 'error',
      text1: 'Login Error',
      text2: error.response ? error.response.data.message : 'An error occurred during login',
    });
    console.error(error);
  }
};

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLogin(email, password, setIsLoggedIn, navigation)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerLinkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default Login;
