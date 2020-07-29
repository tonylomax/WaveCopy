import React from 'react';
import {Button} from 'react-native-paper';

export default function CallPerson({title, onPress}) {
  return <Button onPress={onPress}>{title}</Button>;
}
