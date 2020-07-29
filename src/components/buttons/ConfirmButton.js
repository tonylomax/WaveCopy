import React from 'react';
import {Button} from 'react-native-paper';

export default function ConfirmButton({title, onPress, testID, disabled}) {
  return (
    <Button disabled={disabled} testID={testID} onPress={onPress}>
      {title}
    </Button>
  );
}
