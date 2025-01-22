import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuBadminton = () => {
  const navigation = useNavigation();
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchBadmintonData = async () => {
      try {
        const response = await axios.get('http://172.20.10.5:8000/api/badminton');
        setFields(response.data.data);
      } catch (error) {
        console.error('Error fetching badminton data:', error);
      }
    };

    fetchBadmintonData();
  }, []);

  const handleViewSchedule = (field) => {
    navigation.navigate('JadwalBadminton', { fieldId: field.id });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(number);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Icon name="badminton" size={36} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Badminton Schedule</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ paddingTop: 20 }}>
          {fields.map((field, index) => (
            <View key={index} style={styles.card}>
              <Image
                source={{
                  uri: `http://172.20.10.5:8000/storage/${field.gambar.substring(7)}`,
                }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.fieldName}>{field.nama}</Text>
                <Text style={styles.fieldPrice}>
                  Price: {formatRupiah(field.harga)}
                </Text>
                <Text style={styles.fieldDescription}>
                  Desc: {field.keterangan}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleViewSchedule(field)}
              >
                <Text style={styles.buttonText}>View Schedule</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d6d6',
  },
  headerContainer: {
    backgroundColor: '#4CAF50',
    padding: 25,
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
  scrollContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  fieldPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
  },
  fieldDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuBadminton;
