import React from 'react';
import {Button, useTheme} from 'react-native-paper';
export default function ConfirmButton({title, onPress, testID, disabled}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <Button
      color={colors.surface}
      icon="arrow-left"
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      elevation={1}
      labelStyle={{color: colors.primary, fontSize: 36}}
      style={{
        // borderStyle: 1,
        alignSelf: 'center',
        shadowRadius: 0,
        shadowOpacity: 0,
      }}
      maxWidth={maxWidth}
      mode="contained"
      disabled={disabled}
      testID={testID}
      onPress={onPress}></Button>
  );
}
