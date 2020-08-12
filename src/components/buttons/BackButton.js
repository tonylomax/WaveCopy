import React from 'react';
import {IconButton, useTheme} from 'react-native-paper';
export default function BackButton({
  title,
  onPress,
  testID,
  disabled,
  isLight,
}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <IconButton
      color={isLight ? colors.background : colors.primary}
      size={40}
      icon="arrow-left"
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      elevation={1}
      style={{
        alignSelf: 'center',
        shadowRadius: 0,
        shadowOpacity: 0,
      }}
      maxWidth={maxWidth}
      mode="contained"
      disabled={disabled}
      testID={testID}
      onPress={onPress}></IconButton>
  );
}
