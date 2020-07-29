import React from 'react';
import CustomColours from '../../styles/colours';
import {Button, useTheme} from 'react-native-paper';

export default function CloseButton({title, onPress, testID}) {
  const {colors, maxWidth, fonts} = useTheme();

  return (
    <Button
      color={colors.backdrop}
      style={{alignSelf: 'center'}}
      maxWidth={maxWidth}
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      mode="contained"
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
