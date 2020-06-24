import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Profile from './screens/profile/Profile';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const BottomTabs = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <BottomTabs.Navigator>
        <BottomTabs.Screen name="Home" component={Home} />
        <BottomTabs.Screen
          name="Profile"
          component={Profile}
          options={{tabBarTestID: 'navigate-to-profile-button'}}
        />
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
};

const App: () => React$Node = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return !loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigator />;
};

export default App;
