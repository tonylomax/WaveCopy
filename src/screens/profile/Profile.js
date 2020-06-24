import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';

export default function Profile({navigation}) {
  return (
    <View>
      <Text>Profile</Text>
      <Text testID="bio">Bio</Text>
    </View>
  );
}
