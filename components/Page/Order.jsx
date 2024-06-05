// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import DatePicker from 'react-native-datepicker';

// const Order = () => {
//   const [selectedDate, setSelectedDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setEndDate(calculateEndDate(date));
//   };

//   const calculateEndDate = (startDate) => {
//     // Assuming 7 days from the start date
//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 7);
//     return endDate.toISOString().slice(0, 10);
//   };

//   const handleOrder = () => {
//     if (selectedDate && endDate) {
//       // Implement order logic here
//       console.log(`Booking from ${selectedDate} to ${endDate}`);
//     } else {
//       alert('Please select a date range.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Booking Dates (7 days)</Text>
//       <View style={styles.dateContainer}>
//         <DatePicker
//           style={styles.datePicker}
//           date={selectedDate}
//           mode="date"
//           placeholder="Select start date"
//           format="YYYY-MM-DD"
//           minDate="2024-01-01"
//           maxDate="2024-12-31"
//           confirmBtnText="Confirm"
//           cancelBtnText="Cancel"
//           onDateChange={handleDateChange}
//         />
//         <Text style={styles.dateLabel}>to</Text>
//         <DatePicker
//           style={styles.datePicker}
//           date={endDate}
//           mode="date"
//           placeholder="Select end date"
//           format="YYYY-MM-DD"
//           minDate={selectedDate}
//           maxDate={calculateEndDate(selectedDate)}
//           confirmBtnText="Confirm"
//           cancelBtnText="Cancel"
//           onDateChange={setEndDate}
//         />
//       </View>
//       <TouchableOpacity style={styles.button} onPress={handleOrder}>
//         <Text style={styles.buttonText}>Place Order</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   datePicker: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   button: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default Order;
