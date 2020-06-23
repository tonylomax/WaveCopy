import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function Profile({navigation}) {
  return (
    <View>
      <Text>Profile</Text>
      <Text testID="upcoming-sessions-title">Upcoming sessions</Text>
    </View>
  );
}
