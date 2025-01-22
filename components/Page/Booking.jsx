import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Booking = ({ route, navigation }) => {
  const { fieldIds, selectedDate, selectedSchedules, parent } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [namaPenyewa, setNamaPenyewa] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleConfirmBooking = async () => {
    if (!namaPenyewa.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Name Required',
        text2: 'Please enter your name before confirming the booking.',
        position: 'top',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const bookings = [];

      const { data: { no_booking: bookingNumber } } = await axios.get(
        'http://172.20.10.5:8000/api/generateNoBooking',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      for (const schedule of selectedSchedules) {
        const apiUrl =
          parent === 'futsal'
            ? `http://172.20.10.5:8000/api/addBookingFutsal/${schedule.id}`
            : parent === 'mini_soccer'
            ? `http://172.20.10.5:8000/api/addBookingSoccer/${schedule.id}`
            : `http://172.20.10.5:8000/api/addBookingBadminton/${schedule.id}`;

        const response = await axios.put(
          `${apiUrl}?id_user=${user.id}&nama_penyewa=${namaPenyewa}&no_booking=${bookingNumber}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          bookings.push({ id: schedule.id, type: schedule.type });
        }
      }

      navigation.navigate('CancelBooking', {
        selectedDate,
        selectedSchedules,
        namaPenyewa,
        user,
        bookings,
        bookingNumber,
      });
    } catch (error) {
      console.error('Error confirming booking:', error);
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: 'There was an error confirming your booking.',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Icon name="calendar-check" size={36} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Booking Confirmation</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.scheduleTitle}>Selected Schedules:</Text>
          {selectedSchedules.map((schedule, index) => (
            <View key={index} style={styles.scheduleCard}>
              <Text style={styles.scheduleText}>Selected Date: {selectedDate.toDateString()}</Text>
              <Text style={styles.scheduleText}>Sesi: {schedule.sesi.waktu}</Text>
              <Text style={styles.scheduleText}>
                Field: {parent === 'futsal' ? 'Futsal' : parent === 'mini_soccer' ? 'Mini Soccer' : 'Badminton'}
              </Text>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#aaa"
            value={namaPenyewa}
            onChangeText={setNamaPenyewa}
          />
        </ScrollView>

        <TouchableOpacity
          style={[styles.confirmButton, isLoading && styles.loadingButton]}
          onPress={handleConfirmBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#4facfe',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 30,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
  },
  scheduleCard: {
    padding: 15,
    backgroundColor: '#d6d6d6',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginBottom: 20,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  loadingButton: {
    backgroundColor: '#218838',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Booking;
