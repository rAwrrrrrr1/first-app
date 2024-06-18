import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import Toast from 'react-native-toast-message';
import Login from './components/Page/Login';
import Register from './components/Page/Register';
import Home from './components/Home';
import Profile from './components/Page/Profile';
import Order from './components/Page/Order';
import Jadwal from './components/Page/Jadwal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
    <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false, tabBarVisible: false }}/>
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
    {/* <Stack.Screen name="Order" component={Order} options={{ headerShown: false }}/> */}
    <Stack.Screen name="Jadwal" component={Jadwal} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={AppStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AuthStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
    <Toast ref={(ref) => Toast.setRef(ref)} />
  </NavigationContainer>
);

export default App;
