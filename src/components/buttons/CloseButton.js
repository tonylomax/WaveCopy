import React from 'react';
import CustomColours from '../../styles/colours';
import {Button, useTheme} from 'react-native-paper';

export default function CloseButton({title, onPress, testID}) {
  const {colours, maxWidth} = useTheme();

  return (
    <Button
      maxWidth={maxWidth}
      theme={{colors: {primary: CustomColours.GREY}}}
      mode="contained"
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
