import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const CancelBooking = () => {
  const navigation = useNavigation();
  const [badmintonBookings, setBadmintonBookings] = useState([]);
  const [futsalBookings, setFutsalBookings] = useState([]);
  const [miniSoccerBookings, setMiniSoccerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('Badminton');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchBookingHistory = async (type, setBookings) => {
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

        const filteredBookings = response.data.data.filter((booking) => {
          const bookingDate = moment(booking.tanggal);
          const currentDate = moment();
          const oneWeekLater = currentDate.clone().add(7, 'days');
          return bookingDate.isBetween(currentDate, oneWeekLater, null, '[]');
        });

        setBookings(filteredBookings);
        for (const booking of filteredBookings) {
          fetchPaymentDetails(booking.no_booking, type);
        }
      } catch (error) {
        console.error(`Error fetching ${type} booking history:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory('Badminton', setBadmintonBookings);
    fetchBookingHistory('Futsal', setFutsalBookings);
    fetchBookingHistory('Soccer', setMiniSoccerBookings);

    const intervalId = setInterval(() => {
      fetchBookingHistory('Badminton', setBadmintonBookings);
      fetchBookingHistory('Futsal', setFutsalBookings);
      fetchBookingHistory('Soccer', setMiniSoccerBookings);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user]);

  const fetchPaymentDetails = async (no_booking, type) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found.');
        return;
      }

      const response = await axios.get(`http://172.20.10.5:8000/api/transaksi/detail/${type}/${no_booking}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentDetails(prevDetails => ({
        ...prevDetails,
        [no_booking]: response.data,
      }));
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id, fieldType) => {
    try {
      if (!['Badminton', 'Futsal', 'Mini Soccer'].includes(fieldType)) {
        console.error('Invalid booking type:', fieldType);
        Alert.alert('Error', 'Invalid booking type.');
        return;
      }

      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('Access token not found');
        return;
      }

      let cancelEndpoint;
      switch (fieldType) {
        case 'Badminton':
          cancelEndpoint = `http://172.20.10.5:8000/api/cancelBookingBadminton/${id}`;
          break;
        case 'Futsal':
          cancelEndpoint = `http://172.20.10.5:8000/api/cancelBookingFutsal/${id}`;
          break;
        case 'Mini Soccer':
          cancelEndpoint = `http://172.20.10.5:8000/api/cancelBookingSoccer/${id}`;
          break;
        default:
          console.error('Invalid booking type');
          return;
      }

      const response = await axios.put(cancelEndpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Booking canceled successfully.');
      } else {
        Alert.alert('Error', 'Failed to cancel the booking.');
      }
    } catch (error) {
      console.error('Error canceling booking:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to cancel the booking. Please try again later.');
    }
  };

  const renderItem = ({ item, type }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Booking ID: {item.no_booking}</Text>
      <Text style={styles.info}>Lapangan: {item.id_lapangan}</Text>
      <Text style={styles.info}>Sesi: {item.sesi.waktu}</Text>
      <Text style={styles.info}>Tanggal: {item.tanggal}</Text>
      <Text style={styles.info}>Nama Penyewa: {item.nama_penyewa}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() =>
            navigation.navigate('Payment', {
              id: item.id,
              fieldType: type,
            })
          }
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            Alert.alert(
              'Cancel Booking',
              'Are you sure you want to cancel this booking?',
              [
                { text: 'No' },
                { 
                  text: 'Yes', 
                  onPress: () => handleCancel(
                    item.id,
                    type
                  )
                },
              ]
            )
          }
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilteredSection = () => {
    switch (filter) {
      case 'Badminton':
        return renderSection(badmintonBookings, 'Badminton');
      case 'Futsal':
        return renderSection(futsalBookings, 'Futsal');
      case 'Mini Soccer':
        return renderSection(miniSoccerBookings, 'Mini Soccer');
      default:
        return null;
    }
  };

  const renderSection = (bookings, type) => (
    <>
      <Text style={styles.sectionHeader}>{type} Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(props) => renderItem({ ...props, type })}
        ListEmptyComponent={<Text style={styles.emptyText}>No bookings found</Text>}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('Badminton')} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Badminton</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('Futsal')} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Futsal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('Mini Soccer')} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Mini Soccer</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        renderFilteredSection()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20, // Menambahkan jarak horizontal
    backgroundColor: '#f8f8f8',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginHorizontal: 10, // Memberikan jarak antar tombol filter dan layar
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
    width: '30%',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal: 10, // Memberikan jarak antara kartu dan tepi layar
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  payButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 10, // Memberikan jarak antara header dan tepi layar
  },
});

export default CancelBooking;
