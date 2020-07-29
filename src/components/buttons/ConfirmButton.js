import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import CustomFonts from '../../styles/typography';

export default function ConfirmButton({title, onPress, testID, disabled}) {
  const {maxWidth} = useTheme();

  return (
    <Button
      style={{alignSelf: 'center'}}
      maxWidth={maxWidth}
      mode="contained"
      disabled={disabled}
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
