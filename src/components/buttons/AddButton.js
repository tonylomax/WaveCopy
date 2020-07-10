import React from 'react';
import {Button} from 'react-native';

export default function AddButton({title, onPress, disabled}) {
  return (
    <Button disabled={disabled} title={title} onPress={onPress}>
      Button
    </Button>
  );
}
