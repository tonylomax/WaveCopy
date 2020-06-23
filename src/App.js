import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
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

  return !loggedIn ? <Home setLoggedIn={setLoggedIn} /> : <Navigator />;
};

export default App;
