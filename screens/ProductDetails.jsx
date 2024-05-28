import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./productDetails.style";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const ProductDetails = ({ navigation }) => {
  const [selectedSession, setSelectedSession] = useState("Session 1");
  const sessions = ["Session 1", "Session 2", "Session 3", "Session 4"];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: "https://images.unsplash.com/photo-1599677104038-58d80f6976e0?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} style={styles.image} />

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Basketball Field</Text>
          <View style={styles.wrapper}>
            <Text style={styles.price}>50.000</Text>
          </View>
        </View>
        <View style={styles.desc}>
          <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint porro aut rerum, ducimus fugit error dolores amet voluptas architecto animi!</Text>
          <View style={{ marginTop: 20 }}>
            <Picker style={styles.picker} selectedValue={selectedSession} onValueChange={(itemValue, itemIndex) => setSelectedSession(itemValue)}>
              {sessions.map((session, index) => (
                <Picker.Item key={index} label={session} value={session} />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Tambah Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;
