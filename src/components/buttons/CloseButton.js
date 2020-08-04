import React from 'react';
import CustomColours from '../../styles/colours';
import {Button, useTheme} from 'react-native-paper';

export default function CloseButton({title, onPress, testID, style}) {
  const {colors, maxWidth, fonts} = useTheme();

  return (
    <Button
      maxWidth={maxWidth}
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      style={{
        flex: style?.flex,
        alignSelf: 'center',
        backgroundColor: colors.backdrop,
      }}
      mode="contained"
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
