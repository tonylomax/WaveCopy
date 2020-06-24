import React from 'react';
import {View, Text} from 'react-native';

export default function AddServiceUsers({route, navigation}) {
  const {sessionType, sessionDate, location, numberOfVolunteers} = route.params;

  return (
    <View>
      <Text>{sessionType}</Text>
      {/* <Text>{sessionDate}</Text> */}
    </View>
  );
}
