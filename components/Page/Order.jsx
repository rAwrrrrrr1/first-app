import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Order = () => {
  const route = useRoute();
  const { fieldType, fieldName } = route.params;

  const handleOrder = () => {
    // Implement order logic here
    console.log(`Ordered ${fieldName} (${fieldType})`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Lapangan</Text>
      <Text style={styles.fieldName}>Lapangan: {fieldName}</Text>
      <Text style={styles.fieldType}>Tipe: {fieldType}</Text>
      <Button title="Konfirmasi Pesanan" onPress={handleOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldName: {
    fontSize: 18,
    marginBottom: 10,
  },
  fieldType: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Order;
