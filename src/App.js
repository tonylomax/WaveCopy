import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import profileIcon from 'WaveVolunteerApp/src/assets/images/Profile_Icon.png';
import settingsIcon from 'WaveVolunteerApp/src/assets/images/Settings_Icon.png';

import Home from './screens/Home';
import Profile from './screens/Profile';
import Settings from './screens/Settings';

const BottomTabs = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <BottomTabs.Navigator>
        <BottomTabs.Screen name="Profile" component={Profile} />
        <BottomTabs.Screen
          name="Settings"
          component={Settings}
          options={{tabBarTestID: 'navigate-to-settings-button'}}
        />
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
};

const App: () => React$Node = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  async function testing() {
    const data = await firestore().collection('Testing').doc('1').get();
    return data;
  }

  useEffect(() => {
    testing()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return !loggedIn ? <Home setLoggedIn={setLoggedIn} /> : <Navigator />;
};

export default App;
