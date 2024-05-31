import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const UserProfile = ({ route, navigation }) => {
  const { user } = route.params;

  const handleLogout = async () => {
    try {
      // Menghapus data token atau state login dari AsyncStorage
      await AsyncStorage.removeItem('authToken'); // Sesuaikan dengan nama token Anda
      // Navigasi kembali ke halaman login atau halaman awal yang sesuai
      navigation.navigate('Profile'); // Ganti 'Login' dengan halaman yang sesuai
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error logout di sini, misalnya menampilkan pesan kesalahan
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.label}>Name: {user.nama}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      {/* Tambahkan informasi pengguna lainnya di sini */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default UserProfile;
