import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {subscribeToAllSessions} from '../redux/actions/firestore';

export default function Profile({navigation}) {
  const dispatch = useDispatch();
  const sessions = useSelector(
    (state) => state?.firestoreReducer?.action?.data,
  );

  useEffect(() => {
    dispatch(subscribeToAllSessions());
    console.log(sessions);
  }, []);

  return (
    <View>
      <Text>Profile</Text>
      <Text testID="upcoming-sessions-title">Upcoming sessions</Text>
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
    </View>
  );
}
