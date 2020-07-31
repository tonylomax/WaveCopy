import React from 'react';
import {Button} from 'react-native-paper';
import {View} from 'react-native';
import {ConfirmButton} from '../../components/';
export default function CallPerson({title, onPress, disabled}) {
  return (
    <View style={{padding: 10}}>
      <ConfirmButton
        icon="phone"
        onPress={onPress}
        title={title}
        disabled={disabled}></ConfirmButton>
    </View>
  );
}
