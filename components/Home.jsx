import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Home = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  const [fields, setFields] = useState({
    badminton: [],
    futsal: [],
    miniSoccer: [],
  });

  useEffect(() => {
    // Fetch login status from AsyncStorage on component mount
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        if (value !== null) {
          setIsLoggedIn(JSON.parse(value)); // Parse the value to boolean
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    };

    checkLoginStatus(); // Call the function to check login status

    const fetchBadmintonData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/badminton');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching badminton data:', error);
        return [];
      }
    };

    const fetchFutsalData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/futsal');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching futsal data:', error);
        return [];
      }
    };

    const fetchMiniSoccerData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/soccer');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching mini soccer data:', error);
        return [];
      }
    };

    const fetchData = async () => {
      const [badminton, futsal, miniSoccer] = await Promise.all([
        fetchBadmintonData(),
        fetchFutsalData(),
        fetchMiniSoccerData()
      ]);
      setFields({ badminton, futsal, miniSoccer });
    };

    fetchData();
  }, []);

  const handleBooking = (fieldType, fieldName) => {
    if (isLoggedIn) {
      // Proceed with booking
      console.log(`Booking ${fieldName} (${fieldType})`);
    } else {
      // Redirect to login screen if not logged in
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Selamat Datang di WinsArena</Text>
      <Text>Ini adalah halaman utama dari aplikasi kami.</Text>
      <Text>Silakan jelajahi fitur-fitur yang tersedia!</Text>

      <View>
        <Text style={styles.subtitle}>Lapangan Badminton</Text>
        {fields.badminton.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleBooking('badminton', field.nama)}>
            <Text><h3>{field.nama}</h3></Text>
            <Text>Harga: {field.harga}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleBooking('badminton', field.nama)}>
              <Text style={styles.buttonText}>Pesan Sekarang</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text style={styles.subtitle}>Lapangan Futsal</Text>
        {fields.futsal.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleBooking('futsal', field.nama)}>
            <Text><h3>{field.nama}</h3></Text>
            <Text>Harga: {field.harga}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleBooking('futsal', field.nama)}>
              <Text style={styles.buttonText}>Pesan Sekarang</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text style={styles.subtitle}>Lapangan Mini Soccer</Text>
        {fields.miniSoccer.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleBooking('mini soccer', field.nama)}>
            <Text><h3>{field.nama}</h3></Text>
            <Text>Harga: {field.harga}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleBooking('mini soccer', field.nama)}>
              <Text style={styles.buttonText}>Pesan Sekarang</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Home;
