import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import {compact} from 'lodash';

export default function ConfirmButton({
  title,
  onPress,
  testID,
  disabled,
  style,
  icon,
  compact,
}) {
  const {maxWidth, colors, fonts} = useTheme();

  return (
    <Button
      compact={compact}
      icon={icon}
      theme={{
        fonts: {
          medium: fonts.button,
        },
      }}
      labelStyle={{
        fontSize: style?.fontSize,
        marginHorizontal: style?.marginHorizontal || '1%',
        paddingBottom: style?.paddingBottom,
      }}
      contentStyle={{
        marginVertical: style?.marginVertical,
      }}
      style={{
        minWidth: style?.minWidth,

        maxWidth: style?.maxWidth,
        maxHeight: style?.maxHeight,
        flex: style?.flex,
        width: style?.width,
        margin: style?.margin,
        // padding: style?.padding,
        marginRight: style?.marginRight,
        marginBottom: style?.marginBottom,
        alignSelf: 'center',
        backgroundColor: colors.tertiary,
        marginTop: style?.marginTop,
        marginHorizontal: style?.marginHorizontal,
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
