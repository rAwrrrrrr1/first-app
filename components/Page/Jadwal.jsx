import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const Jadwal = () => {
  const route = useRoute();
  const { fieldType, field } = route.params;
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const fetchSchedule = async () => {
    setIsLoading(true);
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
    const apiEndpoint = getApiEndpoint(fieldType, formattedDate);
    try {
      const response = await axios.get(apiEndpoint);
      setSchedule(response.data.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getApiEndpoint = (fieldType, formattedDate) => {
    switch (fieldType) {
      case 'futsal':
        return `http://172.20.10.5:8000/api/jadwalFutsal/${formattedDate}`;
      case 'soccer':
        return `http://172.20.10.5:8000/api/jadwalSoccer/${formattedDate}`;
      case 'badminton':
      default:
        return `http://172.20.10.5:8000/api/jadwalBadminton/${formattedDate}`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}</Text>
      <View style={styles.fieldDetails}>
        <Text>Nama: {field.nama}</Text>
        <Text>Harga: {field.harga}</Text>
        <Text>Keterangan: {field.keterangan}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={showDatepicker} title="Pilih Tanggal" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Cari Jadwal" onPress={fetchSchedule} disabled={isLoading} />
      </View>
      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text>Waktu: {item.id_sesi}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  fieldDetails: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  scheduleItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 20, // Added margin for gap between buttons and other elements
  },
  listContent: {
    paddingBottom: 50, // Added padding for bottom gap in FlatList
  },
});

export default Jadwal;
