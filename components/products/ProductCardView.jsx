import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const ProductCardView = () => {
  const [products, setProducts] = useState({ badmintons: [], futsals: [], miniSoccers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [badmintonResponse, futsalResponse, miniSoccerResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/badminton'),
        axios.get('http://127.0.0.1:8000/api/futsal'),
        axios.get('http://127.0.0.1:8000/api/soccer')
      ]);
      setProducts({
        badmintons: badmintonResponse.data.data,
        futsals: futsalResponse.data.data,
        miniSoccers: miniSoccerResponse.data.data,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handlePressMessage = (productName) => {
    console.log('Pesan:', productName);
  };

  const renderProductItem = (item) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nama}</Text>
      <Text style={styles.price}>Harga: {item.harga}</Text>
      <Text style={styles.description}>Keterangan: {item.keterangan}</Text>
      <TouchableOpacity onPress={() => handlePressMessage(item.nama)} style={styles.button}>
        <Text style={styles.buttonText}>Pesan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.horizontalListContainer}>
            <Text style={styles.sectionTitle}>Badminton</Text>
            <FlatList
              data={products.badmintons}
              renderItem={({ item }) => renderProductItem(item)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
          <View style={styles.horizontalListContainer}>
            <Text style={styles.sectionTitle}>Futsal</Text>
            <FlatList
              data={products.futsals}
              renderItem={({ item }) => renderProductItem(item)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
          <View style={styles.horizontalListContainer}>
            <Text style={styles.sectionTitle}>Mini Soccer</Text>
            <FlatList
              data={products.miniSoccers}
              renderItem={({ item }) => renderProductItem(item)}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalListContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    width: Dimensions.get('window').width - 20,
  },
  card: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 180,
    backgroundColor: '#fff',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ProductCardView;
