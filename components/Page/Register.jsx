import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const handleRegister = async (email, password, nama, telepon, navigation) => {
  try {
    const response = await axios.post('http://172.20.10.5:8000/api/register', {
      email: email,
      password: password,
      nama: nama,
      telepon: telepon
    });

    if(response.data.success){
      Toast.show({
        type:'success',
        text1:'Register Successful',
        text2:'You can log in now',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    }else{
      Toast.show({
        type:'error',
        text1:'Register error',
        text2:'Invalid input',
      });
    }
  } catch(error){
    Toast.show({
      type: 'error',
      text1: 'Regsiter error',
      text2: 'An error occurred during register',
    });
    console.error(error);
  }
};


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [telepon, setTelepon] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
        placeholder="Name"
        value={nama}
        onChangeText={setNama}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={telepon}
        onChangeText={setTelepon}
        keyboardType="phone-pad"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRegister(email, password, nama, telepon, navigation)}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginLinkText}>Already have an account? Login</Text>
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default Register;
