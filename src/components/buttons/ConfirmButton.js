import React from 'react';
import {Button, useTheme} from 'react-native-paper';

export default function ConfirmButton({title, onPress, testID, disabled}) {
  const {maxWidth} = useTheme();
  return (
    <Button
      maxWidth={maxWidth}
      mode="contained"
      disabled={disabled}
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
