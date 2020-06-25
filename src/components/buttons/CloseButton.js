import React from 'react';
import {Button, Image} from 'react-native';

export default function CloseButto({title, onPress}) {
  return (
    <Button title={title} onPress={onPress}>
      Button
    </Button>
  );
}
