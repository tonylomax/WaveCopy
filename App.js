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
import {useSelector, useDispatch} from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import {subscribeToAllSessions} from './src/redux/actions/firestore';

const App: () => React$Node = () => {
  const dispatch = useDispatch();

  const sessions = useSelector(
    (state) => state?.firestoreReducer?.action?.data,
  );

  useEffect(() => {
    dispatch(subscribeToAllSessions());
    console.log(sessions);
  }, []);

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
          data={sessions}
          renderItem={({item}) => (
            <View testID={'SessionsListItem'} id={item.ID}>
              <Text> {item.Beach} </Text>
              <Text> {item.Description} </Text>
              <Text> {item.Beach} </Text>
            </View>
          )}
          keyExtractor={(item) => item.ID}
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
