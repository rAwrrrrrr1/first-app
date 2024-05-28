import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, Search } from "../screens";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/index";
import { Dimensions } from "react-native";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

//Responsive UI
const Width = Dimensions.get("screen").width;
const Height = Dimensions.get("screen").height;
const HeightWindow = Dimensions.get("window").height;

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (Width / guidelineBaseWidth) * size;
const verticalScale = (size) => (Height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

const screenOptions = {
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 70,
    // paddingBottom: horizontalScale(Platform.OS === "ios" ? 20 : 10),
    // paddingTop: horizontalScale(10),
    // height: horizontalScale(Platform.OS === "ios" ? 90 : 65),
  },
};

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? COLORS.primary : COLORS.gray2} />;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Ionicons name={"search-sharp"} size={24} color={focused ? COLORS.primary : COLORS.gray2} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return <Ionicons name={focused ? "person" : "person-outline"} size={24} color={focused ? COLORS.primary : COLORS.gray2} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
