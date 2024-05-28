import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const ProductCardView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []); // Array dependensi kosong memastikan useEffect hanya dipanggil sekali

  const fetchData = async () => {
    try {
      const [badmintonResponse, futsalResponse, miniSoccerResponse] = await Promise.all([
        fetch('http://192.168.1.11:8000/api/badminton'),
        fetch('http://192.168.1.11:8000/api/futsal'),
        fetch('http://192.168.1.11:8000/api/soccer')
      ]);
      console.log(`Hasil Fetch =  ${badmintonResponse}`);

      const badmintonData = await badmintonResponse.json();
      const futsalData = await futsalResponse.json();
      const miniSoccerData = await miniSoccerResponse.json();

      const sections = [
        { title: 'Badminton', data: badmintonData.data },
        { title: 'Futsal', data: futsalData.data },
        { title: 'Mini Soccer', data: miniSoccerData.data }
      ];
      console.log(sections);

      setData(sections);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nama}</Text>
      <Text style={styles.price}>Harga: {item.harga}</Text>
      <Text style={styles.description}>Keterangan: {item.keterangan}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <SectionList
          sections={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          contentContainerStyle={styles.listContainer}
        />
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
  listContainer: {
    paddingHorizontal: 10,
    width: Dimensions.get('window').width - 20,
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3, // shadow for Android
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    marginBottom: 3,
  },
  description: {
    color: '#666',
  },
});

export default ProductCardView;
