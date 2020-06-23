/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
} from 'react-native';
import {FONTS} from './src/styles';

import firestore from '@react-native-firebase/firestore';

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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text style={FONTS.H1}>The Wave Project</Text>
        <Text style={FONTS.BODY}>...coming soon!</Text>
        <Text>Email</Text>
        <TextInput testID="email" />
      </SafeAreaView>
    </>
  );
};

export default App;
