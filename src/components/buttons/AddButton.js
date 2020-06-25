import React from 'react';
import {Button} from 'react-native';

export default function AddButton({title, onPress}) {
  return (
    <Button title={title} onPress={onPress}>
      Button
    </Button>
  );
}
