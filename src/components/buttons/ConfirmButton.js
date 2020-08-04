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
      labelStyle={{
        fontSize: style?.fontSize,
        marginHorizontal: style?.marginHorizontal,
      }}
      contentStyle={{marginVertical: style?.marginVertical}}
      style={{
        minWidth: style?.minWidth,
        padding: 0,
        maxWidth: style?.maxWidth,
        maxHeight: style?.maxHeight,
        flex: style?.flex,
        width: style?.width,
        margin: style?.margin,
        padding: style?.padding,
        marginRight: style?.marginRight,
        marginBottom: style?.marginBottom,
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
