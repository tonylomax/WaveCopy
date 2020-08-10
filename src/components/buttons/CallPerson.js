import React from 'react';
import {Button} from 'react-native-paper';

export default function CallPerson({title, onPress, disabled, style}) {
  return (
    <Button
      style={style}
      mode="contained"
      icon="phone"
      onPress={onPress}
      disabled={disabled}>
      {title}
    </Button>
  );
}
