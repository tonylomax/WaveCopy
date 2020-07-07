import React from 'react';
import {Button} from 'react-native';

export default function ConfirmButton({title, onPress, testID, disabled}) {
  return (
    <Button disabled={disabled} testID={testID} title={title} onPress={onPress}>
      Button
    </Button>
  );
}
