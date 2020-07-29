import React from 'react';
import {Image} from 'react-native';
import {Button} from 'react-native-paper';

export default function CloseButton({title, onPress, testID}) {
  return (
    <Button testID={testID} onPress={onPress}>
      {title}
    </Button>
  );
}
