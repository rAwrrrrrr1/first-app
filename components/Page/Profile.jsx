import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert('Logout Confirmation', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.setItem('isLoggedIn', 'false');
          navigation.navigate('Login');
        },
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  const handleHistory = () => navigation.navigate('BookingHistory');
  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleChangePassword = () => navigation.navigate('ChangePassword');
  const handleCancelBooking = () => navigation.navigate('CancelBooking');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for profile picture
        />
        <Text style={styles.username}>{user.nama}</Text>
        
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <Text style={styles.info}>Email:  {user.email}</Text>
        <Text style={styles.info}>Phone Number: {user.telepon}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Icon name="person-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Icon name="lock-closed-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCancelBooking}>
          <Icon name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleHistory}>
          <Icon name="time-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Booking History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1E90FF', // Solid blue background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 16,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    marginHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#FF6347', // Red for logout button
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    alignSelf: 'center',
  },
});

export default Profile;
