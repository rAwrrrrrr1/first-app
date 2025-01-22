import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BookingHistory = () => {
  const [badmintonBookings, setBadmintonBookings] = useState([]);
  const [futsalBookings, setFutsalBookings] = useState([]);
  const [miniSoccerBookings, setMiniSoccerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('All'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBookingHistory = async (type, setBookings) => {
      if (!user) return;

      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          console.error('Access token not found');
          return;
        }

        const response = await axios.get(`http://172.20.10.5:8000/api/showBooking${type}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data.data);
      } catch (error) {
        console.error(`Error fetching ${type} booking history:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory('Badminton', setBadmintonBookings);
    fetchBookingHistory('Futsal', setFutsalBookings);
    fetchBookingHistory('Soccer', setMiniSoccerBookings);
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Booking ID: {item.id}</Text>
      <Text style={styles.info}>Court: {item.id_lapangan}</Text>
      <Text style={styles.info}>Session: {item.sesi.waktu}</Text>
      <Text style={styles.info}>Date: {item.tanggal}</Text>
      <Text style={styles.info}>Renter's Name: {item.nama_penyewa}</Text>
    </View>
  );

  const renderSection = (title, bookings) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {bookings.length === 0 ? (
        <Text style={styles.noDataText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );

  const renderFilteredSection = () => {
    switch (filter) {
      case 'Badminton':
        return renderSection('Badminton Bookings', badmintonBookings);
      case 'Futsal':
        return renderSection('Futsal Bookings', futsalBookings);
      case 'Mini Soccer':
        return renderSection('Mini Soccer Bookings', miniSoccerBookings);
      default:
        return (
          <>
            {renderSection('Badminton Booking', badmintonBookings)}
            {renderSection('Futsal Booking', futsalBookings)}
            {renderSection('Mini Soccer Booking', miniSoccerBookings)}
          </>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Booking History...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('All')}>
          <Text style={[styles.filterText, filter === 'All' && styles.activeFilter]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('Badminton')}>
          <Text style={[styles.filterText, filter === 'Badminton' && styles.activeFilter]}>Badminton</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('Futsal')}>
          <Text style={[styles.filterText, filter === 'Futsal' && styles.activeFilter]}>Futsal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('Mini Soccer')}>
          <Text style={[styles.filterText, filter === 'Mini Soccer' && styles.activeFilter]}>Mini Soccer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>{renderFilteredSection()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 16,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 15, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600', 
    marginBottom: 8,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6, 
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    marginLeft: 15,
  },
  button: {
    backgroundColor: '#007AFF', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingHistory;
