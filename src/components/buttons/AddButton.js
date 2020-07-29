import React from 'react';
import {Button} from 'react-native-paper';
export default function AddButton({title, onPress, disabled}) {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {title}
    </Button>
  );
}
