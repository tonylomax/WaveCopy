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
  FlatList,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

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

  const DATA = [
    {id: 1, name: 'Fistral', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 2, name: 'Beach2', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 3, name: 'Beach3', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 4, name: 'Beach4', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 5, name: 'Beach5', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 6, name: 'Beach6', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 7, name: 'Beach7', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 8, name: 'Beach8', sessionType: 'Surf Club', mentors: [0, 1, 2]},
    {id: 9, name: 'Beach39', sessionType: 'Surf Club', mentors: [0, 1, 2]},
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>The Wave Project</Text>
        <Text>...coming soon!</Text>
        <Text>Email</Text>
        <TextInput testID="email" />
        <FlatList
          testID={'SessionsList'}
          data={DATA}
          renderItem={({item}) => (
            <View key={item.id} style={{margin: '20%'}}>
              <Text> {item.name} </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
