import React, { useState } from 'react';
import { Alert, View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const handleRegister = async (nama, email, password, telepon,navigation) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/register', {
      nama: nama,
      email: email,
      password: password,
      telepon: telepon,
    });

    if (response.data.success) {
      Alert.alert('Registration Successful', 'You can now log in');
      navigation.navigate('Login');
    } else {
      Alert.alert('Registration Failed', response.data.message);
    }
  } catch (error) {
    Alert.alert('Registration Error', 'An error occurred during registration');
    console.error(error);
  }
};

const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telepon, setTelepon] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={nama}
        onChangeText={setNama}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={telepon}
        onChangeText={setTelepon}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRegister(nama, email, password, telepon, navigation)}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Register;
