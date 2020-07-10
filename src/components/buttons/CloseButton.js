import React from 'react';
import {Button, Image} from 'react-native';

export default function CloseButto({title, onPress, testID}) {
  return (
    <Button testID={testID} title={title} onPress={onPress}>
      Button
    </Button>
  );
}
