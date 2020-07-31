import React from 'react';
import {Button, useTheme} from 'react-native-paper';

export default function ConfirmButton({
  title,
  onPress,
  testID,
  disabled,
  style,
  icon,
}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <Button
      icon={icon}
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      style={{
        alignSelf: 'center',
        backgroundColor: colors.tertiary,
        marginTop: style?.marginTop,
      }}
      maxWidth={maxWidth}
      mode="contained"
      disabled={disabled}
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
