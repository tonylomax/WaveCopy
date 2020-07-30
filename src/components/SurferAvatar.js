import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
export default function SurferAvatar({label}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <Avatar.Text
      label={label}
      size={100}
      color={colors.dark_second}
      style={{
        position: 'absolute',
        display: 'flex',
        alignSelf: 'center',
        top: 130,
        backgroundColor: colors.accent,
        borderColor: colors.surface,
        borderWidth: 3,
      }}
    />
  );
}
