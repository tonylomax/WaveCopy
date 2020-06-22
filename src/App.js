import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Home from './components/Home';
import Profile from './components/Profile';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: () => React$Node = () => {
  async function testing() {
    const data = await firestore().collection('Testing').doc('1').get();
    return data;
  }

  useEffect(() => {
    testing()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);

  return <Navigator />;
};

export default App;
