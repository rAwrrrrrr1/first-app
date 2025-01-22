import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const [user, setUser] = useState({ nama: '', email: '', telepon: '' });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!user.id) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
  
    Alert.alert(
      'Confirm Update',
      'Are you sure all the details are correct?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              await axios.put(`http://172.20.10.5:8000/api/userUpdate/${user.id}`, user, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await AsyncStorage.setItem('user', JSON.stringify(user));
              Alert.alert('Success', 'Profile updated successfully!');
              navigation.navigate('Profile');
            } catch (error) {
              Alert.alert('Error', 'Failed to update profile.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={user.nama}
          onChangeText={(text) => setUser({ ...user, nama: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={user.telepon}
          onChangeText={(text) => setUser({ ...user, telepon: text })}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
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

export default EditProfile;
