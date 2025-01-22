import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text, Alert } from 'react-native';

import Login from './components/Page/Login';
import Register from './components/Page/Register'
import Home from './components/Home';
import Profile from './components/Page/Profile';
import BookingHistory from './components/Page/BookingHistory';
import CancelBooking from './components/Page/CancelBooking';
import EditProfile from './components/Page/EditProfile';
import ChangePassword from './components/Page/ChangePassword';

import MenuBadminton from './components/Page/MenuBadminton';
import MenuFutsal from './components/Page/MenuFutsal';
import MenuSoccer from './components/Page/MenuSoccer';

import JadwalBadminton from './components/Page/JadwalBadminton';
import JadwalFutsal from './components/Page/JadwalFutsal';
import JadwalSoccer from './components/Page/jadwalSoccer';

import Booking from './components/Page/Booking';
import Payment from './components/Page/Payment';
import ConfirmPayment from './components/Page/ConfirmPayment';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = ({ isLoggedIn, setIsLoggedIn }) => (
    <Stack.Navigator>
        {/* Auth Screens */}
        <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
        >
            {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
        >
            {(props) => <Register {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen
            name="Profile"
            options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
        >
            {(props) => <Profile {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="BookingHistory" component={BookingHistory} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
        <Stack.Screen name="CancelBooking" component={CancelBooking} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
        {/* {isLoggedIn && (
            <>
                
                
            </>
        )} */}
    </Stack.Navigator>
);

const AppStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="MenuBadminton" component={MenuBadminton} options={{ headerShown: false }} />
        <Stack.Screen name="MenuFutsal" component={MenuFutsal} options={{ headerShown: false }} />
        <Stack.Screen name="MenuSoccer" component={MenuSoccer} options={{ headerShown: false }} />
        <Stack.Screen name="JadwalBadminton" component={JadwalBadminton} options={{ headerShown: false }} />
        <Stack.Screen name="JadwalFutsal" component={JadwalFutsal} options={{ headerShown: false }} />
        <Stack.Screen name="JadwalSoccer" component={JadwalSoccer} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={Booking} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const MainApp = ({ isLoggedIn, setIsLoggedIn }) => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let iconName;
                let iconColor = focused ? 'black' : '#8E8E93';

                if (route.name === 'Home') {
                    iconName = 'home';
                } else if (route.name === 'Profile') {
                    iconName = 'person';
                }

                return <Ionicons name={iconName} size={24} color={iconColor} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#8E8E93',
        })}
    >
        <Tab.Screen name="Home" component={AppStack} options={{ headerShown: false }} />
        
        <Tab.Screen
            name="Profile"
            options={{ headerShown: false }}
            component={isLoggedIn ? ProfileStack :ProfileStack} // Set AuthStack as the component
        />
    </Tab.Navigator>
);

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
                console.log('Login status from AsyncStorage:', loggedInStatus);
                setIsLoggedIn(loggedInStatus === 'true');
            } catch (error) {
                console.error('Failed to fetch login status:', error);
                setIsLoggedIn(false); // Default to false if there is an error
            }
        };

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <MainApp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Toast />
        </NavigationContainer>
    );
};

export default App;