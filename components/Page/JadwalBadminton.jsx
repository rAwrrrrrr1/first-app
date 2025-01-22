import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const JadwalBadminton = ({ route }) => {
  const { fieldId } = route.params;
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
    return tomorrow;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const navigation = useNavigation();

  // Format date to 'yyyy-mm-dd'
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Clear token in AsyncStorage
  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Failed to clear token', error);
    }
  };

  // Check if user is logged in
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        clearToken();
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      clearToken();
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const fetchSchedules = async () => {
      const tanggal = formatDate(selectedDate);
      try {
        const response = await axios.get(
          `http://172.20.10.5:8000/api/jadwalBadminton/${tanggal}?id_lapangan=${fieldId}`
        );
        setSchedules(response.data.data);
      } catch (error) {
        console.error('Error fetching badminton schedules:', error);
      }
    };

    fetchSchedules();
  }, [selectedDate, fieldId]);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
  };

  const toggleSelectSchedule = (schedule) => {
    if (selectedSchedules.includes(schedule)) {
      setSelectedSchedules(selectedSchedules.filter((s) => s !== schedule));
    } else {
      setSelectedSchedules([...selectedSchedules, schedule]);
    }
  };

  // Handle booking
  const handleBooking = () => {
    if (isLoggedIn) {
      if (selectedSchedules.length === 0) {
        Toast.show({
          type: 'error',
          text1: 'No Schedule Selected',
          text2: 'Please select at least one schedule to book.',
          position: 'top',
        });
        return;
      }
      var parent = 'badminton';
      navigation.navigate('Booking', {
        fieldId,
        selectedDate,
        selectedSchedules,
        parent,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Required',
        text2: 'You must be logged in to make a booking.',
        position: 'top',
      });
      setTimeout(() => {
      }, 4000); 
    }
  };

  // Calculate the maximum date (7 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

  // Calculate the minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Icon name="badminton" size={36} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Badminton Schedule</Text>
        </View>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>Select Date</Text>
        </TouchableOpacity>
        <Text style={styles.selectedDateText}>
          Selected Date: {formatDate(selectedDate)}
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={minDate} // Disallow selecting past dates
            maximumDate={maxDate} // Disallow selecting more than 1 week ahead
          />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {schedules.map((schedule, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon
                name="clock-outline"
                size={24}
                color="#007bff"
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>{schedule.sesi.waktu}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.scheduleText}>Status: {schedule.status}</Text>
              {schedule.status === 'kosong' && (
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selectedSchedules.includes(schedule) && styles.selectedButton,
                  ]}
                  onPress={() => toggleSelectSchedule(schedule)}
                >
                  <Text style={styles.buttonText}>
                    {selectedSchedules.includes(schedule) ? 'Cancel' : 'Select'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        <Button title="Proceed to Book" onPress={handleBooking} />
      </ScrollView>

      {/* Toast Outside the ScrollView */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  datePickerButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  datePickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  selectedDateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  scheduleText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  selectButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default JadwalBadminton;
