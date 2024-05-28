import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const ProductCardView = () => {
  const [badmintons, setBadmintons] = useState([]);
  const [futsals, setFutsals] = useState([]);
  const [miniSoccers, setMiniSoccers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [badmintonResponse, futsalResponse, miniSoccerResponse] = await Promise.all([
        axios.get('http://192.168.1.20:8000/api/badminton'),
        axios.get('http://192.168.1.20:8000/api/futsal'),
        axios.get('http://192.168.1.20:8000/api/soccer')
      ]);
      setLoading(false);
      setBadmintons(badmintonResponse.data.data);
      setFutsals(futsalResponse.data.data);
      setMiniSoccers(miniSoccerResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePressMessage = (productName) => {
    // Tambahkan logika untuk menangani tombol pesan di sini
    console.log('Pesan:', productName);
  };

  const renderBadmintonItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nama}</Text>
      <Text style={styles.price}>Harga: {item.harga}</Text>
      <Text style={styles.description}>Keterangan: {item.keterangan}</Text>
      <TouchableOpacity onPress={() => handlePressMessage(item.nama)} style={styles.button}>
        <Text style={styles.buttonText}>Pesan</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFutsalItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nama}</Text>
      <Text style={styles.price}>Harga: {item.harga}</Text>
      <Text style={styles.description}>Keterangan: {item.keterangan}</Text>
      <TouchableOpacity onPress={() => handlePressMessage(item.nama)} style={styles.button}>
        <Text style={styles.buttonText}>Pesan</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderMiniSoccerItem = ({ item }) => (
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
      ) : (
        <View>
          <View style={styles.horizontalListContainer}>
            <Text style={styles.sectionTitle}>Badminton</Text>
            <FlatList
              data={badmintons}
              renderItem={renderBadmintonItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
          <View style={styles.verticalListContainer}>
            <Text style={styles.sectionTitle}>Futsal</Text>
            <FlatList
              data={futsals}
              renderItem={renderFutsalItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
          <View style={styles.verticalListContainer}>
            <Text style={styles.sectionTitle}>Mini Soccer</Text>
            <FlatList
              data={miniSoccers}
              renderItem={renderMiniSoccerItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
            />
          </View>
        </View>
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
  verticalListContainer: {
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
});


export default ProductCardView;
