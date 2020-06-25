// TO DO - merge this with session/EditSession.js
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';

export default function ConfirmSession({route, navigation}) {
  const {
    sessionType,
    sessionDate,
    location,
    numberOfVolunteers,
    selectedUsers,
  } = route.params;

  return (
    <View>
      <Text>Confirm session</Text>
    </View>
  );
}
