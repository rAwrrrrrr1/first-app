import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      {/* Logo and Title in one row */}
      <View style={styles.headerRow}>
        <Image
          source={require('../components/Image/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
        <View>
          <Text style={styles.title}>Welcome to WinsArena</Text>
          <Text style={styles.subtitle}>
            Select a field to view details and schedules
          </Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.cardContainer}>
          {/* Card for Badminton */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MenuBadminton')}
          >
            <Image
              source={require('../components/Image/badmin_utama.jpg')} // Replace with your image path
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Icon name="sports-tennis" size={24} color="#4CAF50" />
                <Text style={styles.cardTitle}>Badminton Court</Text>
              </View>
              <Text style={styles.cardDescription}>
                Premium facilities for the best badminton experience.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card for Futsal */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MenuFutsal')}
          >
            <Image
              source={require('../components/Image/futsal_utama.jpg')} // Replace with your image path
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Icon name="sports-soccer" size={24} color="#FF5722" />
                <Text style={styles.cardTitle}>Futsal Court</Text>
              </View>
              <Text style={styles.cardDescription}>
                International standard futsal courts for your matches.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card for Mini Soccer */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MenuSoccer')}
          >
            <Image
              source={require('../components/Image/mini_soccer utama2.jpg')} // Replace with your image path
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Icon name="sports-soccer" size={24} color="#FFC107" />
                <Text style={styles.cardTitle}>Mini Soccer Field</Text>
              </View>
              <Text style={styles.cardDescription}>
                Enjoy the best mini soccer experience.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    padding: 20,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  container: {
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
});

export default Home;
