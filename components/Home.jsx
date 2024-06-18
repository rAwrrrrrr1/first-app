import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fields, setFields] = useState({
    badminton: [],
    futsal: [],
    miniSoccer: [],
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('isLoggedIn');
        if (value !== null) {
          setIsLoggedIn(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    };

    checkLoginStatus();

    const fetchBadmintonData = async () => {
      try {
        const response = await axios.get('http://172.20.10.5:8000/api/badminton');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching badminton data:', error);
        return [];
      }
    };

    const fetchFutsalData = async () => {
      try {
        const response = await axios.get('http://172.20.10.5:8000/api/futsal');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching futsal data:', error);
        return [];
      }
    };

    const fetchMiniSoccerData = async () => {
      try {
        const response = await axios.get('http://172.20.10.5:8000/api/soccer');
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

  const handleViewSchedule = (fieldType, field) => {
    navigation.navigate('Jadwal', { fieldType, field });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Selamat Datang di WinsArena</Text>
      <Text>Ini adalah halaman utama dari aplikasi kami.</Text>
      <Text>Silakan jelajahi fitur-fitur yang tersedia!</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Lapangan Badminton</Text>
        {fields.badminton.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text>{field.nama}</Text>
            <Text>Harga: {formatRupiah(field.harga)}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleViewSchedule('badminton', field)}>
              <Text style={styles.buttonText}>Lihat Jadwal</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Lapangan Futsal</Text>
        {fields.futsal.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text>{field.nama}</Text>
            <Text>Harga: {formatRupiah(field.harga)}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleViewSchedule('futsal', field)}>
              <Text style={styles.buttonText}>Lihat Jadwal</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Lapangan Mini Soccer</Text>
        {fields.miniSoccer.map((field, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text>{field.nama}</Text>
            <Text>Harga: {formatRupiah(field.harga)}</Text>
            <Text>Keterangan: {field.keterangan}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleViewSchedule('mini soccer', field)}>
              <Text style={styles.buttonText}>Lihat Jadwal</Text>
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
    paddingTop: 50,
    paddingBottom: 50, // Added padding for bottom gap
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
  section: {
    marginBottom: 20, // Added margin for gap between sections
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
