import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
export default function SurferAvatar({label, style}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <Avatar.Text
      label={label}
      size={100}
      color={colors.dark_second}
      style={{
        margin: style?.margin,
        position: 'absolute',
        display: 'flex',
        alignSelf: style?.alignSelf || 'center',
        top: 130,
        backgroundColor: colors.accent,
        borderColor: colors.surface,
        borderWidth: 3,
      }}
    />
  );
}
