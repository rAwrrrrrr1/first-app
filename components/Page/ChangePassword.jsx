import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
  const [password, setNewPassword] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'New password is required.');
      return;
    }

    Alert.alert(
      'Confirm Change',
      'Are you sure you want to change your password?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: async () => await submitChangePassword() },
      ],
      { cancelable: true }
    );
  };

  const submitChangePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);

      const response = await axios.put(
        `http://172.20.10.5:8000/api/userPassword/${user.id}`,
        {
          password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response:', response.data); 

      Alert.alert('Success', 'Password changed successfully!');
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error changing password:', error); 
      if (error.response && error.response.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to change password.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={password} 
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  label: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#32CD32',
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
