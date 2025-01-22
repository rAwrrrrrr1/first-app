import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Payment = ({ route }) => {
  const { id, fieldType } = route.params;
  const [user, setUser] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [imageUri, setImageUri] = useState(null);

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

    const fetchPaymentDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          console.error('Access token not found');
          return;
        }

        let apiUrl = '';
        if (fieldType === 'Badminton') {
          apiUrl = `http://172.20.10.5:8000/api/detailBookingBadminton/${id}`;
        } else if (fieldType === 'Futsal') {
          apiUrl = `http://172.20.10.5:8000/api/detailBookingFutsal/${id}`;
        } else if (fieldType === 'Mini Soccer') {
          apiUrl = `http://172.20.10.5:8000/api/detailBookingSoccer/${id}`;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentDetails(response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
        } else {
          console.error('Error fetching payment details:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchPaymentDetails();
  }, [id, fieldType]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const chooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow access to the gallery to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await AsyncStorage.setItem('selectedImageUri', result.assets[0].uri);
    } else {
      Alert.alert('Image Selection', 'No image selected. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image to upload');
      return;
    }

    setUploading(true);
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      Alert.alert('Error', 'Access token not found');
      setUploading(false);
      return;
    }

    const transactionId = paymentDetails?.dataTransaksi?.id;
    if (!transactionId) {
      Alert.alert('Missing transaction ID', 'Unable to confirm payment without transaction ID.');
      return;
    }

    const formData = new FormData();
    formData.append('bukti_pembayaran', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'bukti_pembayaran.jpg', 
    });

    try {
      const apiUrl = `http://172.20.10.5:8000/api/transaksi/payment/${transactionId}`;

      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadResponse(response.data);
        Alert.alert('Success', 'Payment proof uploaded successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      Alert.alert('Error', 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const isWaitingForConfirmation = paymentDetails?.dataTransaksi?.status_pembayaran === 'Menunggu Konfirmasi' || 
    paymentDetails?.dataTransaksi?.status_pembayaran === 'Sudah Dibayar';

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Icon name="credit-card" size={36} color="#fff" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Payment Details</Text>
          </View>
        </View>
    
        <ScrollView contentContainerStyle={styles.scrollContent}>
    
          {paymentDetails ? (
            <View style={styles.card}>
              <Text style={styles.subHeaderText}>Booking ID: {paymentDetails?.dataBooking?.no_booking}</Text>
              
              <Text style={styles.cardTitle}>Renter Name:</Text>
              <Text style={styles.cardText}>{paymentDetails?.dataBooking?.nama_penyewa}</Text>
    
              <Text style={styles.cardTitle}>Booking Status:</Text>
              <Text style={styles.cardText}>{paymentDetails?.dataTransaksi?.status_pembayaran}</Text>
    
              <Text style={styles.cardTitle}>Amount:</Text>
              <Text style={styles.cardText}>{formatRupiah(paymentDetails?.dataTransaksi?.total_pembayaran)}</Text>
    
              <View style={styles.paymentInfo}>
                <Text style={styles.infoTitle}>Payment Method</Text>
                <Text style={styles.infoText}>
                  Payments can be made via transfer to the account number below. Make sure to upload proof of payment after the transfer to confirm your booking.
                </Text>
    
                <View style={styles.bankDetailsContainer}>
                  <View style={styles.bankInfo}>
                    <Image source={require('../Image/logo_bank.png')} style={styles.bankIcon} />
                    <Text style={styles.bankName}>BCA Bank</Text>
                  </View>
    
                  <Text style={styles.accountNumber}>Account Number: 7735251767</Text>
                  <Text style={styles.accountHolder}>a.n. Albert William Santosa</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Payment details not available.</Text>
          )}
    
          {!isWaitingForConfirmation && (
            <>
              <Button title="Choose Payment Proof Image" onPress={chooseImage} />
              {imageUri && (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                </View>
              )}
              <Button title="Confirm Payment" onPress={handleUpload} />
            </>
          )}
    
          {uploading && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />
          )}
    
          {uploadResponse && (
            <Text style={styles.uploadResponse}>
              {uploadResponse.message || 'Payment proof uploaded successfully'}
            </Text>
          )}
        </ScrollView>
      </View>
    );    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingTop: 20,
  },
  scrollContent: {
    padding: 20,
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  bookingIdContainer: {
    alignItems: 'center', // Center the text
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  paymentInfo: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  bankDetailsContainer: {
    marginTop: 10,
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
  },
  accountHolder: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  uploadResponse: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Payment;
