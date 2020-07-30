import React from 'react';
import {Avatar, useTheme} from 'react-native-paper';
import {relativeTimeRounding} from 'moment';
export default function VolunteerAvatar({label, source}) {
  const {maxWidth, colors, fonts} = useTheme();
  return (
    <Avatar.Image
      source={source}
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
