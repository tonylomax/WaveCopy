import React from 'react';
import {Button} from 'react-native-paper';
import {View} from 'react-native';
import {ConfirmButton} from '../../components/';
export default function CallPerson({title, onPress}) {
  return (
    <View style={{padding: 10}}>
      <ConfirmButton onPress={onPress} title={title}></ConfirmButton>
    </View>
  );
}
