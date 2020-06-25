// TO DO - merge this with session/EditSession.js
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';

export default function ConfirmSession({route, navigation}) {
  const {
    sessionType,
    sessionDate,
    sessionTime,
    location,
    numberOfVolunteers,
    selectedUsers,
  } = route.params;

  return (
    <View>
      <Text>Edit page</Text>
      <Button title="confirm-changes" testID="confirm-session-details" />
      <Text>
        {sessionType} - {location}
      </Text>
      <Text>Coordinator</Text>

      <Text testID="coordinator-name">Test coordinator</Text>
    </View>
  );
}
