import React from 'react';
import {Button} from 'react-native-paper';

export default function CallPerson({title, onPress, disabled}) {
  return (
    <Button mode="contained" icon="phone" onPress={onPress} disabled={disabled}>
      {title}
    </Button>
  );
}
