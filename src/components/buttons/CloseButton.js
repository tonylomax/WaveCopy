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
      labelStyle={{
        fontSize: style?.fontSize,
        marginHorizontal: style?.marginHorizontal || '1%',
        paddingBottom: style?.paddingBottom,
        paddingLeft: '2%',
        paddingRight: '2%',
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
        marginRight: style?.marginRight,
        marginBottom: style?.marginBottom,
        alignSelf: 'center',
        marginTop: style?.marginTop,
        marginHorizontal: style?.marginHorizontal,
        backgroundColor: colors.backdrop,
      }}
      maxWidth={maxWidth}
      mode="contained"
      testID={testID}
      onPress={onPress}>
      {title}
    </Button>
  );
}
