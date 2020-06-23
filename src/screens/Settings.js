import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function Settings({navigation}) {
  return (
    <View>
      <Text>Settings</Text>
      <Text testID="bio">Bio</Text>
    </View>
  );
}
