import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const ConfirmPayment = ({ route }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://172.20.10.5:8000/api/detailBookingBadminton/{id}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!bookingDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load booking details.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>
      <Text style={styles.label}>Booking ID:</Text>
      <Text style={styles.value}>{bookingDetails.id}</Text>

      <Text style={styles.label}>Field Name:</Text>
      <Text style={styles.value}>{bookingDetails.field_name}</Text>

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{bookingDetails.date}</Text>

      <Text style={styles.label}>Time:</Text>
      <Text style={styles.value}>{bookingDetails.time}</Text>

      <Text style={styles.label}>Price:</Text>
      <Text style={styles.value}>${bookingDetails.price}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text style={styles.value}>{bookingDetails.status}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ConfirmPayment;
